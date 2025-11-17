import {
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

// Apartman oluştur
export async function createApartman(userId, apartmanData) {
  try {
    const apartmanRef = await addDoc(collection(db, 'apartmanlar'), {
      ...apartmanData,
      yoneticId: userId,
      olusturmaTarihi: serverTimestamp(),
      guncellemeTarihi: serverTimestamp(),
    });
    return apartmanRef.id;
  } catch (error) {
    console.error('Apartman oluşturma hatası:', error);
    throw error;
  }
}

// Kullanıcının apartmanlarını getir
export async function getUserApartmanlar(userId) {
  try {
    const q = query(
      collection(db, 'apartmanlar'),
      where('yoneticId', '==', userId),
      orderBy('olusturmaTarihi', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Apartmanları getirme hatası:', error);
    throw error;
  }
}

// Apartman detayını getir
export async function getApartman(apartmanId) {
  try {
    const docRef = doc(db, 'apartmanlar', apartmanId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Apartman getirme hatası:', error);
    throw error;
  }
}

// Daire oluştur
export async function createDaire(apartmanId, daireData) {
  try {
    const daireRef = await addDoc(collection(db, 'daireler'), {
      ...daireData,
      apartmanId,
      toplamBorc: 0,
      olusturmaTarihi: serverTimestamp(),
    });
    return daireRef.id;
  } catch (error) {
    console.error('Daire oluşturma hatası:', error);
    throw error;
  }
}

// Apartmana ait daireleri getir
export async function getApartmanDaireler(apartmanId) {
  try {
    const q = query(
      collection(db, 'daireler'),
      where('apartmanId', '==', apartmanId),
      orderBy('daireNo', 'asc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Daireleri getirme hatası:', error);
    throw error;
  }
}

// Daire detayını getir
export async function getDaire(daireId) {
  try {
    const docRef = doc(db, 'daireler', daireId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Daire getirme hatası:', error);
    throw error;
  }
}

// Daire güncelle
export async function updateDaire(daireId, updates) {
  try {
    const daireRef = doc(db, 'daireler', daireId);
    await updateDoc(daireRef, {
      ...updates,
      guncellemeTarihi: serverTimestamp(),
    });
  } catch (error) {
    console.error('Daire güncelleme hatası:', error);
    throw error;
  }
}

// Gider ekle
export async function createGider(giderData) {
  try {
    const giderRef = await addDoc(collection(db, 'giderler'), {
      ...giderData,
      olusturmaTarihi: serverTimestamp(),
    });
    return giderRef.id;
  } catch (error) {
    console.error('Gider oluşturma hatası:', error);
    throw error;
  }
}

// Apartmana ait giderleri getir
export async function getApartmanGiderler(apartmanId) {
  try {
    const q = query(
      collection(db, 'giderler'),
      where('apartmanId', '==', apartmanId),
      orderBy('tarih', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Giderleri getirme hatası:', error);
    throw error;
  }
}

// Ödeme dekontu ekle
export async function createOdemeDekontu(dekontData) {
  try {
    const dekontRef = await addDoc(collection(db, 'odemeDekontlari'), {
      ...dekontData,
      olusturmaTarihi: serverTimestamp(),
      durum: 'beklemede', // beklemede, onaylandi, reddedildi
    });
    return dekontRef.id;
  } catch (error) {
    console.error('Dekont oluşturma hatası:', error);
    throw error;
  }
}

// Daireye ait ödeme dekontlarını getir
export async function getDaireOdemeDekontlari(daireId) {
  try {
    const q = query(
      collection(db, 'odemeDekontlari'),
      where('daireId', '==', daireId),
      orderBy('olusturmaTarihi', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Dekontları getirme hatası:', error);
    throw error;
  }
}
