import { useState, useEffect } from "react";
import { uploadProfileImage } from "../services/firebaseStorageService";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase";

export const useProfileImage = (parentId) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [imageUrl, setImageUrl] = useState(null);

    const fetchProfileImage = async () => {
        try {
            const folderRef = ref(storage, `profileImagesWithParentId/${parentId}`);
            const existingImages = await listAll(folderRef);

            if (existingImages.items.length > 0) {
                const profileImageRef = existingImages.items[0]; // İlk resmi al
                const downloadURL = await getDownloadURL(profileImageRef);
                setImageUrl(downloadURL);
            }
        } catch (error) {
            setError("Profil resmi alınırken hata oluştu.");
        }
    };

    useEffect(() => {
        if (parentId) {
            fetchProfileImage();
        }
    }, [parentId]);

    const handleProfileImageUpload = async (userId, newImage) => {
        setLoading(true);
        setError(null);
        try {
            const url = await uploadProfileImage(userId, newImage);
            setImageUrl(url); // Yeni profil resminin URL'sini state'e kaydet
        } catch (err) {
            setError("Profil resmi yüklenirken hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return { handleProfileImageUpload, loading, error, imageUrl };
};
