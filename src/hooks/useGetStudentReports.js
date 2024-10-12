import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://gfkapp-api.onrender.com/api/reports";

// Generic hook
const useGetStudentReports = (studentId) => {
    const [reports, setReports] = useState([]);
    const [studentsWithoutReport, setStudentsWithoutReport] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReports = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/student/${studentId}`);
            setReports(response.data.data.reports);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAllReports = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}`);
            setReports(response.data.data.reports);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchStudentsWithoutReportForCurrentMonth = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/students-without-report`);
            setStudentsWithoutReport(response.data.data.studentsWithoutReports);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const deleteReport = async (reportId) => {
        try {
            const response = await axios.delete(`${BASE_URL}/${reportId}`);
            if (response.status === 200) {
                setReports(reports.filter((report) => report._id !== reportId));
            }
        } catch (err) {
            setError(err);
        }
    };

    const createReport = async (newReport) => {
        try {
            const response = await axios.post(`${BASE_URL}`, newReport);
            if (response.status === 201) {
                setReports((prevReports) => [...prevReports, response.data]);
            }
        } catch (err) {
            setError(err);
        }
    };

    useEffect(() => {
        fetchStudentsWithoutReportForCurrentMonth();
        if (studentId) {
            fetchReports();
        }
    }, [studentId]);

    return {
        reports,
        studentsWithoutReport,
        loading,
        error,
        fetchReports,
        fetchAllReports,
        deleteReport,
        createReport,
        fetchStudentsWithoutReportForCurrentMonth,
    };
};

export default useGetStudentReports;
