import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

/**
 * Ödeme dekontunu Firebase Storage'a yükle
 * @param {File} file - Yüklenecek dosya
 * @param {string} apartmanId - Apartman ID
 * @param {string} daireId - Daire ID
 * @returns {Promise<string>} - Dosyanın download URL'i
 */
export async function uploadOdemeDekont(file, apartmanId, daireId) {
  try {
    // Dosya adı: dekontlar/apartmanId/daireId/timestamp_dosyaadi
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const filePath = `dekontlar/${apartmanId}/${daireId}/${fileName}`;

    const storageRef = ref(storage, filePath);

    // Dosyayı yükle
    const snapshot = await uploadBytes(storageRef, file);

    // Download URL'i al
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  } catch (error) {
    console.error('Dekont yükleme hatası:', error);
    throw error;
  }
}

/**
 * Dosya boyutu kontrolü (max 5MB)
 * @param {File} file
 * @returns {boolean}
 */
export function validateFileSize(file) {
  const maxSize = 5 * 1024 * 1024; // 5MB
  return file.size <= maxSize;
}

/**
 * Dosya tipi kontrolü (sadece resim ve PDF)
 * @param {File} file
 * @returns {boolean}
 */
export function validateFileType(file) {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
  return allowedTypes.includes(file.type);
}
