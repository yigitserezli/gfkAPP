import { useState, useEffect } from "react";
import axios from "axios";

const useStatistic = () => {
    const [statistics, setStatistics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStatistics = async () => {
        try {
            setLoading(true);
            const response = await axios.get("https://gfkapp-api.onrender.com/api/statistics");
            setStatistics(response.data);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, []);

    return { statistics, loading, error };
}

export default useStatistic;