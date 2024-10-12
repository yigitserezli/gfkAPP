import React from "react";
import { Text, SafeAreaView } from "react-native";
import SignOutButton from "../../../utils/signOut";
//REDUX IMPORTS
import { useSelector } from "react-redux";

export default function SettingScreen() {
    const user = useSelector((state) => state.user.user);

    return (
        <SafeAreaView>
            <Text>Welcome {user ? user.email : "Kullanici bilgisi yok!"}</Text>
            <SignOutButton />
        </SafeAreaView>
    );
}
