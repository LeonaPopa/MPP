import React, {useEffect} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import TeaList from './components/TeaList';
import TeaForm from './components/TeaForm';
import TeaDetails from './components/TeaDetails';
import NavBar from './components/NavBar';
import {useTeaStore} from "./state/TeaStore";
import axios from "axios";
import {socket} from "./socket";


function App() {
    const {setTeas} = useTeaStore();
    useEffect(() => {
        // Load initial data
        const loadData = () => {
            axios.get('http://localhost:3000/teas')
                .then((res) => {
                    setTeas(res.data);
                })
                .catch(() => {
                    window.alert("Server is down!");
                });
        };
        loadData();

        // Handle socket connection
        socket.on('connect', () => {
            console.log('Connected to server via Socket.IO');
        });

        // Example: listen to a "new-tea" event
        socket.on('tea created', (newTea) => {
            setTeas(teas => [...teas, newTea]);
        });

        return () => {
            socket.off('connect');
            socket.off('tea created');
        };
    }, []);
    const loadData = (axiosInstance) => {
        axiosInstance.get('http://localhost:3000/teas').then((res) => {
            setTeas(res.data)
        }).catch(()=>{
                window.alert("Server is down!");
                setTimeout(()=>{loadData(axiosInstance)}, 5000);
            }
        )
    }

    useEffect(()=>{
        const axiosInstance = axios.create({baseUrl: "http://localhost:3001"});
        loadData(axiosInstance);
        }, []
    )

    return (
        <Router>
            <div>
                <NavBar/>
                <Routes>
                    <Route path="/teas" element={<TeaList/>}/>
                    <Route path="/tea/add" element={<TeaForm/>}/>
                    <Route path="/tea/edit/:id" element={<TeaForm/>}/>
                    <Route path="/tea/details/:id" element={<TeaDetails/>}/>
                </Routes>
            </div>
        </Router>
    );
}

export default App;