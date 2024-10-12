import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
//HOOKS
import useGetStudentReport from "../../../hooks/useGetStudentReports";
import useDownloadPDF from "../../../hooks/useDownloadPDF";
import useShare from "../../../hooks/useShare";
//ICONS
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
import { Modalize } from "react-native-modalize";
//NAVIGATION
import { useNavigation } from "@react-navigation/native";
import useCurrentMonthName from "../../../hooks/useGetThisMonth";

const monthNames = ["0.index", "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"];

const StudentDetailKarne = ({ student = {} }) => {
    const currentYear = new Date().getFullYear();
    const { reports, loading, error, deleteReport, createReport } = useGetStudentReport(student._id);
    const { downloadPDF } = useDownloadPDF();
    const { sharePDF } = useShare();
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null);
    const modalizeRef = useRef(null);
    const navigation = useNavigation();
    const currentMonth = new Date().toLocaleString("tr-TR", { month: "long" });

    const openModal = (month) => {
        setSelectedMonth(month);
        setSelectedReport(reports.find((report) => monthNames[report.month] === month));
        modalizeRef.current?.open();
    };
    const closeModal = () => {
        setSelectedReport(null);
        setSelectedMonth(null);
        modalizeRef.current?.close();
    };
    const formatCreatedAt = (createdAt) => {
        const date = new Date(createdAt);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const renderStars = (grade) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <FontAwesome
                    key={i}
                    name={i < grade ? "star" : "star-o"} // Dolu yıldız ya da boş yıldız
                    size={24}
                    color="#FFD700" // Altın sarısı yıldız
                    style={{ marginHorizontal: 2 }}
                />
            );
        }
        return stars;
    };

    const handleDeleteReport = async () => {
        if (!selectedReport) return;

        Alert.alert("Silme İşlemi", `${selectedMonth} ayına ait raporu silmek istediğinize emin misiniz?`, [
            { text: "İptal", style: "cancel" },
            {
                text: "Sil",
                onPress: async () => {
                    await deleteReport(selectedReport._id);
                    closeModal();
                },
                style: "destructive",
            },
        ]);
    };

    const createAndHandleFile = async (isDownload = true) => {
        const filePath = await downloadPDF(student, selectedMonth, selectedReport);
        if (!filePath) {
            Alert.alert("Hata", "PDF oluşturulamadı.");
            return;
        }

        if (isDownload) {
            Alert.alert("Başarılı", "PDF indirildi!");
        } else {
            sharePDF(filePath); // Paylaşım için aynı dosya kullanılıyor
        }
    };

    //Raporu olan aylar
    const renderedMonths = reports && Array.isArray(reports) ? reports.map((report) => monthNames[report.month]) : [];

    //Button icin mevcut ayda karne var mi kontrolu
    const isCurrentMonthReportExists = renderedMonths.includes(currentMonth);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Yükleniyor...</Text>
            </View>
        );
    }
    if (error) {
        return (
            <View style={styles.container}>
                <Text>Hata oluştu</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.row}>
                <FontAwesome5 name="info-circle" size={24} color="green" />
                <Text style={styles.text}>{currentYear} yılına ait öğrenci için oluşturulmuş karneleri tıklayarak görüntüleyebilirsiniz.</Text>
            </View>
            <View style={styles.circleRow}>
                {renderedMonths.map((month, index) => (
                    <TouchableOpacity key={index} style={styles.circle} activeOpacity={0.7} onPress={() => openModal(month)}>
                        <Text style={styles.circleText}>{month}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            {!isCurrentMonthReportExists && (
                <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={() => navigation.navigate("Reports")}>
                    <FontAwesome5 name="plus" size={24} color="white" />
                    <Text style={{ color: "white", fontFamily: "Poppins-Semibold" }}>{currentMonth} Karnesi Ekle</Text>
                </TouchableOpacity>
            )}

            <Modalize
                ref={modalizeRef}
                snapPoint={550}
                modalStyle={{ backgroundColor: "#4a4e69", borderRadius: 10, width: "115%", alignSelf: "center" }}
                handleStyle={{ backgroundColor: "black" }}
                overlayStyle={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
            >
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.modalTitle}>{selectedMonth} ayı karnesi</Text>
                            <Text style={styles.info}>
                                Hoca: {student.coachId?.name} {student.coachId?.surname}
                            </Text>
                            <Text style={styles.info}>Tarih: {formatCreatedAt(selectedReport?.createdAt)}</Text>
                        </View>
                        <View style={{ justifyContent: "space-between" }}>
                            <TouchableOpacity style={[styles.circle2, { alignSelf: "flex-end" }]} onPress={closeModal}>
                                <FontAwesome5 style={{ alignSelf: "center" }} name="times" size={24} color="red" />
                            </TouchableOpacity>
                            <View style={{ flexDirection: "row", gap: 20 }}>
                                <TouchableOpacity style={styles.circle2} onPress={() => createAndHandleFile(true)}>
                                    <FontAwesome5 name="download" size={24} color="blue" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.circle2} onPress={() => createAndHandleFile(false)}>
                                    <FontAwesome5 name="share" size={24} color="orange" />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.circle2} onPress={handleDeleteReport}>
                                    <FontAwesome5 name="trash" size={24} color="red" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <Text style={styles.sectionTitle}>Puanlar</Text>

                    <View style={styles.gradesSection}>
                        <Text style={styles.titleText}>Disiplin: </Text>
                        <View style={styles.starsContainer}>{renderStars(selectedReport?.grades.discipline)}</View>
                    </View>

                    <View style={styles.gradesSection}>
                        <Text style={styles.titleText}>Takım çalışması: </Text>
                        <View style={styles.starsContainer}>{renderStars(selectedReport?.grades.teamwork)}</View>
                    </View>

                    <View style={styles.gradesSection}>
                        <Text style={styles.titleText}>Takım içi uyum: </Text>
                        <View style={styles.starsContainer}>{renderStars(selectedReport?.grades.harmonyWithGroup)}</View>
                    </View>

                    <View style={styles.gradesSection}>
                        <Text style={styles.titleText}>Fiziksel kondisyon: </Text>
                        <View style={styles.starsContainer}>{renderStars(selectedReport?.grades.physicalCondition)}</View>
                    </View>

                    <View style={styles.gradesSection}>
                        <Text style={styles.titleText}>Teknik kondisyon: </Text>
                        <View style={styles.starsContainer}>{renderStars(selectedReport?.grades.technicalCondition)}</View>
                    </View>

                    <View style={styles.gradesSection}>
                        <Text style={styles.titleText}>Farkındalık: </Text>
                        <View style={styles.starsContainer}>{renderStars(selectedReport?.grades.awareness)}</View>
                    </View>

                    <View style={styles.gradesSection}>
                        <Text style={styles.titleText}>Devamlılık: </Text>
                        <View style={styles.starsContainer}>{renderStars(selectedReport?.grades.continuity)}</View>
                    </View>

                    <View style={styles.gradesSection}>
                        <Text style={styles.titleText}>İlgi: </Text>
                        <View style={styles.starsContainer}>{renderStars(selectedReport?.grades.interest)}</View>
                    </View>
                </View>
            </Modalize>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        marginTop: 10,
        height: "100%",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    circleRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        marginBottom: 5,
    },
    circle: {
        width: 75,
        height: 75,
        borderRadius: 50, // Tam daire
        backgroundColor: "#9ef01a",
        justifyContent: "center",
        alignItems: "center",
        margin: 10,
        borderWidth: 2,
        borderColor: "#9ef01a",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3.84,
        elevation: 5, // Android için gölge efekti
        transform: [{ scale: 1 }],
    },
    circleText: {
        fontSize: 12,
        fontFamily: "Poppins-SemiBold",
        color: "gray",
        textAlign: "center",
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 25,
        backgroundColor: "#85182a",
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        marginTop: 10,
        flexDirection: "row",
        gap: 10,
    },
    text: {
        fontSize: 12,
        fontFamily: "Poppins-Regular",
        color: "gray",
        marginLeft: 10,
    },
    modalContent: {
        padding: 20,
    },
    modalTitle: {
        fontSize: 22,
        fontFamily: "Poppins-SemiBold",
        marginBottom: 15,
        color: "#fff",
    },
    sectionTitle: {
        fontSize: 16,
        fontFamily: "Poppins-SemiBold",
        color: "#fff",
        marginTop: 15,
        marginBottom: 10,
    },
    gradesSection: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        paddingBottom: 10,
    },
    starsContainer: {
        flexDirection: "row",
    },
    titleText: {
        fontFamily: "Poppins-Regular",
        fontSize: 16,
        color: "#dee2e6",
    },
    info: {
        fontFamily: "Poppins-Regular",
        fontSize: 16,
        color: "#dee2e6",
        marginBottom: 10,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    circle2: {
        width: 40,
        height: 40,
        borderRadius: 50,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
    },
});

export default StudentDetailKarne;
