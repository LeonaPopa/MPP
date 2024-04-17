import {create} from "zustand"
import axios from "axios"
import {socket} from "../socket";

export const useTeaStore = create()(
    (set, get) => ({
        teas: [],

        setTeas: newTeas => set({ teas: newTeas }),

        addTea: newTea => set(state => ({ teas: [...state.teas, newTea] })),

        updateTeaInList: updatedTea => set(state => ({
            teas: state.teas.map(tea => tea.id === updatedTea.id ? updatedTea : tea)
        })),

        removeTea: id => set(state => ({
            teas: state.teas.filter(tea => tea.id !== id)
        })),

        // Axios POST to create a new tea
        createTea: tea => axios.post('http://localhost:3000/teas/create', tea)
            .then(response => {
                get().addTea(response.data);
            })
            .catch(error => {
                window.alert("Error creating tea: " + error.message);
            }),

        // Axios PATCH to update an existing tea
        updateTea: tea => axios.patch(`http://localhost:3000/teas/${tea.id}`, tea)
            .then(response => {
                get().updateTeaInList(response.data);
            })
            .catch(error => {
                window.alert("Error updating tea: " + error.message);
            }),

        // Axios DELETE to remove a tea
        deleteTea: id => axios.delete(`http://localhost:3000/teas/${id}`)
            .then(() => {
                get().removeTea(id);
                console.log("Tea deleted successfully");
            })
            .catch(error => {
                window.alert("Error deleting tea: " + error.message);
                // Revert optimistic update on error
                get().getTeas();
            }),

        // Axios GET to fetch all teas
        getTeas: () => axios.get('http://localhost:3000/teas')
            .then(response => {
                set({ teas: response.data });
            })
            .catch(error => {
                window.alert("Error fetching teas: " + error.message);
            })
    })
)

socket.on('tea created', tea => {
    useTeaStore.getState().addTea(tea);
});

socket.on('tea updated', tea => {
    useTeaStore.getState().updateTeaInList(tea);
});

socket.on('tea deleted', id => {
    useTeaStore.getState().removeTea(id);
});