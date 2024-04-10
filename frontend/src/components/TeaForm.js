import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import './TeaForm.css';
import {useTeaStore} from "../state/TeaStore";
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TeaForm = () => {
    const [tea, setTea] = useState(() => ({id: uuidv4(), person: '', description: '', levelOfSpicy: ''}));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();
    const {teas, createTea, updateTea}=useTeaStore();


    useEffect(() => {
        if (id) {
            setLoading(true);
            try {
                const fetchedTea = teas.find(tea => tea.id === id);
                setTea(fetchedTea);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
                setError('Failed to load tea details.');
            }
        }
    }, [id, teas]);

    const handleChange = (e) => {
        setTea({ ...tea, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const action = id ? updateTea : createTea;
        action(tea)
            .then(() => {
                toast.success(`Tea ${id ? 'updated' : 'added'} successfully!`);
                navigate('/teas');
            })
            .catch(err => {
                console.error(err);
                setError('Failed to save tea details.');
                toast.error(`Failed to ${id ? 'update' : 'add'} tea: ${err.message}`);
            })
            .finally(() => setLoading(false));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <form onSubmit={handleSubmit}>
                <label>
                    Person:
                    <input type="text" name="person" value={tea.person} onChange={handleChange} required />
                </label>
                <label>
                    Description:
                    <input type="text" name="description" value={tea.description} onChange={handleChange} required />
                </label>
                <label>
                    Level of Spicy:
                    <input type="text" name="levelOfSpicy" value={tea.levelOfSpicy} onChange={handleChange} required />
                </label>
                <button type="submit" disabled={loading}>{id ? 'Update' : 'Add'}</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
};

export default TeaForm;
