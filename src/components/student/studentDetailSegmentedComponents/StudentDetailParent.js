import React from "react";
import { View, Text, StyleSheet, ScrollView, Button, TouchableOpacity } from "react-native";
import createFirebaseUser from "../../../services/createFirebaseUser";
import { createUserInBackend } from "../../../services/createUserInBackend";
import Toast from "react-native-toast-message";
import { FontAwesome5 } from "@expo/vector-icons";

const StudentDetailParent = ({ student = {} }) => {
    const parent = student.parentId || {};
    const handleCreateUser = async () => {
        try {
            const email = parent.email;
            const password = "gfk2024!";

            const userCredential = await createFirebaseUser(email, password);
            const firebaseUID = userCredential.uid;

            const newUser = await createUserInBackend(email, firebaseUID, parent._id);
            console.log("New User:", newUser._id);

            Toast.show({
                type: "success",
                text1: "Başarılı",
                text2: "Kullanıcı başarıyla oluşturuldu 👋",
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 60,
                props: {
                    text1Style: { fontSize: 18, fontFamily: "Poppins-SemiBold" },
                    text2Style: { fontSize: 16, fontFamily: "Poppins-Regular" },
                },
            });
        } catch (error) {
            console.error("Create Firebase User Error:", error);
            const errorMessage = error.message || "Bir hata oluştu";
            Toast.show({
                type: "error",
                text1: "Hata",
                text2: `${errorMessage}😔`,
                visibilityTime: 3000,
                autoHide: true,
                topOffset: 60,
                props: {
                    text1Style: { fontSize: 18, fontFamily: "Poppins-SemiBold" },
                    text2Style: { fontSize: 16, fontFamily: "Poppins-Regular" },
                },
            });
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.infoRow}>
                <Text style={styles.label}>Ad Soyad:</Text>
                <Text style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">
                    {parent.name || "Bilinmiyor"} {parent.surname || ""}
                </Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.label}>Telefon:</Text>
                <Text style={styles.infoText}>{parent.phone || "Bilinmiyor"}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.label}>Meslek:</Text>
                <Text style={styles.infoText}>{parent.job || "Bilinmiyor"}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.label}>E-posta:</Text>
                <Text style={[styles.infoText, { fontSize: 14 }]}>{parent.email || "Bilinmiyor"}</Text>
            </View>

            <View style={styles.infoRow}>
                <Text style={styles.label}>Adres:</Text>
                <Text style={[styles.infoText, { fontSize: 14 }]} numberOfLines={2} ellipsizeMode="tail">
                    {parent.address || "Bilinmiyor"}
                </Text>
            </View>

            {!parent.userId && (
                <TouchableOpacity style={styles.button} onPress={() => handleCreateUser()}>
                    <Text style={styles.buttonText}>Kullanıcı Oluştur</Text>
                </TouchableOpacity>
            )}
            {parent.userId && (
                <View style={styles.infoRow2}>
                    <FontAwesome5 name="info-circle" size={24} color="green" />
                    <Text style={styles.informationText}>
                        Veli için kullanıcı oluşturulmuştur. E-posta adresi ve standart şifre{" "}
                        <Text style={{ fontFamily: "Poppins-SemiBold" }}>"gfk2024!"</Text> ile giriş yapabilir.
                    </Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        paddingBottom: 10,
        flex: 1,
    },
    label: {
        fontSize: 16,
        color: "#555",
        fontWeight: "600",
        fontFamily: "Poppins-Regular",
        flex: 2,
    },
    infoText: {
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
        fontFamily: "Poppins-Regular",
        flex: 3,
        textAlign: "right",
    },
    button: {
        backgroundColor: "#85182a",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Poppins-SemiBold",
    },
    informationText: {
        color: "#333",
        fontSize: 12,
        fontFamily: "Poppins-Light",
        textAlign: "center",
    },
    infoRow2: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 10,
    },
});

export default StudentDetailParent;
