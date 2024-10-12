import React, { useState, useRef } from "react";
import { Text, View, Image, TouchableOpacity, Animated, StyleSheet } from "react-native";
import styles from "../../styles/AppStyles";
import Icon from "react-native-vector-icons/Ionicons";
import { useProfileImage } from "../../hooks/useProfileImage";
import * as ImagePicker from "expo-image-picker";
import { showSuccessToast, showErrorToast } from "../../components/ToastMessages";
import SignOutButton from "../../utils/signOut";

const Header = ({ userInfo }) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownHeight = useRef(new Animated.Value(0)).current;
    const { handleProfileImageUpload, loading, error, imageUrl } = useProfileImage(userInfo.parentId);
    const [selectedImage, setSelectedImage] = useState(null);

    const toggleDropdown = () => {
        if (dropdownVisible) {
            Animated.timing(dropdownHeight, {
                toValue: 0,
                duration: 600,
                useNativeDriver: false,
            }).start(() => setDropdownVisible(false));
        } else {
            setDropdownVisible(true);
            Animated.timing(dropdownHeight, {
                toValue: 100,
                duration: 600,
                useNativeDriver: false,
            }).start();
        }
    };
    const pickImage = async () => {
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [1, 1],
                allowsEditing: true,
            });

            //Yeni surumde ImagePicker sonucu artik assets icinde donmekte imis. O yuzden assets[0] ile secilen resmin uri'sine ulasabiliriz.
            if (!result.canceled && result.assets && result.assets.length > 0) {
                const selectedImageUri = result.assets[0].uri;
                if (selectedImageUri) {
                    console.log("Image selected:", selectedImageUri); // Seçilen resmin URI'si
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
            await handleProfileImageUpload(userInfo.parentId, blob);
            showSuccessToast("Profil resmi başarıyla yüklendi! 👋");
        } catch (error) {
            console.error("Error from Header.js => uploadImage():", error);
            showErrorToast("Profil resmi yüklenirken bir hata oluştu.");
        }
    };
    const defaultAvatar = "https://avatar.iran.liara.run/public";

    return (
        <View
            style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingTop: 10, paddingHorizontal: 15, zIndex: 1 }}
        >
            <View style={{ gap: 5 }}>
                <Text style={styles.textForFont}>Merhaba, {userInfo && userInfo.name ? userInfo.name : "Guest"}</Text>
                <Text style={styles.subTitleText}>Gaziemir FK Öğrenci Yönetim Sistemi</Text>
            </View>
            <TouchableOpacity onPress={toggleDropdown}>
                <Image style={{ width: 60, height: 60, borderRadius: 30, borderWidth: 2 }} source={{ uri: imageUrl || selectedImage || defaultAvatar }} />
            </TouchableOpacity>

            {/* Dropdown Menü */}
            {dropdownVisible && (
                <Animated.View style={[styles2.dropdownContainer, { height: dropdownHeight }]}>
                    <TouchableOpacity style={styles2.menuItem} onPress={pickImage}>
                        <Icon name="image-outline" size={20} color="#000" style={styles2.menuIcon} />
                        <Text>Ekle / Güncelle</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles2.menuItem} onPress={() => console.log("Exit will be here")}>
                        <Icon name="exit-outline" size={20} color="#000" style={styles2.menuIcon} />
                        <Text>Çıkış</Text>
                    </TouchableOpacity>
                </Animated.View>
            )}
        </View>
    );
};

const styles2 = StyleSheet.create({
    dropdownContainer: {
        position: "absolute",
        top: 70,
        right: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 2,
        elevation: 5, // Android için gölge
        zIndex: 1000, // Menü diğer elemanların üstünde olmalı
        overflow: "hidden", // Animasyon sırasında taşmayı engellemek için
    },
    menuItem: {
        flexDirection: "row", // İkon ve yazının yan yana olmasını sağlar
        alignItems: "center",
        padding: 10,
    },
    menuIcon: {
        marginRight: 10, // İkon ile yazı arasında boşluk
    },
});

export default Header;
