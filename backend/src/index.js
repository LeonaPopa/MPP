const {getAllItems} = require('../repository/repository')
const express = require('express');
const dotenv = require('dotenv');
const http = require('http'); //for socket
const {Server} = require('socket.io')//for socket
const mysql = require('mysql2');
dotenv.config();


const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();



const app = express();
const port = process.env.PORT;
app.use(express.json());
const { v4: uuidv4 } = require('uuid');

const httpServer = http.createServer(app);
const io = new Server(httpServer);

const cors = require('cors');
app.use(cors({
    origin: "http://localhost:3001",
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true
}));

let teas =  [];

//get all option to sort
router.get('/teas', async (req, res) => {
    try {
        // Start with a basic query
        let sqlQuery = 'SELECT * FROM teas';
        // Check if the 'order' query parameter is provided and valid
        if (req.query.order && (req.query.order.toUpperCase() === 'ASC' || req.query.order.toUpperCase() === 'DESC')) {
            sqlQuery += ` ORDER BY levelOfSpicy ${req.query.order}`;
        } else {
            // Default sorting order if 'order' query parameter is not provided or invalid
            sqlQuery += ' ORDER BY levelOfSpicy ASC'; // Default is ascending order
        }

        const [rows] = await pool.query(sqlQuery);
        res.json(rows);
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).send('Server error');
    }
});

//get by id
app.get("/teas/:id", async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM teas WHERE id = ?', [req.params.id]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ message: "Tea not found" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
//create
app.post("/teas/create", async (req, res) => {
    try {
        const { name, description, level } = req.body;
        const [result] = await pool.query('INSERT INTO teas (name, description, level) VALUES (?, ?, ?)', [name, description, level]);
        const [newTea] = await pool.query('SELECT * FROM teas WHERE id = ?', [result.insertId]);
        io.emit('tea created', newTea[0]);
        res.status(201).json(newTea[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//update
app.patch("/teas/:id", async (req, res) => {
    try {
        const { name, description, level } = req.body;
        await pool.query('UPDATE teas SET name = ?, description = ?, level = ? WHERE id = ?', [name, description, level, req.params.id]);
        const [updatedTea] = await pool.query('SELECT * FROM teas WHERE id = ?', [req.params.id]);
        if (updatedTea.length > 0) {
            io.emit('tea updated', updatedTea[0]);
            res.json(updatedTea[0]);
        } else {
            res.status(404).json({message: "Tea not found"});
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

//delete
app.delete("/teas/:id", async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM teas WHERE id = ?', [req.params.id]);
        if (result.affectedRows > 0) {
            io.emit('tea deleted', { id: req.params.id });
            res.status(204).send();
        } else {
            res.status(404).json({message: "Tea not deleted"});
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

httpServer.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

io.on('connection', socket => {
    console.log('Client connected');
    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

// POST a new review
app.post("/teas/:teaId/reviews", async (req, res) => {
    const { title, content } = req.body;
    const teaId = req.params.teaId;
    try {
        const [result] = await pool.query('INSERT INTO reviews (tea_id, title, content) VALUES (?, ?, ?)', [teaId, title, content]);
        res.status(201).json({ id: result.insertId, teaId, title, content });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// GET all reviews for a specific tea
app.get("/teas/:teaId/reviews", async (req, res) => {
    const teaId = req.params.teaId;
    try {
        const [rows] = await pool.query('SELECT * FROM reviews WHERE tea_id = ?', [teaId]);
        res.json(rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// PATCH an existing review
app.patch("/reviews/:reviewId", async (req, res) => {
    const { title, content } = req.body;
    const reviewId = req.params.reviewId;
    try {
        await pool.query('UPDATE reviews SET title = ?, content = ? WHERE id = ?', [title, content, reviewId]);
        const [updatedReview] = await pool.query('SELECT * FROM reviews WHERE id = ?', [reviewId]);
        res.json(updatedReview[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});
// DELETE a review
app.delete("/reviews/:reviewId", async (req, res) => {
    const reviewId = req.params.reviewId;
    try {
        const [result] = await pool.query('DELETE FROM reviews WHERE id = ?', [reviewId]);
        if (result.affectedRows > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Review not found" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = { app, httpServer, io };
