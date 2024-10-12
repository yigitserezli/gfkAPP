import { useState, useEffect } from "react";
import axios from "axios";

const useGetLatestFee = () => {
    const [latestFee, setLatestFee] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchLatestFee = async () => {
        try {
            const response = await axios.get("https://gfkapp-api.onrender.com/api/fees/");
            setLatestFee(response.data);
        } catch (error) {
            console.error("Error fetching latest fee:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLatestFee();
    }, []);
    return { latestFee, loading, fetchLatestFee };
};

export default useGetLatestFee;
