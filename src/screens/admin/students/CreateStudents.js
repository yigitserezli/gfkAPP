import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
// Hooks
import useStudent from "../../../hooks/useStudent";
// UI Libraries Import
import { Select, Center, Box, CheckIcon } from "native-base";
import * as Progress from "react-native-progress";
import { showSuccessToast, showErrorToast } from "../../../components/ToastMessages";
// Constants Import
import { API_FETCH_COACHES, API_CREATE_STUDENTS_PARENTS } from "@env";
import { ENUMS } from "../../../constants/enum";
// Axios Import
import axios from "axios";
//REDUX
import { useDispatch } from "react-redux";
import { setStudentRefresh } from "../../../redux/slices/refreshSlice";


const TwoStepForm = () => {
    const [step, setStep] = useState(1);
    const [coaches, setCoaches] = useState([]);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { fetchStudents } = useStudent();
    const [studentData, setStudentData] = useState({
        name: "",
        surname: "",
        phone: "",
        birthDate: "",
        height: "",
        weight: "",
        ageCategory: "",
        parentId: null,
        coachId: null,
        prefferedFoot: "",
    });
    const [parentData, setParentData] = useState({
        name: "",
        surname: "",
        job: "",
        email: "",
        phone: "",
        address: "",
        userId: null,
        studentId: null,
    });

    useEffect(() => {
        const fetchCoaches = async () => {
            try {
                const response = await axios.get(API_FETCH_COACHES);
                setCoaches(response.data?.data?.coaches || []);
                console.log("Koçlar başarıyla getirildi: ", response.data);
            } catch (error) {
                console.error("Koçlar getirilirken bir hata oluştu: ", error.response || error.message);
            }
        };
        fetchCoaches();
    }, []);

    const progress = step / 2;
    const isStudentDataComplete = studentData.name && studentData.surname && studentData.phone && studentData.birthDate;
    const isParentDataComplete = parentData.name && parentData.surname && parentData.email && parentData.phone;
    const handleDateInput = (text) => {
        let formattedText = text.replace(/[^0-9]/g, ""); // Sadece rakamları tut

        if (formattedText.length >= 5 && formattedText.length <= 6) {
            formattedText = `${formattedText.slice(0, 4)}-${formattedText.slice(4)}`; // YYYY- formatı
        }
        if (formattedText.length >= 7) {
            formattedText = `${formattedText.slice(0, 4)}-${formattedText.slice(4, 6)}-${formattedText.slice(6, 8)}`; // YYYY-MM-DD formatı
        }

        setStudentData({ ...studentData, birthDate: formattedText });
    };

    // 1. Aşama: Öğrenci Bilgileri Formu
    const renderStudentForm = () => (
        <View style={styles.card}>
            <Text style={styles.header}>Öğrenci Bilgileri</Text>
            <TextInput
                style={styles.input}
                placeholder="Öğrencinin Adı"
                value={studentData.name}
                onChangeText={(text) => setStudentData({ ...studentData, name: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Öğrencinin Soyadı"
                value={studentData.surname}
                onChangeText={(text) => setStudentData({ ...studentData, surname: text })}
            />
            <TextInput style={styles.input} placeholder="Doğum Tarihi (YYYY-MM-DD)" value={studentData.birthDate} onChangeText={handleDateInput} />
            <TextInput
                style={styles.input}
                placeholder="Telefon Numarası (10 haneli)"
                value={studentData.phone}
                maxLength={10}
                onChangeText={(text) => setStudentData({ ...studentData, phone: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Boy (cm)"
                value={studentData.height}
                maxLength={3}
                onChangeText={(text) => setStudentData({ ...studentData, height: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Kilo (kg)"
                value={studentData.weight}
                maxLength={2}
                onChangeText={(text) => setStudentData({ ...studentData, weight: text })}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Center>
                    <Box maxW="200">
                        <Select
                            selectedValue={studentData.prefferedFoot}
                            minWidth="150"
                            minHeight="41"
                            accessibilityLabel="Kullandığı Ayak"
                            placeholder="Kullandığı Ayak"
                            _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />,
                            }}
                            mt={1}
                            mb={2}
                            onValueChange={(itemValue) => setStudentData({ ...studentData, prefferedFoot: itemValue })}
                        >
                            {Object.values(ENUMS.STUDENT_PREFFERED_FOOT).map((foot) => (
                                <Select.Item key={foot} label={foot} value={foot} />
                            ))}
                        </Select>
                    </Box>
                </Center>
                <Center>
                    <Box maxW="200">
                        <Select
                            selectedValue={studentData.coachId}
                            minWidth="150"
                            minHeight="41"
                            accessibilityLabel="Hoca Seç"
                            placeholder="Hoca Seç"
                            _selectedItem={{
                                bg: "teal.600",
                                endIcon: <CheckIcon size="5" />,
                            }}
                            mt={1}
                            mb={2}
                            onValueChange={(itemValue) => setStudentData({ ...studentData, coachId: itemValue })}
                        >
                            {coaches.length > 0 ? (
                                coaches.map((coach) => <Select.Item key={coach._id} label={`${coach.name} ${coach.surname}`} value={coach._id} />)
                            ) : (
                                <Select.Item label="Koç yükleniyor..." value="" />
                            )}
                        </Select>
                    </Box>
                </Center>
            </View>
            <Center>
                <Box maxW="350">
                    <Select
                        selectedValue={studentData.ageCategory}
                        minWidth="320"
                        minHeight="41"
                        accessibilityLabel="Yaş Kategorisi Seç"
                        placeholder="Yaş Kategorisi Seç"
                        _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size="5" />,
                        }}
                        mt={1}
                        mb={2}
                        onValueChange={(itemValue) => setStudentData({ ...studentData, ageCategory: itemValue })}
                    >
                        {Object.values(ENUMS.STUDENT_CATEGORIES).map((category) => (
                            <Select.Item key={category} label={category} value={category} />
                        ))}
                    </Select>
                </Box>
            </Center>
            <TouchableOpacity
                style={[styles.button, !isStudentDataComplete && styles.buttonDisabled]}
                onPress={() => setStep(2)}
                disabled={!isStudentDataComplete}
            >
                <Text style={styles.buttonText}>Veli Bilgilerine Geç</Text>
            </TouchableOpacity>
        </View>
    );

    // 2. Aşama: Veli Bilgileri Formu
    const renderParentForm = () => (
        <View style={styles.card}>
            <Text style={styles.header}>Veli Bilgileri</Text>
            <TextInput
                style={styles.input}
                placeholder="Velinin Adı"
                value={parentData.name}
                onChangeText={(text) => setParentData({ ...parentData, name: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Velinin Soyadı"
                value={parentData.surname}
                onChangeText={(text) => setParentData({ ...parentData, surname: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Meslek"
                value={parentData.job}
                onChangeText={(text) => setParentData({ ...parentData, job: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={parentData.email}
                autoCapitalize={false}
                onChangeText={(text) => setParentData({ ...parentData, email: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Telefon"
                value={parentData.phone}
                maxLength={10}
                onChangeText={(text) => setParentData({ ...parentData, phone: text })}
            />
            <TextInput
                style={styles.addressInput}
                placeholder="Adres"
                value={parentData.address}
                onChangeText={(text) => setParentData({ ...parentData, address: text })}
            />
            <TouchableOpacity style={styles.button} onPress={() => setStep(1)}>
                <Text style={styles.buttonText}>Geri</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, !isParentDataComplete && styles.buttonDisabled]} onPress={handleSubmit}>
                <Text style={styles.buttonText} disabled={!isParentDataComplete}>
                    Formu Gönder
                </Text>
            </TouchableOpacity>
        </View>
    );

    // Formu gönderme işlemi
    const handleSubmit = async () => {
        try {
            const response = await axios.post("https://gfkapp-api.onrender.com/api/students", {
                studentData,
                parentData,
            });
            dispatch(setStudentRefresh(true));
            showSuccessToast("Öğrenci ve veli başarıyla oluşturuldu");
            fetchStudents();
            navigation.navigate("Dashboard");
        } catch (error) {
            showErrorToast("Öğrenci ve veli oluşturulurken bir hata oluştu");
            console.error("Öğrenci ve veli oluşturulurken bir hata oluştu", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.progressLabel}>Adım {step} / 2</Text>
            <Progress.Bar
                progress={progress}
                width={200}
                height={10}
                color="#3498db"
                borderWidth={1}
                animated={true}
                animationType="timing"
                animationConfig={{ duration: 1000 }}
                style={styles.progressBar}
            />
            {/* Mevcut aşamaya göre formu render et */}
            {step === 1 ? renderStudentForm() : renderParentForm()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f8f9fa",
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        padding: 20,
        width: "100%",
        marginVertical: 20,
    },
    header: {
        fontSize: 22,
        color: "#2c3e50",
        marginBottom: 20,
        fontFamily: "Poppins-SemiBold",
    },
    label: {
        fontSize: 16,
        color: "#34495e",
        marginTop: 10,
        marginBottom: 5,
        fontFamily: "Poppins-Regular",
    },
    input: {
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
        width: "100%",
        fontFamily: "Poppins-Regular",
    },
    addressInput: {
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
        fontSize: 16,
        width: "100%",
        height: 100,
        textAlignVertical: "top",
        fontFamily: "Poppins-Regular",
    },
    picker: {
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    button: {
        backgroundColor: "#3498db",
        padding: 15,
        borderRadius: 8,
        alignItems: "center",
        marginVertical: 10,
    },
    buttonDisabled: {
        backgroundColor: "#95a5a6",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "Poppins-SemiBold",
    },
    progressLabel: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 10, // Progress bar'ın üzerinde bir boşluk bırakır
        color: "#2c3e50",
        fontFamily: "Poppins-SemiBold",
    },
    progressBar: {
        marginBottom: 20,
    },
    subText: {
        fontSize: 8,
        color: "#7f8c8d",
    },
});

export default TwoStepForm;
