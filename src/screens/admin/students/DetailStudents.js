import React, { useEffect, useState } from "react";
import { Text, Image, View, StyleSheet, ImageBackground, Dimensions, TouchableOpacity, Alert, Modal } from "react-native";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { BlurView } from "@react-native-community/blur";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
// COMPONENTS
import StudentDetailParent from "../../../components/student/studentDetailSegmentedComponents/StudentDetailParent";
import StudentDetailPayment from "../../../components/student/studentDetailSegmentedComponents/StudentDetailPayment";
import StudentDetailKarne from "../../../components/student/studentDetailSegmentedComponents/StudentDetailKarne";
import { showSuccessToast, showErrorToast } from "../../../components/ToastMessages";
// DATA IMPORTS
import { ENDPOINTS } from "../../../constants/api";
import axios from "axios";
// ICONS
import Icon from "@expo/vector-icons/MaterialIcons";
// HOOKS
import { useProfileImage } from "../../../hooks/useStudentProfileImage";

const { width } = Dimensions.get("window");

const DetailStudents = ({ route }) => {
    const { student, parent } = route.params;
    const [selectedIndex, setSelectedIndex] = useState(0);
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const { handleProfileImageUpload, fetchProfileImage, loading, error, imageUrl } = useProfileImage();
    useEffect(() => {
        fetchProfileImage(student._id);
    }, [student._id]);

    const handleSegmentChange = (index) => {
        setSelectedIndex(index.nativeEvent.selectedSegmentIndex);
    };
    const formatDate = (date) => {
        const d = new Date(date);
        const ye = new Intl.DateTimeFormat("tr", { year: "numeric" }).format(d);
        const mo = new Intl.DateTimeFormat("tr", { month: "long" }).format(d);
        const da = new Intl.DateTimeFormat("tr", { day: "2-digit" }).format(d);
        return `${da} ${mo} ${ye}`;
    };
    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [1, 1],
                allowsEditing: true,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedImageUri = result.assets[0].uri;
                if (selectedImageUri) {
                    setSelectedImage(selectedImageUri);
                    await uploadImage(selectedImageUri);
                } else {
                    showErrorToast("Geçersiz resim seçildi.");
                }
            } else {
                showErrorToast("Resim seçme işlemi iptal edildi.");
            }
        } catch (error) {
            showErrorToast("Resim yükleme sırasında bir hata oluştu.");
        }
    };
    const uploadImage = async (imageUri) => {
        try {
            const response = await fetch(imageUri);
            const blob = await response.blob();
            await handleProfileImageUpload(student._id, blob);
            showSuccessToast("Profil resmi başarıyla güncellendi! 👋");
        } catch (error) {
            console.error("Error from DetailStudents.js => uploadImage():", error);
            showErrorToast("Profil resmi yüklenirken bir hata oluştu.");
        }
    }
    const handleDelete = () => {
        axios
            .delete(ENDPOINTS.DELETE_STUDENT + student._id)
            .then((response) => {
                console.log(response);
                Toast.show({
                    type: "success",
                    text1: "Başarılı",
                    text2: "Öğrenci başarıyla silindi 👋",
                    visibilityTime: 3000,
                    autoHide: true,
                    topOffset: 60,
                    props: {
                        text1Style: { fontSize: 18, fontFamily: "Poppins-SemiBold" },
                        text2Style: { fontSize: 16, fontFamily: "Poppins-Regular" },
                    },
                });
                navigation.goBack();
            })
            .catch((error) => {
                console.error("Delete Request Error:", error);
                Toast.show({
                    type: "error",
                    text1: "Hata",
                    text2: "Öğrenci silinirken bir hata oluştu 😔",
                    visibilityTime: 3000,
                    autoHide: true,
                    topOffset: 60,
                    props: {
                        text1Style: { fontSize: 18, fontFamily: "Poppins-SemiBold" },
                        text2Style: { fontSize: 16, fontFamily: "Poppins-Regular" },
                    },
                });
            });
    };
    const confirmDelete = () => {
        Alert.alert(
            "Öğrenciyi Sil",
            "Öğrenciyi silmek istediğinize emin misiniz?",
            [
                {
                    text: "Vazgeç",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel",
                },
                { text: "Sil", onPress: () => handleDelete() },
            ],
            { cancelable: false }
        );
    };
    const goToUpdate = () => {
        navigation.navigate("UpdateStudent", { student });
    };
    const openModal = () => {
        setModalVisible(true);
    };
    const closeModal = () => {
        setModalVisible(false);
    };
    const defaultAvatar = "https://avatar.iran.liara.run/public";

    return (
        <View style={styles.container}>
            <ImageBackground
                source={{
                    uri: "https://images.unsplash.com/photo-1430232324554-8f4aebd06683?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                }}
                style={styles.backgroundImage}
            >
                {/* Boy ve Kilo Etiketi */}
                <View style={styles.labelContainer}>
                    <Text style={styles.labelText}>
                        {student.height} cm - {student.weight} kg
                    </Text>
                </View>
                <BlurView style={styles.blurView} blurType="light" blurAmount={3}>
                    <TouchableOpacity onPress={openModal}>
                        <Image source={{ uri: imageUrl || selectedImage || defaultAvatar }} style={styles.profileImage} />
                    </TouchableOpacity>
                    <Text style={styles.name}>
                        {student.name} {student.surname}
                    </Text>
                    <Text style={styles.location}>{student.ageCategory}</Text>
                </BlurView>
            </ImageBackground>

            <View style={styles.infoContainer}>
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <View>
                        <Text style={styles.extraInfo}>
                            Sorumlu Hoca: {student.coachId.name} {student.coachId.surname}
                        </Text>
                        <Text style={styles.extraInfo}>Doğum Tarihi: {formatDate(student.birthDate)}</Text>
                        <Text style={styles.dateText}>Kayıt: {formatDate(student.createdAt)}</Text>
                        <Text style={styles.dateText}>
                            Son Güncellenme: {student.updatedAt === student.createdAt ? "Henüz yok" : formatDate(student.updatedAt)}
                        </Text>
                    </View>
                    <View style={{ justifyContent: "space-around" }}>
                        <TouchableOpacity
                            style={{ borderWidth: 1, borderRadius: 32, borderColor: "#85182a", padding: 7, backgroundColor: "#85182a" }}
                            onPress={confirmDelete}
                        >
                            <MaterialIcons name="delete-forever" size={32} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ borderWidth: 1, borderRadius: 32, borderColor: "#4CAF50", padding: 7, backgroundColor: "#4CAF50" }}
                            onPress={() => goToUpdate(student)}
                        >
                            <Entypo name="edit" size={32} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                <SegmentedControl
                    values={["Veli", "Aidat", "Karne"]}
                    selectedIndex={selectedIndex}
                    onChange={handleSegmentChange}
                    style={styles.segmentedControl}
                />
                <View style={styles.selectedComponentContainer}>
                    {selectedIndex === 0 && <StudentDetailParent student={student} parent={parent} />}
                    {selectedIndex === 1 && <StudentDetailPayment studentId={student._id} />}
                    {selectedIndex === 2 && <StudentDetailKarne student={student} />}
                </View>
            </View>

            <Modal animationType="fade" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
                    <View style={{ backgroundColor: "#fff", padding: 20, borderRadius: 10, width: "50%" }}>
                        <TouchableOpacity style={styles.modalButtons} onPress={pickImage}>
                            <Icon name="add" size={32} color="#000" />
                            <Text style={styles.modalButtonsText}>Profil Resmi Ekle</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.modalButtons}>
                            <Icon name="delete" size={32} color="#000" />
                            <Text style={styles.modalButtonsText}>Mevcut Resmi Sil</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{ backgroundColor: "#85182a", padding: 10, borderRadius: 5, alignItems: "center" }}
                            onPress={closeModal}
                        >
                            <Text style={{ color: "#fff", fontFamily: "Poppins-SemiBold" }}>Kapat</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f8f9fa",
    },
    backgroundImage: {
        width: width,
        height: 250,
    },
    blurView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: "#fff",
        marginBottom: 10,
    },
    name: {
        fontSize: 22,
        color: "#fff",
        marginBottom: 5,
        fontFamily: "Poppins-Normal",
    },
    location: {
        fontSize: 16,
        color: "#ddd",
        fontFamily: "Poppins-Regular",
    },
    infoContainer: {
        padding: 20,
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -20, // Üst kısımla birleştirmek için negatif margin
    },
    extraInfo: {
        fontSize: 16,
        color: "#495057",
        marginBottom: 10,
        fontFamily: "Poppins-Regular",
    },
    dateText: {
        fontSize: 14,
        color: "#495057",
        marginBottom: 10,
        fontFamily: "Poppins-Regular",
    },
    segmentedControl: {
        marginTop: 10,
    },
    selectedText: {
        fontSize: 16,
        textAlign: "center",
        marginTop: 10,
        fontFamily: "Poppins-Regular",
    },
    // Boy ve kilo etiketi için stil
    labelContainer: {
        position: "absolute",
        top: 20,
        left: 10,
        padding: 8,
        borderRadius: 8,
        zIndex: 1,
        backgroundColor: "#85182a",
    },
    labelText: {
        color: "#fff",
        fontSize: 12,
        fontFamily: "Poppins-Semibold",
    },
    modalButtons: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    modalButtonsText: {
        fontSize: 14,
        marginLeft: 5,
        fontFamily: "Poppins-Regular",
    },
});

export default DetailStudents;
