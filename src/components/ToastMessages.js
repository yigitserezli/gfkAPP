// ToastService.js
import Toast from "react-native-toast-message";

// Başarılı bir mesaj göster
export const showSuccessToast = (message) => {
    Toast.show({
        type: "success",
        text1: "Başarılı!",
        text2: message || "İşlem başarıyla tamamlandı. 👋",
        position: "top",
        visibilityTime: 5000,
        autoHide: true,
        topOffset: 60,
    });
};

// Hata mesajı göster
export const showErrorToast = (message) => {
    Toast.show({
        type: "error",
        text1: "Hata!",
        text2: message || "Bir hata oluştu. Lütfen tekrar deneyin. 😔",
        position: "top",
        visibilityTime: 5000,
        autoHide: true,
        topOffset: 60,
    });
};

// Bilgi mesajı göster
export const showInfoToast = (message) => {
    Toast.show({
        type: "info",
        text1: "Bilgi",
        text2: message || "Bilgilendirme mesajı. 📢",
        position: "top",
        visibilityTime: 5000,
        autoHide: true,
        topOffset: 60,
    });
};
