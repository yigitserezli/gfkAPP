import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const createFirebaseUser = async (email, password) => {
    const auth = getAuth();
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential.user;
    } catch (error) {
        console.error("Create Firebase User Error:", error);
        return error;
    }
};
export default createFirebaseUser;