
const express = require('express');
const router = express.Router();

let userId = 0;
let users = {};

// GET all users
router.get('/', function(req, res) {
  res.status(200).json(Object.values(users));
});

// GET one user by id
router.get('/:id', function(req, res) {
  const user = users[req.params.id];
  if (user) {
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// POST create a new user
router.post('/', function(req, res) {
  const user = {
    id: ++userId,
    name: req.body.name
  };
  users[user.id] = user;
  res.status(201).json(user);
});

// PATCH update a user
router.patch('/:id', function(req, res) {
  const user = users[req.params.id];
  if (user) {
    user.name = req.body.name;
    res.status(200).json(user);
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// DELETE a user
router.delete('/:id', function(req, res) {
  if (users[req.params.id]) {
    delete users[req.params.id];
    res.status(204).end();
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

module.exports = router;
