import axios from "axios";
import { API_CREATE_USER } from "../constants/api";

export const createUserInBackend = async (email, firebaseUID, parentId) => {
    try {
        const createUserUrl = API_CREATE_USER || "https://gfkapp-api.onrender.com/api/users";
        const response = await axios.post(createUserUrl, {
            email: email,
            firebaseUID: firebaseUID,
            parentId: parentId,
            role: "parent",
        });
        return response.data;
    } catch (error) {
        console.error("Create User Error:", error);
        throw error;
    }
};
