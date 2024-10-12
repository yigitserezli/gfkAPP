import React from "react";
import { Button } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { removeUser } from "../redux/slices/userSlice";

export default function SignOutButton() {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            console.log("Çıkış başarılı!");
            await AsyncStorage.removeItem("user");
            dispatch(removeUser());
            navigation.navigate("Login");
        } catch (error) {
            console.error("Çıkış başarısız!", error);
        }
    };

    return <Button title="Çıkış Yap" onPress={handleSignOut} />;
}
