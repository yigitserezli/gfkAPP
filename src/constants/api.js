import { API_FETCH_STUDENT, API_UPDATE_PARENT_WITH_UID, API_FETCH_USERS, API_CREATE_USER } from "@env";

export const ENDPOINTS = {
    FETCH_STUDENTS: API_FETCH_STUDENT || "https://gfkapp-api.onrender.com/api/students",
    DELETE_STUDENT: API_FETCH_STUDENT || "https://gfkapp-api.onrender.com/api/students/",
    UPDATE_PARENT_WITH_UID: API_UPDATE_PARENT_WITH_UID || "https://gfkapp-api.onrender.com/api/parents/",
    FETCH_USERS: API_FETCH_USERS || "https://gfkapp-api.onrender.com/api/users",
    CREATE_USER: API_CREATE_USER || "https://gfkapp-api.onrender.com/api/users",
};
