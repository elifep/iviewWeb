import React, { useState, useRef, useEffect } from 'react';
import { useInterviewStore } from '../stores/useInterviewStore';
import Webcam from 'react-webcam';

const PersonalInfoFormPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        surname: '',
        email: '',
        phoneNumber: '', // phone yerine phoneNumber olarak değiştirdim
        consent: false,
    });

    const { submitPersonalInfo, error } = useInterviewStore();
    const webcamRef = useRef(null);
    const [hasPermission, setHasPermission] = useState(false);

    const checkPermissions = async () => {
        try {
            const cameraResult = await navigator.permissions.query({ name: 'camera' });
            const microphoneResult = await navigator.permissions.query({ name: 'microphone' });

            const cameraAllowed = cameraResult.state === 'granted';
            const microphoneAllowed = microphoneResult.state === 'granted';

            setHasPermission(cameraAllowed && microphoneAllowed);

            cameraResult.onchange = () => {
                setHasPermission(cameraResult.state === 'granted' && microphoneResult.state === 'granted');
            };

            microphoneResult.onchange = () => {
                setHasPermission(cameraResult.state === 'granted' && microphoneResult.state === 'granted');
            };
        } catch (error) {
            console.error('Kamera veya mikrofon izin kontrolünde hata:', error);
            setHasPermission(false);
        }
    };

    useEffect(() => {
        checkPermissions();

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                checkPermissions();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!hasPermission) {
            alert("Lütfen kamera ve mikrofon erişimini etkinleştirin.");
            return;
        }
        if (formData.consent) {
            submitPersonalInfo(formData);
        } else {
            alert('KVKK metnini kabul etmelisiniz.');
        }
    };

    return (
        <div className="relative w-full h-screen flex items-center justify-center">
            {hasPermission ? (
                <Webcam
                    audio={true}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    mirrored={true}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    videoConstraints={{
                        facingMode: 'user',
                    }}
                />
            ) : (
                <div className="absolute top-0 left-0 w-full h-full bg-black flex items-center justify-center">
                    <p className="text-white text-xl font-bold">
                        Devam etmek için kameraya ve mikrofona izin verin.
                    </p>
                </div>
            )}

            <div className="absolute top-0 left-0 w-full h-full bg-white bg-opacity-20 backdrop-blur-sm"></div>

            <div className="relative z-10 bg-white bg-opacity-90 p-8 shadow-md rounded-lg w-full max-w-md">
                <h2 className="text-xl font-semibold text-teal-700 mb-4">Personal Information Form</h2>

                {!hasPermission && (
                    <p className="text-red-600 mb-4 font-semibold">
                        Lütfen devam etmek için kamera ve mikrofona izin verin.
                    </p>
                )}

                {error && <p className="text-red-600 mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className={`${!hasPermission ? "opacity-50 pointer-events-none" : ""}`}>
                    <label className="block mb-2">Name*</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 rounded-md w-full mb-4"
                        required
                    />

                    <label className="block mb-2">Surname*</label>
                    <input
                        type="text"
                        name="surname"
                        value={formData.surname}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 rounded-md w-full mb-4"
                        required
                    />

                    <label className="block mb-2">Email*</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="border border-gray-300 p-2 rounded-md w-full mb-4"
                        required
                    />

                    <label className="block mb-2">Phone Number*</label> {/* phone -> phoneNumber */}
                    <input
                        type="text"
                        name="phoneNumber" // phone yerine phoneNumber olmalı
                        value={formData.phoneNumber} // phone yerine phoneNumber olmalı
                        onChange={handleChange}
                        className="border border-gray-300 p-2 rounded-md w-full mb-4"
                        required
                    />

                    <div className="mb-4">
                        <label>
                            <input
                                type="checkbox"
                                name="consent"
                                checked={formData.consent}
                                onChange={handleChange}
                                className="mr-2"
                                required
                            />
                            I have read and approved the{' '}
                            <a href="#" className="text-teal-700 underline">
                                KVKK text
                            </a>
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="bg-teal-600 text-white py-2 px-4 rounded hover:bg-teal-700 w-full"
                        disabled={!hasPermission}
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PersonalInfoFormPage;
