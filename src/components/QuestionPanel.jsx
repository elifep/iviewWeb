import React, { useRef, useState } from 'react';
import Timer from './Timer';
import axios from 'axios';

const QuestionPanel = ({ question, timeRemaining, onSkip, questionIndex, applicationId }) => {
    // const [isUploading, setIsUploading] = useState(false);
    // const [uploadSuccess, setUploadSuccess] = useState(false);
    const videoRef = useRef(null);

    // Video kaydetme işlevi
    // const handleVideoCapture = async () => {
    //     try {
    //         const videoBlob = await getVideoBlob(); // Video kaydetme işlemi
    //         const formData = new FormData();
    //         formData.append('video', videoBlob); // Videoyu formData'ya ekle
    //         formData.append('applicationId', applicationId); // Başvuru ID'sini ekle

    //         setIsUploading(true);

    //         // Videoyu backend'e yolla
    //         const response = await axios.post('http://localhost:5000/api/video/upload', formData, {
    //             headers: { 'Content-Type': 'multipart/form-data' }
    //         });

    //         if (response.status === 201) {
    //             setUploadSuccess(true);
    //             console.log('Video başarıyla yüklendi:', response.data);
    //         } else {
    //             console.error('Video yükleme hatası:', response.data);
    //         }
    //     } catch (error) {
    //         console.error('Video yüklenirken hata oluştu:', error);
    //     } finally {
    //         setIsUploading(false);
    //     }
    // };

    // Videoyu Blob formatında elde eden yardımcı fonksiyon
    // const getVideoBlob = () => {
    //     return new Promise((resolve) => {
    //         const videoStream = videoRef.current.srcObject;
    //         const mediaRecorder = new MediaRecorder(videoStream);
    //         const chunks = [];

    //         mediaRecorder.ondataavailable = (event) => {
    //             chunks.push(event.data);
    //         };

    //         mediaRecorder.onstop = () => {
    //             const blob = new Blob(chunks, { type: 'video/mp4' });
    //             resolve(blob);
    //         };

    //         mediaRecorder.start();
    //         setTimeout(() => mediaRecorder.stop(), 3000); // 3 saniye bekle ve videoyu durdur
    //     });
    // };

    return (
        <div className="flex flex-col h-full justify-between">
            {/* Soru Başlığı ve Detayları */}
            <div className="mb-4">
                <h3 className="text-lg font-semibold text-teal-900 mb-2">
                    Soru {questionIndex + 1}: {question?.questionText || "No question available"}
                </h3>
            </div>

            {/* Video Kayıt Alanı */}
            {/* <div className="mb-4">
                <video ref={videoRef} autoPlay muted></video>
            </div> */}

            {/* Bilgilendirme ve Uyarı Metinleri */}
            <div className="flex flex-col mt-4 mb-4">
                <p className="text-red-600 text-sm leading-relaxed font-medium bg-red-100 p-1 rounded">
                    Mülakat sırasında çıkış yaparsanız tekrar giremezsiniz.
                </p>

                {/* Geç ve Tamamla Butonları */}
                {/* <div className="flex justify-between mt-8">
                    <button className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600" onClick={onSkip}>
                        Skip
                    </button>
                    <button
                        className="bg-teal-500 text-white py-2 px-4 rounded hover:bg-teal-900"
                        onClick={handleVideoCapture}
                        disabled={isUploading}
                    >
                        {isUploading ? 'Uploading...' : 'Done'}
                    </button>
                </div> */}
{/* 
                {uploadSuccess && <p className="text-green-500">Video başarıyla yüklendi!</p>} */}
            </div>
        </div>
    );
};

export default QuestionPanel;
