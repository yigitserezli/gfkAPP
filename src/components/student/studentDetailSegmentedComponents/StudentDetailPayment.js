import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Modal } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import useGetLatestFee from "../../../hooks/useGetLatestFee";
import Icon from "react-native-vector-icons/MaterialIcons";

const StudentDetailPayment = ({ studentId }) => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const navigation = useNavigation();
    const { latestFee, loading: feeLoading } = useGetLatestFee();

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

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axios.get(`https://gfkapp-api.onrender.com/api/students/${studentId}/payments`);
                setPayments(response.data);
            } catch (error) {
                console.error("Ödeme bilgileri alınamadı", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayments();
    }, [studentId]);

    const handleMonthPress = (month) => {
        setSelectedMonth(month);
        setModalVisible(true);
    };

    const getPaymentStatusColor = (amountPaid) => {
        if (amountPaid >= latestFee) {
            return "#4CAF50"; // Green for fully paid
        } else if (amountPaid > 0 && amountPaid < latestFee) {
            return "#FFA500"; // Orange for partially paid
        } else {
            return "#F44336"; // Red for unpaid
        }
    };

    if (loading || feeLoading) {
        return <ActivityIndicator size="large" color="#85182a" style={styles.loader} />;
    }

    return (
        <View style={styles.container}>
            {/* Öğrenci Üst Bilgi */}
            <View style={styles.studentInfo}>
                <Text style={styles.studentName}>2024 Yılı Öğrenci Aidat Durumu</Text>
                <Text style={styles.studentSubInfo}>Aşağıdaki listeden ödeme durumlarına bakabilirsiniz</Text>
            </View>

            <View style={{ flexDirection: "row", alignSelf: "flex-end", marginBottom: 10, gap: 5 }}>
                <Text style={{ fontFamily: "Poppins", alignSelf: "flex-end", color: "gray" }}>Kaydır</Text>
                <Icon name="arrow-forward" size={20} color="gray" style={{ alignSelf: "center" }} />
            </View>

            {/* Yatay Kaydırılabilir Ödeme Dönemleri */}
            <ScrollView horizontal style={styles.monthsContainer} showsHorizontalScrollIndicator={false}>
                {payments.length > 0 &&
                    payments[0].months.map((month, index) => (
                        <TouchableOpacity key={index} style={styles.monthItem} onPress={() => handleMonthPress(month)}>
                            <Text style={styles.monthText}>{monthNames[month.month]}</Text>
                            <View style={[styles.paymentStatusIndicator, { backgroundColor: getPaymentStatusColor(month.amount) }]} />
                        </TouchableOpacity>
                    ))}
            </ScrollView>

            {/* Aidat Ödeme Butonu */}
            <TouchableOpacity style={styles.paymentButton} onPress={() => navigation.navigate("StudentPayment", { studentId })}>
                <Text style={styles.paymentText}>Aidat Ödeme</Text>
            </TouchableOpacity>

            {/* Modal for Month Detail */}
            <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => setModalVisible(!modalVisible)}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalView}>
                        {selectedMonth && (
                            <>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>{monthNames[selectedMonth.month]} Ayı Ödeme Detayı</Text>
                                </View>

                                <View style={styles.modalContent}>
                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Aidat Durumu:</Text>
                                        <Text style={styles.detailValue}>{selectedMonth.isPaid ? "Ödendi" : "Ödenmedi"}</Text>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Ödeme Miktarı:</Text>
                                        <Text style={styles.detailValue}>{selectedMonth.amount} ₺</Text>
                                    </View>

                                    <View style={styles.detailRow}>
                                        <Text style={styles.detailLabel}>Ödeme Tarihi:</Text>
                                        <Text style={styles.detailValue}>
                                            {selectedMonth.paymentDate ? new Date(selectedMonth.paymentDate).toLocaleDateString() : "Ödeme yapılmadı"}
                                        </Text>
                                    </View>
                                </View>

                                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(!modalVisible)}>
                                    <Text style={styles.closeButtonText}>Kapat</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#f8f9fa",
        padding: 15,
        marginTop: 10,
        borderRadius: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
        elevation: 2,
    },
    studentInfo: {
        marginBottom: 20,
    },
    studentName: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginBottom: 5,
    },
    studentSubInfo: {
        fontSize: 14,
        color: "#666",
        textAlign: "center",
        marginTop: 5,
    },
    monthsContainer: {
        flexDirection: "row",
        marginBottom: 15,
    },
    monthItem: {
        backgroundColor: "#fff",
        padding: 12,
        borderRadius: 8,
        marginRight: 8,
        alignItems: "center",
        justifyContent: "center",
        width: 85,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        shadowRadius: 3,
        elevation: 2,
    },
    monthText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
    paymentStatusIndicator: {
        width: 12,
        height: 12,
        borderRadius: 12 / 2,
        marginTop: 8,
    },
    modalBackground: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.7)", // Arka planı daha koyu yaparak odak noktası yaratıyoruz
        justifyContent: "center",
        alignItems: "center",
    },
    modalView: {
        width: "85%",
        backgroundColor: "white",
        borderRadius: 20,
        padding: 25,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        marginBottom: 15,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    modalContent: {
        width: "100%",
        marginBottom: 20,
    },
    detailRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 5,
        borderBottomColor: "#ddd",
        borderBottomWidth: 1,
    },
    detailLabel: {
        fontSize: 16,
        fontWeight: "500",
        color: "#666",
    },
    detailValue: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    closeButton: {
        backgroundColor: "#85182a",
        padding: 12,
        borderRadius: 10,
        alignItems: "center",
        width: "100%",
    },
    closeButtonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
    loader: {
        justifyContent: "center",
        alignItems: "center",
        marginTop: 75,
    },
    paymentButton: {
        backgroundColor: "#85182a",
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        alignItems: "center",
    },
    paymentText: {
        color: "#fff",
        fontSize: 16,
        fontFamily: "Poppins-SemiBold",
    },
});

export default StudentDetailPayment;
