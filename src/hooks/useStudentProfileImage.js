import { useState } from "react";
import { uploadStudentProfileImage, fetchStudentProfileImage } from "../services/firebaseStorageStudentService"; // Servisi içeri aktardık

export const useProfileImage = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    const handleProfileImageUpload = async (studentId, newImage) => {
        setLoading(true);
        setError(null);
        try {
            const url = await uploadStudentProfileImage(studentId, newImage); // Burada studentId kullanıyoruz
            setImageUrl(url); // Yüklenen resmin URL'sini state'e kaydediyoruz
        } catch (err) {
            setError("Profil resmi yüklenirken hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    const fetchProfileImage = async (studentId) => {
        setLoading(true);
        setError(null);
        try {
            const url = await fetchStudentProfileImage(studentId); // Burada studentId kullanıyoruz
            setImageUrl(url); // Getirilen resmin URL'sini state'e kaydediyoruz
        } catch (err) {
            setError("Profil resmi getirilirken hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return { handleProfileImageUpload, fetchProfileImage, loading, error, imageUrl };
};
