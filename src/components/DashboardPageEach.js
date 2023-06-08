import React, { useState, useEffect } from 'react';

const DashboardPageEach = ({ diary, onClose, onDelete }) => {


    const getEmotionIcon = (emotion) => {
        switch (emotion) {
            case 1:
                return '😐'; // Neutral
            case 2:
                return '😀'; // Joy
            case 3:
                return '😭'; // Sadness
            case 4:
                return '😡'; // Anger
            default:
                return '';
        }
    };

    const [isFlipped, setIsFlipped] = useState(false);

    const toggleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = diary.imgUrl;
        link.download = 'diary-image.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="fixed z-10 inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded-lg max-w-md relative">
            <button
              onClick={onClose}
              className="absolute top-2 right-2 flex items-center justify-center w-10 h-10 bg-gray-500 text-white font-semibold rounded-md shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4">
              {diary.date instanceof Date
                ? diary.date.toLocaleDateString()
                : diary.date.toDate().toLocaleDateString()}
            </h2>
            {isFlipped ? (
              <div className="relative">
                <img src={diary.imgUrl} alt="Diary" className="w-full h-64 object-cover mb-4 rounded-lg" />
                <p className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-base text-gray-800 bg-white bg-opacity-80 rounded-lg">
                  {diary.content}
                </p>
              </div>
            ) : (
              <div className="relative">
                <img src={diary.imgUrl} alt="Diary" className="w-full h-64 object-cover mb-4 rounded-lg" />
              </div>
            )}
            <div className="flex justify-between items-center">
              <div className="text-2xl">{getEmotionIcon(diary.emotion)}</div>
              <div className="flex">
              <button
                  onClick={toggleFlip}
                  className="ml-2 px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                >
                  뒤집기
                </button>
                <button
                  onClick={handleDownload}
                  className="ml-2 px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
                >
                  저장
                </button>
                <button
                  onClick={() => onDelete(diary.id)}
                  className="ml-2 px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-75"
                >
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      );
      
      
};

export default DashboardPageEach;