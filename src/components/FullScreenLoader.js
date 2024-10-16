import React from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function FullScreenLoader() {
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.8)", // Arka planda hafif bir beyaz ton veriyoruz
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999, // Diğer tüm elemanların üzerinde durmasını sağlar
    },
});
