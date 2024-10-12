import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import { TextInput } from "react-native-gesture-handler";
import { Button, View, StyleSheet, Text } from "react-native";
//REDUX
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/slices/userSlice";
//AXIOS
import axios from "axios";

export default function LoginScreen() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(""); // Errorlar yukaridan gelen toast messagelar icin component yapilacak.
    const dispatch = useDispatch();

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                console.log("Giris basarili !", userCredential);

                //MONGO DB' den users tablosundan ilgili userdan student ve parent ID yi alip redux store a atilacak.
                try {
                    const response = await axios.get(`https://gfkapp-api.onrender.com/api/users/firebase/${user.uid}`);
                    const userData = response.data;
                    console.log("User data from MongoDB:", userData);

                    dispatch(
                        setUser({
                            email: user.email,
                            uid: user.uid,
                            parentId: userData.parentId,
                            role: userData.role,
                        })
                    );
                } catch (mongoError) {
                    console.error("MongoDB'den kullanıcı verisi alınamadı:", mongoError);
                }
            })
            .catch((error) => {
                console.error("Giris basarisiz !", error);
                setError(error.message);
            });
    };

    return (
        <View style={styles.container}>
            <Text>Login</Text>
            <TextInput placeholder="Email" value={email} onChangeText={(text) => setEmail(text)} style={styles.input} autoCapitalize={false} />
            <TextInput placeholder="Password" value={password} onChangeText={(text) => setPassword(text)} secureTextEntry style={styles.input} />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button title="Login" onPress={handleLogin} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    input: {
        width: "100%",
        padding: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom: 10,
        borderRadius: 5,
    },
    error: {
        color: "red",
        marginBottom: 10,
    },
});
