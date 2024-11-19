import React, { useEffect, useState } from 'react';
import { useInterviewStore } from '../stores/useInterviewStore';
import { useVideoStore } from '../stores/useVideoStore';
import ProgressBar from '../components/ProgressBar';
import Timer from '../components/Timer';
import VideoRecorder from './VideoRecorder';
import { useNavigate } from 'react-router-dom'; // Yönlendirme için

const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-50">
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 border-4 border-teal-400 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-white text-lg font-semibold">Yükleniyor...</p>
      </div>
    </div>
  );
};

const InterviewFlowPage = ({ interview }) => {
  const [isLoading, setIsLoading] = useState(false); // Yüklenme durumunu takip ediyoruz

  const {
    currentQuestionIndex,
    nextQuestion,
    timeRemaining,
    totalTimeRemaining,
    decrementTime,
    setInterview
  } = useInterviewStore();

  const { resetChunks, uploadToS3, recordedChunks } = useVideoStore();

  const [recordingStarted, setRecordingStarted] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (interview) {
      setInterview(interview);
    }
  }, [interview, setInterview]);

  useEffect(() => {
    let interval;
    if (recordingStarted) {
      interval = setInterval(() => {
        decrementTime();
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [recordingStarted, decrementTime]);
  // Butonun görünür olup olmadığını kontrol eden state
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  const startRecording = () => {
    console.log("Butona tıklandı");
    setIsButtonVisible(false); // Butonu gizle
    setRecordingStarted(true);
  };
  const handleUpload = async () => {
    console.log("Videoyu Yükle butonuna tıklandı");
    setIsLoading(true); // Yükleniyor durumunu başlat

    try {
      setRecordingStarted(false); // Kaydı durdur
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Kaydın durması için bekle
      await uploadToS3(interview?.id, "candidate-id");
      setUploadSuccess(true); // Yükleme başarılı olduğunda mesajı göster
      console.log("Video başarıyla yüklendi");
      navigate("/success-page"); // Yönlendirme yap
    } catch (error) {
      console.error("Video yüklenemedi:", error);
    } finally {
      setIsLoading(false); // Yükleniyor durumunu bitir
    }
  };


  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds) || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-teal-50">
      {/* Üstte Başlık ve İlerleme Çubuğu */}
      <div className="w-full max-w-7xl mx-auto px-4 pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-800 font-bold text-xl">{interview.title || "Interview Title"}</span>
          <span className="text-gray-700 font-bold text-lg">
            Minutes Remaining: {formatTime(totalTimeRemaining)}
          </span>
        </div>
        <ProgressBar progress={(currentQuestionIndex / interview.questions.length) * 100} />
      </div>

      {/* Sorular ve Video Bölümü */}
      <div className="w-full max-w-7xl mx-auto mt-4 bg-white shadow-lg rounded-lg p-4 flex flex-col md:flex-row md:space-x-4">
        {/* Sorular Bölümü ve Zamanlayıcı */}
        <div className="w-full md:w-1/3 p-4 bg-gray-100 rounded-lg flex flex-col justify-between">
          <div className="flex flex-col items-center mb-6"> {/* Başlık ve Timer daha yakın */}
            {/* Zamanlayıcı */}
            <Timer
              time={timeRemaining}
              label="Minutes Remaining"
              className="ml-2 text-sm mb-2" // Zamanlayıcının altına biraz boşluk ekleyelim
            />
            {/* Sorular Başlığı */}
            <h2 className="text-2xl font-bold text-teal-900 mt-2">Sorular</h2>
          </div>

          <div className="mt-6"> {/* Sorunun metni başlığa biraz daha mesafeli */}
            <h3 className="text-lg font-semibold text-teal-900 mb-4">
              Soru {currentQuestionIndex + 1}: {(interview.questions[currentQuestionIndex])?.questionText || "No question available"}
            </h3>
          </div>
          {/* Skip ve Videoyu Yükle Butonları Sorular Bölümünün Altına */}
          <div className="flex justify-between mt-4">
            <button className="bg-yellow-500 text-white py-2 px-4 rounded-md" onClick={nextQuestion}>
              Skip
            </button>
            <button
              onClick={handleUpload}
              className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-700 cursor-pointer"
            >
              Videoyu Yükle
            </button>
          </div>
          {isLoading && <LoadingScreen />} {/* Yükleniyor ekranını göster */}
          {uploadSuccess && (
            <div className="mt-4 text-green-600 font-bold">
              Video başarıyla yüklendi!
            </div>
          )}
        </div>

        {/* Video Bölümü */}
        <div className="w-full md:w-2/3 flex flex-col items-center">
          <div className="w-full bg-black rounded-lg shadow-lg h-[350px] md:h-[550px] flex items-center justify-center">
            <VideoRecorder
              className="w-full h-full object-cover"
              recording={recordingStarted}
              startRecording={startRecording}
              recordingStarted={recordingStarted}
              isButtonVisible={isButtonVisible}
            />
          </div>
          {/* Kaydı Başlat Butonu Videonun Altında */}
          <div className="mt-4 flex justify-center w-full">
            <p className="text-red-600 text-sm leading-relaxed font-medium bg-red-100 p-1 rounded">
              Mülakat sırasında çıkış yaparsanız tekrar giremezsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>

  );
};

export default InterviewFlowPage;
