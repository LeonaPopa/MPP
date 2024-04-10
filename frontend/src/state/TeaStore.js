import {create} from "zustand"
import axios from "axios"

export const useTeaStore = create()(
    (set, get) => ({
        teas: [],
        setTeas: (newteas)=>{
            set({teas: newteas})
        },
        createTea: (tea) => {
            return axios
                .post('http://localhost:3000/teas/create',tea)
                .then((response)=> {
                    set({ teas: [...get().teas, response.data] });
                })
                .catch((error)=>{
                    window.alert(error.message.contains("NetworkError")?"server is down":`An error occurred at create: ${error.message}`);
                });
        },
        updateTea: (tea) => {
            return axios
                .patch(`http://localhost:3000/teas/${tea.id}`, tea)
                .then((response)=>{
                    set({ teas: get().teas.map(t => t.id === response.data.id ? tea : t) });
                })
                .catch((error)=>{
                    window.alert(error.message.contains("NetworkError")?"server is down":`An error occurred at update: ${error.message}`);
                })
        },
        deleteTea: (id) => {
            const updatedTeas = get().teas.filter(tea => tea.id !== id);  // Prepare optimistic update
            set({ teas: updatedTeas });  // Optimistically update UI

            return axios
                .delete(`http://localhost:3000/teas/${id}`)
                .then(() => {
                    console.log("Tea deleted successfully");
                })
                .catch((error) => {
                    window.alert(error.message.contains("NetworkError")?"server is down":`An error occurred at delete: ${error.message}`);
                    set({ teas: get().teas });
                });
        },
        getTeas: async () => {
            try {
                const response = await axios.get('http://localhost:3000/teas');
                set({ teas: response.data });
            } catch (error) {
                window.alert(error.message.contains("NetworkError")?"server is down":`${error.message}`);
            }
        }
    })
)