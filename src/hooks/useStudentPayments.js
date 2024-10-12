import { useState, useEffect } from "react";
import axios from "axios";
import useGetLatestFee from "./useGetLatestFee";

const useStudentPayments = (studentId) => {
    const { latestFee, loading: feeLoading } = useGetLatestFee();
    const [unpaidMonths, setUnpaidMonths] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (feeLoading || !latestFee) return;

        const fetchUnpaidMonths = async () => {
            try {
                const response = await axios.get(`https://gfkapp-api.onrender.com/api/students/${studentId}`);
                const student = response.data;

                // Get the months that the student has not paid
                const unpaidMonths = student.payments.reduce((acc, paymentYear) => {
                    if (paymentYear.year >= 2024 && paymentYear.year <= 2026) {
                        const monthsWithUnpaid = paymentYear.months.filter((month) => {
                            return month.amount < latestFee;
                        });
                        if (monthsWithUnpaid.length > 0) {
                            acc[paymentYear.year] = { year: paymentYear.year, months: monthsWithUnpaid };
                        }
                    }
                    return acc;
                }, []);

                setUnpaidMonths(unpaidMonths);
            } catch (error) {
                console.error("Eksik odeme bilgileri alinamadi(useStudentPayments.js):", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUnpaidMonths();
    }, [studentId, latestFee, feeLoading]);
    return { unpaidMonths, loading };
};
export default useStudentPayments;
