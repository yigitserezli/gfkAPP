import { ref, uploadBytes, getDownloadURL, deleteObject, listAll } from "firebase/storage";
import { storage } from "../config/firebase";

export const uploadProfileImage = async (userId, newImage) => {
    try {
        if (!newImage) {
            throw new Error("Yüklemek için geçersiz bir resim seçildi.");
        }

        const folderRef = ref(storage, `profileImagesWithParentId/${userId}`);
        const existingImages = await listAll(folderRef);

        if (existingImages.items.length > 0) {
            for (const itemRef of existingImages.items) {
                await deleteObject(itemRef);
                console.log("From Service firebaseStorageService.js tarafindan resim silindi:", itemRef.fullPath);
            }
        }

        const newImageRef = ref(storage, `profileImagesWithParentId/${userId}/profileImage`);
        const snapshot = await uploadBytes(newImageRef, newImage);

        const downloadURL = await getDownloadURL(snapshot.ref);
        if (!downloadURL) {
            throw new Error("Profil resmi yüklenirken bir hata oluştu. URL alınamadı.");
        }

        return downloadURL;
    } catch (error) {
        console.error("FrontEnd Service hata):", error.message, error.stack);
        throw error;
    }
};
