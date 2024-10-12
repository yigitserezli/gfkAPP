import { useState, useEffect } from "react";
import axios from "axios";
import { ENDPOINTS } from "../constants/api";

const useStudent = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
   

    const fetchStudents = async () => {
        try {
            const response = await axios.get(ENDPOINTS.FETCH_STUDENTS);
            // const response = await axios.get("https://5aef-2a00-1858-1021-9509-d8df-cba0-5da6-e849.ngrok-free.app/api/students");
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchStudents();
    }, []);
    return { students, loading, fetchStudents };
};

export default useStudent;
