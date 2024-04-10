import React, { useEffect, useState } from "react";
import {useParams} from 'react-router-dom';
import './TeaDetails.css'
import {useTeaStore} from "../state/TeaStore";
const TeaDetails = () => {
    const [tea, setTea] = useState(null);
    const {id} = useParams();
    const {teas}=useTeaStore();

    useEffect(() => {
        const fetchedTea = teas.find(tea => tea.id === id);
        console.log(fetchedTea);
        setTea(fetchedTea);
    }, [id, teas]);


    if(!tea) return <div>Loading...</div>;

    return(
        <div>
            <h1>Tea Details</h1>
            <h2>Person it's about:</h2> <p>{tea.person}</p>
            <h2>Description: </h2> <p>{tea.description}</p>
            <h2>Level of spicy: </h2> <p>{tea.levelOfSpicy}</p>
        </div>
    );
};

export default TeaDetails;