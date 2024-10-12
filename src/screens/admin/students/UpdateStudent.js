import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Select, Center, Box, CheckIcon } from "native-base";
import { ENUMS } from "../../../constants/enum";
import { API_FETCH_COACHES } from "@env";
import axios from "axios";

const UpdateStudent = ({ route }) => {
    const fromRoute = route.params;
    const student = fromRoute.student;
    const [coaches, setCoaches] = useState([]);

    const [studentData, setStudentData] = useState({
        name: student.name,
        surname: student.surname,
        ageCategory: student.ageCategory,
        phone: student.phone,
        birthDate: student.birthDate,
        height: student.height,
        weight: student.weight,
        parentId: student.parentId,
        coachId: student.coachId ? student.coachId._id : "",
    });

    const [parentData, setParentData] = useState({
        name: student.parentId.name,
        surname: student.parentId.surname,
        job: student.parentId.job,
        phone: student.parentId.phone,
        email: student.parentId.email,
        address: student.parentId.address,
        userId: student.parentId.userId,
        studentId: student.parentId.studentId,
    });

    const handleUpdate = () => {
        console.log("Güncelleme işlemi başlatıldı");
    };

    const createUserForParent = () => {
        console.log("Veli için kullanıcı oluşturuluyor");
    };

    const formatDate = (date) => {
        const newDate = new Date(date);
        return newDate.toLocaleDateString("tr-TR");
    };

    useEffect(() => {
        const fetchCoaches = async () => {
            try {
                const response = await axios.get(API_FETCH_COACHES);
                setCoaches(response.data?.data?.coaches || []);
            } catch (error) {
                console.error("Koçlar getirilirken bir hata oluştu: ", error.response || error.message);
            }
        };
        fetchCoaches();
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
                <View style={styles.row}>
                    <TextInput
                        placeholder="Ad"
                        value={studentData.name}
                        style={styles.textInput}
                        onChangeText={(text) => setStudentData({ ...studentData, name: text })}
                    />
                    <TextInput
                        placeholder="Soyad"
                        value={studentData.surname}
                        style={styles.textInput}
                        onChangeText={(text) => setStudentData({ ...studentData, surname: text })}
                    />
                </View>

                <View style={styles.row}>
                    <TextInput
                        placeholder="Telefon"
                        value={studentData.phone}
                        style={styles.textInput}
                        onChangeText={(text) => setStudentData({ ...studentData, phone: text })}
                        keyboardType="numeric"
                    />
                    <TextInput
                        placeholder="Doğum Tarihi"
                        value={formatDate(studentData.birthDate)}
                        style={[styles.textInput, { textDecorationLine: "line-through", color: "#888" }]}
                        editable={false}
                    />
                </View>

                <Text style={styles.sectionTitle}>Vücut Bilgileri</Text>

                <View style={styles.row}>
                    <View style={styles.inputWithUnit}>
                        <TextInput
                            placeholder="Ağırlık (kg)"
                            value={studentData.weight ? studentData.weight.toString() : ""}
                            style={styles.textInputBody}
                            onChangeText={(text) => setStudentData({ ...studentData, weight: parseInt(text) || 0 })}
                            keyboardType="numeric"
                        />
                        <Text style={styles.unitText}>kg</Text>
                    </View>
                    <View style={styles.inputWithUnit}>
                        <TextInput
                            placeholder="Uzunluk (cm)"
                            value={studentData.height ? studentData.height.toString() : ""}
                            style={styles.textInputBody}
                            onChangeText={(text) => setStudentData({ ...studentData, height: parseInt(text) || 0 })}
                            keyboardType="numeric"
                        />
                        <Text style={styles.unitText}>cm</Text>
                    </View>
                </View>

                <View style={styles.row}>
                    <Center>
                        <Box maxW="200">
                            <Select
                                selectedValue={studentData.ageCategory}
                                minWidth="170"
                                accessibilityLabel="Yaş Grubu Seç"
                                placeholder="Yaş Grubu Seç"
                                _selectedItem={{
                                    bg: "teal.600",
                                    endIcon: <CheckIcon size="5" />,
                                }}
                                mt={1}
                                onValueChange={(itemValue) => setStudentData({ ...studentData, ageCategory: itemValue })}
                            >
                                {Object.values(ENUMS.STUDENT_CATEGORIES).map((category) => (
                                    <Select.Item key={category} label={category} value={category} />
                                ))}
                            </Select>
                        </Box>
                    </Center>
                    <Center>
                        <Box maxW="200">
                            <Select
                                selectedValue={studentData.coachId}
                                minWidth="170"
                                accessibilityLabel="Hoca Seç"
                                placeholder="Hoca Seç"
                                _selectedItem={{
                                    bg: "teal.600",
                                    endIcon: <CheckIcon size="5" />,
                                }}
                                mt={1}
                                onValueChange={(itemValue) => setStudentData({ ...studentData, coachId: itemValue })}
                            >
                                {coaches.length > 0 ? (
                                    coaches.map((coach) => (
                                        <Select.Item key={coach._id} label={`${coach.name} ${coach.surname}`} value={coach._id} />
                                    ))
                                ) : (
                                    <Select.Item label="Koç yükleniyor..." value="" />
                                )}
                            </Select>
                        </Box>
                    </Center>
                </View>
            </View>

            <View style={styles.card}>
                <Text style={styles.sectionTitle}>Veli Bilgileri</Text>
                <View style={styles.row}>
                    <TextInput
                        placeholder="Ad"
                        value={parentData.name}
                        style={styles.textInput}
                        onChangeText={(text) => setParentData({ ...parentData, name: text })}
                    />
                    <TextInput
                        placeholder="Soyad"
                        value={parentData.surname}
                        style={styles.textInput}
                        onChangeText={(text) => setParentData({ ...parentData, surname: text })}
                    />
                </View>

                <View style={styles.row}>
                    <TextInput
                        placeholder="Telefon"
                        value={parentData.phone}
                        style={styles.textInput}
                        onChangeText={(text) => setParentData({ ...parentData, phone: text })}
                        keyboardType="numeric"
                    />
                    <TextInput
                        placeholder="Email"
                        value={parentData.email}
                        style={styles.textInput}
                        onChangeText={(text) => setParentData({ ...parentData, email: text })}
                    />
                </View>

                <TextInput
                    placeholder="Adres"
                    value={parentData.address}
                    style={[styles.textInput, { width: "100%" }]}
                    onChangeText={(text) => setParentData({ ...parentData, address: text })}
                />
            </View>

            <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
                <Text style={styles.buttonText}>Güncelle</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={createUserForParent} style={styles.createButton}>
                <Text style={styles.buttonText}>Aidat Durumunu Gözetle</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: "#f5f5f5",
    },
    card: {
        padding: 15,
        marginVertical: 10,
        borderRadius: 12,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    sectionTitle: {
        textAlign: "center",
        paddingTop: 10,
        paddingBottom: 15,
        fontFamily: "Poppins-Bold",
        fontSize: 20,
        color: "#85182a",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    textInput: {
        borderBottomWidth: 1,
        borderColor: "#ddd",
        padding: 12,
        width: "45%",
        textAlign: "center",
        color: "#333",
        fontFamily: "Poppins",
        fontSize: 14,
    },
    textInputBody: {
        borderBottomWidth: 1,
        borderColor: "#ddd",
        padding: 12,
        width: "40%",
        textAlign: "center",
        color: "#333",
        fontFamily: "Poppins",
        fontSize: 14,
    },
    unitText: {
        marginLeft: 8,
        fontSize: 16,
        color: "#777",
    },
    inputWithUnit: {
        flexDirection: "row",
        alignItems: "center",
        width: "45%",
    },
    updateButton: {
        backgroundColor: "#4CAF50",
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
    },
    createButton: {
        backgroundColor: "#85182a",
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
    },
    buttonText: {
        color: "#fff",
        textAlign: "center",
        fontFamily: "Poppins-Bold",
        fontSize: 16,
    },
});

export default UpdateStudent;
