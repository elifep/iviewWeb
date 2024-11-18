import { create } from 'zustand';
import axios from 'axios';

export const useVideoStore = create((set, get) => ({
  hasPermission: false,
  isRecording: false,
  recordedChunks: [],
  uploadInProgress: false, // Yükleme sırasında durumu göstermek için
  applicationId: null, // Başvuru ID'sini saklamak için yeni state

  // Kamera izni kontrolü
  setHasPermission: (permission) => set({ hasPermission: permission }),
  
  // Kayıt durumu
  setIsRecording: (isRecording) => set({ isRecording }),
  
  // Kaydedilen video chunk'larını güncelleme
  setRecordedChunks: (chunks) => set({ recordedChunks: chunks }),

  // Başvuru ID'sini ayarlamak için bir fonksiyon
  setApplicationId: (id) => set({ applicationId: id }), // Yeni fonksiyon

  // Kayıt chunk'larını sıfırlama
  resetChunks: () => set({ recordedChunks: [] }),

  uploadToS3: async () => {
    const { recordedChunks, applicationId } = get(); // Başvuru ID'yi store'dan alıyoruz
  
    console.log('Alındı', applicationId); // Başvuru ID'yi burada logluyoruz
  
    if (!applicationId) {
      console.error('Başvuru ID eksik, video yüklenemiyor.');
      return;
    }
  //
    if (recordedChunks.length === 0) {
      console.warn('Yüklenecek video yok');
      return;
    }
  
    // Blob oluştur
    const videoBlob = new Blob(recordedChunks, { type: 'video/webm' });
    const formData = new FormData();
    formData.append('video', videoBlob, 'interview_video.webm'); // Video dosyasını formData'ya ekliyoruz
    formData.append('applicationId', applicationId); // Başvuru ID'sini ekliyoruz
  
    try {
      // S3'e yükleme için API çağrısı
      const response = await axios.post('http://localhost:5000/api/video/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Video başarıyla yüklendi:', response.data);
  
      // Yükleme sonrası chunk'ları sıfırlıyoruz
      set({ recordedChunks: [] });
    } catch (error) {
      console.error('Video yüklenemedi:', error);
  }
},
}));