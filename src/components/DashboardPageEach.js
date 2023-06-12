import React, { useState, useEffect } from 'react';
import '../pages/polaroid.css';
const DashboardPageEach = ({ diary, onClose, onDelete }) => {


    const getEmotionIcon = (emotion) => {
        switch (emotion+1) {
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
      <div style={{ position: 'fixed', zIndex: '10', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div style={{ justifyContent: 'start' }}>
          <div  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', top: '10', bottom: '10' }}>
            <div  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
              {isFlipped ? (
                <li-no-hover  onClick={toggleFlip} style={{ position: 'relative' } }>
                  <div style={{ position: 'relative' }}>
                    <img style={{ objectFit: 'cover', opacity: '0.5' }} src={diary.imgUrl} alt="Diary" />
                    <div
                      className="custom-font"
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: 'gray',
                        borderRadius: '0.375rem',
                        textAlign: 'left',
                        padding: '10px',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        fontSize: '35px',
                      }}
                    >
                      {diary.content}
                    </div>
                  </div>
                  <p>{getEmotionIcon(diary.emotion)}</p>
                </li-no-hover>
              ) : (
                <li-no-hover className="flip-card-front" onClick={toggleFlip} style={{ position: 'relative' }}>
                  <img style={{ objectFit: 'cover' }} src={diary.imgUrl} alt="Diary" />
                  <p className="custom-font">{diary.date instanceof Date ? diary.date.toLocaleDateString() : diary.date.toDate().toLocaleDateString()}</p>
                </li-no-hover>
              )}
    
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2' }}>
                <button
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '6rem', // Increase button width
                    height: '4rem', // Increase button height
                    backgroundColor: 'gray',
                    color: 'white',
                    fontWeight: 'bold',
                    borderRadius: '0.375rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    marginBottom: '1rem',
                  }}
                >
                  ✕
                </button>
                <button
                  onClick={handleDownload}
                  style={{
                    width: '6rem', // Increase button width
                    height: '4rem', // Increase button height
                    backgroundColor: 'green',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 'small',
                    borderRadius: '0.375rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    marginBottom: '1rem',
                  }}
                >
                  저장
                </button>
                <button
                  onClick={() => onDelete(diary.id)}
                  style={{
                    width: '6rem', // Increase button width
                    height: '4rem', // Increase button height
                    backgroundColor: 'red',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: 'small',
                    borderRadius: '0.375rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  }}
                >
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

