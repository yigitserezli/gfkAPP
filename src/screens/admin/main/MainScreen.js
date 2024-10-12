import React from "react";
import { SafeAreaView } from "react-native";
//COMPONENTS
import HorizontalScrollableTabBar from "../../../components/adminScreenComponents/adminHorizontalScrollableTabBar/HorizontalScrollableTabBar";
import Header from "../../../components/adminScreenComponents/Header";
//REDUX
import { useSelector } from "react-redux";

export default function DenemeScreen() {
    const userInfo = useSelector((state) => state.user.user);

    return (
        <SafeAreaView>
            <Header userInfo={userInfo} />
            <HorizontalScrollableTabBar />
        </SafeAreaView>
    );
}
