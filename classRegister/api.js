const API_URL = 'http://localhost:3000/courseList';


const API ={


    getClasses: async () => {
        const response = await fetch(API_URL);
        const data = await response.json();
        return data;
    },









}