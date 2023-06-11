import React, { useState, useEffect } from 'react';
import '../pages/polaroid copy.css';
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
      <div style={{position: "fixed", zIndex: "10", inset: "0", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)"}}>
        <div style={{justifyContent: "start"}}>
          <div className="flip-card" style={{display: "flex", flexDirection: "column", alignItems: "center", top: "10", bottom: "10"}}>
            <div className="flip-card-inner" style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
              {isFlipped ? (
                <li className="flip-card-back" onClick={toggleFlip} style={{position: "relative"}}>
                  <img style={{ objectFit: "cover"}} src={diary.imgUrl} alt="Diary" />
                  <p className="custom-font" style={{position: "absolute", top: "0", left: "0", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "gray", backgroundColor: "rgba(255,255,255,0.8)", borderRadius: "0.375rem"}}>
                    {diary.content}
                  </p>
                  <p>{getEmotionIcon(diary.emotion)}</p>
                </li>
              ) : (
                <li className="flip-card-front" onClick={toggleFlip} style={{position: "relative"}}>
                  <img style={{ objectFit: "cover"}} src={diary.imgUrl} alt="Diary" />
                  <p className="custom-font">{diary.date instanceof Date ? diary.date.toLocaleDateString() : diary.date.toDate().toLocaleDateString()}</p>
                </li>
              )}
    
              
    
              <div style={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: "2"}}>
                <button
                onClick={onClose}
                style={{display: "flex", alignItems: "center", justifyContent: "center", width: "10", height: "10", backgroundColor: "gray", color: "white", fontWeight: "bold", borderRadius: "0.375rem", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"}}>
                ✕
              </button>
              <button
                  onClick={handleDownload}
                  style={{width: "4", height: "2", backgroundColor: "green", color: "white", fontWeight: "bold", fontSize: "small", borderRadius: "0.375rem", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", marginBottom: "1"}}>
                  저장
                </button>
                <button
                  onClick={() => onDelete(diary.id)}
                  style={{width: "4", height: "2", backgroundColor: "red", color: "white", fontWeight: "bold", fontSize: "small", borderRadius: "0.375rem", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", marginTop: "1"}}>
                  삭제
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
    
                  };    

export default DashboardPageEach;

