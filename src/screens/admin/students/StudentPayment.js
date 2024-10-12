import { View, Text, TextInput, Button, Alert, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useRoute } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
//HOOKS
import useStudentPayments from "../../../hooks/useStudentPayments";

const StudentPayment = () => {
    const route = useRoute();
    const { studentId } = route.params;
    const { unpaidMonths, loading } = useStudentPayments(studentId);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [amountPaid, setAmountPaid] = useState("");
    const monthNames = {
        January: "Ocak",
        February: "Şubat",
        March: "Mart",
        April: "Nisan",
        May: "Mayıs",
        June: "Haziran",
        July: "Temmuz",
        August: "Ağustos",
        September: "Eylül",
        October: "Ekim",
        November: "Kasım",
        December: "Aralık",
    };
    const years = ["2024", "2025", "2026"];

    const presetAmounts = [100, 250, 500, 750]; // Hazır tutarlar

    if (loading) {
        return <ActivityIndicator style={{ flex: 1, justifyContent: "center", alignItems: "center" }} size="large" color="#85182a" />;
    }

    const handlePayment = () => {
        if (!selectedMonth || !amountPaid) {
            Alert.alert("Hata", "Lütfen tüm bilgileri eksiksiz doldurunuz.");
            return;
        }

        Alert.alert("Onay", `${selectedYear} - ${monthNames[selectedMonth]} ayı için ${amountPaid} TRY aidat alınıyor. Onaylıyor musunuz?`, [
            { text: "İptal", style: "cancel" },
            {
                text: "Onayla",
                onPress: () => {
                    handlePaymentConfirmation();
                },
            },
        ]);
    };

    const handlePaymentConfirmation = () => {
        const parsedAmount = parseFloat(amountPaid);

        if (isNaN(parsedAmount) || parsedAmount <= 0) {
            Alert.alert("Hata", "Geçerli bir ödeme tutarı giriniz.");
            return;
        }
        axios
            .put(`https://gfkapp-api.onrender.com/api/students/${studentId}/payments/${selectedYear}/${selectedMonth}`, {
                amount: parsedAmount,
                isPaid: true,
                paymentDate: new Date(),
            })
            .then(() => {
                Alert.alert("Başarılı", "Ödeme başarılı bir şekilde alındı.");
            })
            .catch((error) => {
                console.log("Ödeme hatası:", error.response ? error.response.data : error.message);
                Alert.alert("Hata", "Ödeme alınırken bir hata oluştu.");
            });
    };

    const handlePresetAmountClick = (amount) => {
        setAmountPaid(amount.toString());
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.pickerContainer}>
                <Picker selectedValue={selectedYear} onValueChange={(itemValue) => setSelectedYear(itemValue)} style={styles.picker}>
                    <Picker.Item label="Yıl Seçiniz..." value={null} />
                    {years.map((year, idx) => (
                        <Picker.Item key={idx} label={year} value={year} />
                    ))}
                </Picker>
            </View>

            <View style={styles.pickerContainer}>
                <Picker
                    selectedValue={selectedMonth}
                    onValueChange={(itemValue) => setSelectedMonth(itemValue)}
                    enabled={!!selectedYear}
                    style={styles.picker}
                >
                    <Picker.Item label="Ay Seçiniz..." value={null} />
                    {unpaidMonths[selectedYear]?.months.map((month, idx) => (
                        <Picker.Item key={idx} label={monthNames[month.month]} value={month.month} />
                    ))}
                </Picker>
            </View>

            <Text style={styles.label}>Alınan Tutar (TRY):</Text>
            <TextInput
                value={amountPaid.toString()}
                onChangeText={(text) => setAmountPaid(text)}
                placeholder="Ödeme Tutarı"
                keyboardType="numeric"
                style={styles.input}
            />

            <View style={styles.presetContainer}>
                {presetAmounts.map((amount) => (
                    <TouchableOpacity key={amount} style={styles.presetButton} onPress={() => handlePresetAmountClick(amount)} keyboardType="numeric">
                        <Text style={styles.presetText}>{amount}₺</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity onPress={handlePayment} disabled={!selectedYear || !selectedMonth || !amountPaid} color="#85182a" style={styles.button}>
                <Text style={styles.buttonText}>Aidat Ödemesi Al</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#f9f9f9",
        alignItems: "center",
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        color: "#333",
        fontFamily: "Poppins",
    },
    pickerContainer: {
        backgroundColor: "#fff",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        width: "100%",
        marginBottom: 20,
        position: "relative",
    },
    picker: {
        width: "100%",
    },
    input: {
        borderBottomWidth: 1,
        borderColor: "#ccc",
        fontSize: 16,
        fontFamily: "Poppins",
        padding: 10,
        marginBottom: 20,
        width: "100%",
    },
    button: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#85182a",
        borderRadius: 10,
        width: "100%",
        alignItems: "center",

    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontFamily: "Poppins",
    },
    presetContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginBottom: 20,
        width: "100%",
        flexWrap: "wrap",
    },
    presetButton: {
        backgroundColor: "#3E9C35",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
    },
    presetText: {
        fontSize: 16,
        color: "#fff",
        fontFamily: "Poppins",
    },
});

export default StudentPayment;
