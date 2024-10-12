import { useState, useEffect } from "react";
import { ENUMS } from "../constants/enum";

const useCurrentMonthName = () => {
    const [currentMonthName, setCurrentMonthName] = useState("");

    useEffect(() => {
        const currentMonth = new Date().getMonth();
        setCurrentMonthName(ENUMS.MONTHS_TR[currentMonth]);
    }, []);

    return currentMonthName;
};

export default useCurrentMonthName;
