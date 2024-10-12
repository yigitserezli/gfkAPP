import React from "react";
import { StyleSheet } from "react-native";

const AppStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingTop: 10,
    },
    searchBarContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 0.5,
        padding: 10,
        borderRadius: 10,
        width: "80%",
        marginLeft: 10,
        marginBottom: 10,
    },
    input: {
        marginLeft: 10,
        flex: 1,
    },
    studentMainPageHeader: {
        padding: 10,
        paddingLeft: 20,
        height: 50,
        justifyContent: "center",
    },
    textForFont: {
        fontFamily: "Poppins-Light",
        fontSize: 18,
    },
    subTitleText: {
        fontFamily: "Poppins-ExtraLight",
        fontSize: 10,
    },
    checkboxRow: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    checkboxContainer: {
        width: "30%",
    },
});

export default AppStyles;
