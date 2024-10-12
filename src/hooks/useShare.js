import { useState } from "react";
import * as Sharing from "expo-sharing";
import { Alert } from "react-native";

const useShare = () => {
    const [loading, setLoading] = useState(false);

    const sharePDF = async (filePath) => {
        try {
            setLoading(true);

            // Paylaşım API'sinin cihazda mevcut olup olmadığını kontrol edin
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(filePath);
                Alert.alert("Başarılı", "PDF dosyası paylaşıldı!");
            } else {
                Alert.alert("Hata", "Bu cihaz paylaşımı desteklemiyor.");
            }

            setLoading(false);
        } catch (error) {
            console.error("PDF paylaşma hatası:", error);
            Alert.alert("Hata", "PDF paylaşılırken bir hata oluştu.");
            setLoading(false);
        }
    };

    return { sharePDF, loading };
};

export default useShare;
