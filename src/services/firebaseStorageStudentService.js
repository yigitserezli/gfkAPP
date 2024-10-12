import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";
import { storage } from "../config/firebase";

export const uploadStudentProfileImage = async (studentId, newImage) => {
    try {
        if (!newImage) {
            throw new Error("Yüklemek için geçersiz bir resim seçildi.");
        }

        // Öğrenci klasörü içinde image'leri yönetmek
        const folderRef = ref(storage, `studentProfileImages/${studentId}`);
        const existingImages = await listAll(folderRef);

        // Eğer önceden yüklenmiş bir resim varsa, onu sil
        if (existingImages.items.length > 0) {
            for (const itemRef of existingImages.items) {
                await deleteObject(itemRef);
                console.log("Resim silindi:", itemRef.fullPath);
            }
        }

        // Yeni resim yükleme işlemi
        const newImageRef = ref(storage, `studentProfileImages/${studentId}/profileImage`);
        const snapshot = await uploadBytes(newImageRef, newImage);

        const downloadURL = await getDownloadURL(snapshot.ref);
        if (!downloadURL) {
            throw new Error("Profil resmi yüklenirken bir hata oluştu. URL alınamadı.");
        }

        return downloadURL;
    } catch (error) {
        console.error("Firebase Storage Service Hata:", error.message);
        throw error;
    }
};

export const fetchStudentProfileImage = async (studentId) => {
    try {
        const imageRef = ref(storage, `studentProfileImages/${studentId}/profileImage`);
        const downloadURL = await getDownloadURL(imageRef);
        return downloadURL;
    } catch (error) {
        console.info("Firebase Storage Service:", error.message,  "Default resim getirildi.");
        throw new error("Profil resmi getirilirken bir hata oluştu.");
    }
};