import React from 'react';
import { CheckCircleIcon } from "@heroicons/react/24/solid"; // v2 import yolu

function SuccessPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-teal-50">
            <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg mx-auto">
                <div className="flex items-center space-x-4">
                    <CheckCircleIcon className="h-12 w-12 text-green-500" />
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Mülakat Kaydedildi!</h2>
                        <p className="text-gray-600 mt-1">Mülakat kaydınız başarıyla alınmıştır. Teşekkür ederiz!</p>
                    </div>
                </div>
                <div className="mt-4">
                    <button
                        onClick={() => window.location.href = 'https://remotetech.work/cloud-training'} // Örneğin anasayfaya yönlendirebilirsiniz
                        className="bg-teal-500 text-white py-2 px-4 rounded-md hover:bg-teal-600 transition duration-300"
                    >
                        Anasayfaya Dön
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SuccessPage;
