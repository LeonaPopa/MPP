import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import './TeaList.css';
import {useTeaStore} from "../state/TeaStore";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TeaList = () => {
    const [selectedTeas, setSelectedTeas] = useState([]);
    const {teas, deleteTea}=useTeaStore();

    const exportToJson = (teas) => {
        const filename = 'teasList.json';
        const jsonStr = JSON.stringify(teas, null, 2);
        const element = document.createElement('a');
        element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonStr));
        element.setAttribute('download', filename);

        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const handleSelectTea = (id) => {
        setSelectedTeas(prevSelected =>
            prevSelected.includes(id) ? prevSelected.filter(tid => tid !== id) : [...prevSelected, id]
        );
    };

    const handleBulkDelete = async () => {
        try {
            toast.success("Teas deleted successfully!");
            await Promise.all(selectedTeas.map(id => deleteTea(id)));
        } catch (error) {
            toast.error("Failed to delete teas: " + error.message);
        }
    };



    return (
        <div>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <h1>Teas List</h1>
            <hr></hr>
            <div>
                <button onClick={() => exportToJson(teas)}>Export to JSON</button>
                <button onClick={handleBulkDelete}>Delete Selected</button>
            </div>
            <div className="tea-container">
                {teas.map((tea) => (
                    <div key={tea.id} className="tea-box">
                        <div>
                            <table>
                                <tbody>
                                <tr>
                                    <th>
                                        Person
                                    </th>
                                    <th>
                                        Level of Spice 🔥
                                    </th>
                                </tr>
                                <tr>
                                    <td>
                                        {tea.person}
                                    </td>
                                    <td>
                                        {tea.levelOfSpicy}
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                            <input
                                type="checkbox"
                                checked={selectedTeas.includes(tea.id)}
                                onChange={() => handleSelectTea(tea.id)}
                            />
                        </div>
                        <div className="actions">
                            <button><Link to={`/tea/edit/${tea.id}`}>Edit</Link></button>
                            <button><Link to={`/tea/details/${tea.id}`}>View</Link></button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeaList;
