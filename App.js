import React, { useState, useEffect } from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
//FONT
import * as Font from "expo-font";
//AUTH IMPORTS
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth } from "./src/config/firebase";
import { onAuthStateChanged } from "firebase/auth";
//NAVIGATION IMPORTS
import MainNavigator from "./src/navigation/MainNavigator";
import FullScreenLoader from "./src/components/FullScreenLoader";
//REDUX IMPORTS
import { Provider, useDispatch } from "react-redux";
import store from "./src/redux/store";
import { setUser, removeUser } from "./src/redux/slices/userSlice";
//NATIVE BASE IMPORTS
import { NativeBaseProvider } from "native-base";
//TOAST IMPORTS
import Toast from "react-native-toast-message";


export default function App() {
    return (
        <NativeBaseProvider>
            <Provider store={store}>
                <AppContent />
                <Toast ref={(ref) => Toast.setRef(ref)} />
            </Provider>
        </NativeBaseProvider>
    );
}

function AppContent() {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const loadFonts = async () => {
        await Font.loadAsync({
            "Poppins-Bold": require("./src/assets/fonts/Poppins-Bold.ttf"),
            "Poppins-SemiBold": require("./src/assets/fonts/Poppins-SemiBold.ttf"),
            "Poppins-Medium": require("./src/assets/fonts/Poppins-Medium.ttf"),
            "Poppins-Regular": require("./src/assets/fonts/Poppins-Regular.ttf"),
            "Poppins-Light": require("./src/assets/fonts/Poppins-Light.ttf"),
            "Poppins-ExtraLight": require("./src/assets/fonts/Poppins-ExtraLight.ttf"),
            "Poppins-Thin": require("./src/assets/fonts/Poppins-Thin.ttf"),
        });
    };

    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const storedUser = await AsyncStorage.getItem("user");
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    const cleanedStoredUser = {
                        uid: parsedUser.uid,
                        email: parsedUser.email,
                        parentId: parsedUser.parentId || "",
                        role: parsedUser.role || "",
                    };
                    dispatch(setUser(cleanedStoredUser));
                }
            } catch (error) {
                console.error("AsyncStorage'dan kullanıcı bilgisi alınamadı", error);
            } finally {
                setLoading(false);
            }
        };

        checkUserSession();

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // Sadece gerekli alanları Redux'a kaydetmek için kullanıcıyı temizliyoruz.
                const cleanedUser = {
                    uid: user.uid,
                    email: user.email,
                    parentId: "",
                    role: "",
                };
                dispatch(setUser(cleanedUser)); // Redux state'e temizlenmiş veriyi kaydediyoruz.
                await AsyncStorage.setItem("user", JSON.stringify(cleanedUser));
            } else {
                dispatch(removeUser()); // Kullanıcı yoksa state'i temizliyoruz.
                await AsyncStorage.removeItem("user");
            }
        });
        loadFonts();
        return () => unsubscribe();
    }, [dispatch]);

    if (loading) {
        return <FullScreenLoader />;
    }

    return <MainNavigator />;
}
