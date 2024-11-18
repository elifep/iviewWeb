import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { useVideoStore } from '../stores/useVideoStore';

const VideoRecorder = ({ className, recording, startRecording, recordingStarted, isButtonVisible }) => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const videoConstraints = {
    width: 1280,
    height: 720,
    aspectRatio: 16 / 9,
    facingMode: "user"
  };
  const { hasPermission, setHasPermission, recordedChunks, setRecordedChunks } = useVideoStore();
 
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (stream) setHasPermission(true);
      } catch (error) {
        setHasPermission(false);
        console.error('Kamera ve mikrofon erişim izni reddedildi:', error);
      }
    };
    checkPermissions();
  }, [setHasPermission]);

  useEffect(() => {
    if (recording) {
      handleStartRecording();
    } else {
      handleStopRecording();
    }
  }, [recording]);

  const handleStartRecording = () => {
    console.log("Kaydı başlatma butonuna tıklandı");
    if (!webcamRef.current || !webcamRef.current.stream) {
      console.error('Kamera akışı bulunamadı');
      return;
    }

    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: 'video/webm'
    });

    let chunks = [];
    mediaRecorderRef.current.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      setRecordedChunks(chunks);
      console.log('Kayıt durduruldu, chunk\'lar kaydedildi:', chunks);
    };


    mediaRecorderRef.current.start();
    console.log('Kayıt başladı...');
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      console.log('Kayıt durduruldu.');
    }
  };

  return (
    <div className={`relative ${className} w-full h-full flex items-center justify-center`}>
         {isButtonVisible && (
        <button
              onClick={startRecording}
              className="absolute bg-red-500 text-white py-2 px-4 rounded-md"
              disabled={recordingStarted}
              style={{ zIndex: 10 }}
            >
              Kaydı Başlat
            </button>
         )}
      {hasPermission ? (
        <Webcam
          audio={true}
          ref={webcamRef}
          mirrored={true}
          videoConstraints={videoConstraints}
          className="w-full h-full object-cover"
        />
      ) : (
        <p className="text-white">Lütfen kamera ve mikrofona izin verin.</p>
      )}
    </div>
  );
};

export default VideoRecorder;
