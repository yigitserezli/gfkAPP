import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Animated, Alert, TextInput } from "react-native";
import React, { useState, useRef, useMemo, useCallback } from "react";
//COMPONENTS
import { FlatList } from "react-native-gesture-handler";
import BottomSheet from "@gorhom/bottom-sheet";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import Slider from "@react-native-community/slider";
import { Searchbar } from "react-native-paper";
import { showErrorToast, showSuccessToast } from "../../../components/ToastMessages";
//HOOKS
import useGetStudentReports from "../../../hooks/useGetStudentReports";
//AXIOS
import axios from "axios";
// NAVIGATION
import { useNavigation } from "@react-navigation/native";
//ICONS
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
//REDUX
import { useDispatch } from "react-redux";
import { setDashboardRefresh } from "../../../redux/slices/refreshSlice";

const AddReportForStudent = () => {
    const { studentsWithoutReport, loading } = useGetStudentReports();

    //REDUX
    const dispatch = useDispatch();

    const [search, setSearch] = useState("");
    const bottomSheetRef = useRef(null);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const snapPoints = useMemo(() => ["50%", "90%"], []);
    const opacityAnim = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation();

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().toLocaleString("tr-TR", { month: "long" });

    const gradeLabels = {
        discipline: "Disiplin",
        teamwork: "Takım Çalışması",
        harmonyWithGroup: "Grupla Uyum",
        physicalCondition: "Fiziksel Durum",
        technicalCondition: "Teknik Durum",
        awareness: "Farkındalık",
        continuity: "Devamlılık",
        interest: "İlgi",
    };

    const [grades, setGrades] = useState({
        discipline: 0,
        teamwork: 0,
        harmonyWithGroup: 0,
        physicalCondition: 0,
        technicalCondition: 0,
        awareness: 0,
        continuity: 0,
        interest: 0,
    });
    const [comments, setComments] = useState("");

    const handleSheetChanges = useCallback((index) => {
        if (index === -1) {
            setIsBottomSheetOpen(false);
            setSelectedStudent(null);
            Animated.timing(opacityAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            setIsBottomSheetOpen(true);
            Animated.timing(opacityAnim, {
                toValue: 0.9,
                duration: 400,
                useNativeDriver: true,
            }).start();
        }
    }, []);

    const handlePresentPress = useCallback((item) => {
        setSelectedStudent(item);
        bottomSheetRef.current?.expand();
    }, []);

    const handleSubmit = async () => {
        if (!selectedStudent) return;
        console.log("selectedStudent", selectedStudent);

        const reportData = {
            studentId: selectedStudent._id,
            coachId: selectedStudent.coachId,
            year: currentYear,
            month: new Date().getMonth() + 1,
            grades,
            comments,
        };

        try {
            const response = await axios.post("https://gfkapp-api.onrender.com/api/reports", reportData);

            if (response.status === 201) {
                showSuccessToast("Rapor başarıyla oluşturuldu.");
                dispatch(setDashboardRefresh(true));
                bottomSheetRef.current?.close();
            }
        } catch (err) {
            showErrorToast("Rapor oluşturulurken bir hata oluştu.");
            console.error(err);
        } finally {
            setGrades({
                discipline: 0,
                teamwork: 0,
                harmonyWithGroup: 0,
                physicalCondition: 0,
                technicalCondition: 0,
                awareness: 0,
                continuity: 0,
                interest: 0,
            });
            setComments("");
            navigation.navigate("Dashboard");
        }
    };

    const filteredStudents = studentsWithoutReport.filter((student) => {
        const fullName = `${student.name} ${student.surname}`.toLowerCase();
        return fullName.includes(search.toLowerCase());
    });

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => handlePresentPress(item)} style={styles.studentCard}>
            <View style={styles.studentInfo}>
                <Text style={styles.studentName}>
                    {item.name} {item.surname}
                </Text>
                <Text style={styles.studentAge}>{item.ageCategory}</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={{ color: "gray" }}>Git</Text>
                <MaterialIcons name="touch-app" size={28} color="black" />
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Animated.View style={[styles.overlay, { opacity: opacityAnim }]} />
            <View style={{ margin: 10 }}></View>

            <Searchbar
                placeholder="Ara..."
                onChangeText={(query) => setSearch(query)}
                value={search}
                style={styles.searchbar}
                iconColor="white"
                inputStyle={{ color: "white" }}
                placeholderTextColor={"white"}
                autoFocus
            />

            <View style={styles.reportList}>
                <FlatList
                    data={filteredStudents}
                    keyExtractor={(item) => item._id}
                    renderItem={renderItem}
                    windowSize={20} //Pencere basina 5 ogrenci goster
                    initialNumToRender={20} //Ilk acildiginda 10 ogrenci goster
                    onEndReachedThreshold={0.5} //Scrollun %50'ye gelince yeni ogrencileri yukle
                    maxToRenderPerBatch={10} //10'ar 10'ar ogrenci yukle
                    updateCellsBatchingPeriod={50} //50ms'de bir ogrencileri yukle
                    removeClippedSubviews={true} //Gorunmeyen ogrencileri kaldır
                    contentContainerStyle={{ paddingBottom: 80 }}
                />
            </View>
            <BottomSheet ref={bottomSheetRef} index={-1} snapPoints={snapPoints} enablePanDownToClose={true} onChange={handleSheetChanges}>
                <BottomSheetScrollView contentContainerStyle={styles.bottomSheetContent}>
                    <Text style={styles.title}>Rapor Oluştur</Text>
                    {selectedStudent && (
                        <>
                            <Text style={styles.label}>
                                Öğrenci: {selectedStudent.name} {selectedStudent.surname}
                            </Text>
                            <Text style={styles.label}>Yıl: {currentYear}</Text>
                            <Text style={styles.label}>Ay: {currentMonth}</Text>

                            {/* Notlar */}
                            {Object.keys(grades).map((gradeKey) => (
                                <View key={gradeKey} style={styles.gradeBox}>
                                    <Text style={styles.gradeLabel}>{gradeLabels[gradeKey]}</Text>
                                    <Slider
                                        style={styles.slider}
                                        minimumValue={0}
                                        maximumValue={5}
                                        step={1}
                                        value={grades[gradeKey]}
                                        onValueChange={(value) => setGrades((prevGrades) => ({ ...prevGrades, [gradeKey]: value }))}
                                        minimumTrackTintColor="#85182a"
                                        thumbTintColor="#85182a"
                                    />
                                    <Text style={styles.gradeValue}>{grades[gradeKey]}</Text>
                                </View>
                            ))}

                            {/* Yorumlar */}
                            <TextInput
                                style={styles.commentInput}
                                placeholder="Yorumlarınızı yazın..."
                                placeholderTextColor="#999"
                                multiline
                                numberOfLines={4}
                                value={comments}
                                onChangeText={(text) => setComments(text)}
                            />

                            {/* Gönder Butonu */}
                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                <Text style={styles.submitButtonText}>Gönder</Text>
                            </TouchableOpacity>
                        </>
                    )}
                </BottomSheetScrollView>
            </BottomSheet>
        </SafeAreaView>
    );
};

export default AddReportForStudent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f7f7f7",
    },
    searchbar: {
        borderRadius: 10,
        backgroundColor: "#85182a",
        width: "75%",
        alignSelf: "center",
        marginBottom: 10,
    },
    overlay: {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
    },
    studentCard: {
        paddingHorizontal: 10,
        paddingLeft: 10,
        paddingVertical: 15,
        borderBottomWidth: 0.5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    studentInfo: {
        flexDirection: "column",
    },
    studentName: {
        fontSize: 16,
        fontFamily: "Poppins-Semibold",
    },
    studentAge: {
        fontSize: 14,
        color: "#666",
        fontFamily: "Poppins",
        marginTop: 5,
    },
    reportList: {
        paddingBottom: 20,
    },
    bottomSheetContent: {
        padding: 20,
        backgroundColor: "#f9f9f9",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 20,
        color: "#85182a",
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 10,
        color: "#333",
    },
    gradeBox: {
        width: "100%",
        marginVertical: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: "#e8f0fe",
        borderRadius: 12,
    },
    gradeLabel: {
        fontSize: 16,
        fontWeight: "500",
        color: "#85182a",
    },
    slider: {
        width: "100%",
        marginTop: 10,
    },
    gradeValue: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "right",
        color: "#85182a",
    },
    commentInput: {
        width: "100%",
        height: 120,
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        marginTop: 20,
        textAlignVertical: "top",
    },
    submitButton: {
        backgroundColor: "#007bff",
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        marginTop: 20,
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },
});
