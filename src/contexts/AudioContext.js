import React, { createContext, useContext, useEffect, useRef, useState } from 'react';


const AudioContext = createContext();

export const useAudio = () => {
    return useContext(AudioContext);
};

export const AudioProvider = ({ children }) => {
    const BGMRef = useRef(null);
    const BGSRef = useRef(null);

    const [isBGMPlaying, setIsBGMPlaying] = useState(false);
    const [isBGSPlaying, setIsBGSPlaying] = useState(false);

    const [currentBGMName, setCurrentBGMName] = useState('');
    const [currentEmotion, setCurrentEmotion] = useState(-1);

    // 노래 목록을 정의합니다.

    const BGMList = [
        '/audio/bgm/00.Hedgehog.mp3',
        '/audio/bgm/01.Sanctuary.mp3',
        '/audio/bgm/02.Compromise.mp3',
        '/audio/bgm/03.Bridge.mp3',
    ];

    const BGSList = [
        '/audio/bgs/00_default.mp3',
        '/audio/bgs/01_sunny.mp3',
        '/audio/bgs/02_rain.mp3',
        '/audio/bgs/03_thunderstorm.mp3',
    ];

    const toggleBGM = () => { isBGMPlaying ? pauseBGM() : playBGM(); };
    const toggleBGS = () => { isBGSPlaying ? pauseBGS() : playBGS(); };

    const pauseBGM = () => {
        BGMRef.current.pause();
        setIsBGMPlaying(false);
    }

    const pauseBGS = () => {
        BGSRef.current.pause();
        setIsBGSPlaying(false);
    }

    const playBGM = () => {
        try {
            BGMRef.current.play();
            setIsBGMPlaying(true);
        } catch {
            setIsBGMPlaying(false);
        }
    };


    const playBGS = () => {
        try {
            BGSRef.current.play();
            setIsBGSPlaying(true);
        } catch {
            setIsBGSPlaying(false);
        }
    };

    const setBGMVolume = (volume) => {
        if (volume >= 0 && volume <= 1) {
            BGMRef.current.volume = volume;
        } else {
            console.warn('볼륨 값은 0과 1 사이여야 합니다.');
        }
    };

    const setBGSVolume = (volume) => {
        if (volume >= 0 && volume <= 1) {
            BGSRef.current.volume = volume;
        } else {
            console.warn('볼륨 값은 0과 1 사이여야 합니다.');
        }
    };

    const changeEmotion = (emotion) => {
        if (emotion >= 0 && emotion < 4) {

            if(emotion != currentEmotion){// 감정 변화 있음
                BGMRef.current.src = BGMList[emotion];
                BGSRef.current.src = BGSList[emotion];
                playBGM();
                playBGS();
            }

            setCurrentBGMName(BGMList[emotion].substring(BGMList[emotion].lastIndexOf('/') + 1, BGMList[emotion].lastIndexOf('.mp3')));
            setCurrentEmotion(emotion);
        }
    }

    // 자동재생 정책 관련
    const initPlayer = () => {
        BGMRef.current.muted = true;
        BGSRef.current.muted = true;
        // playBGM();
        // playBGS();
    };

    useEffect(() => {
        // 오디오가 끝났을 때 랜덤한 곡을 재생하는 함수를 정의합니다.
        const ChangeRandomBGM = () => {
            const randomIndex = Math.floor(Math.random() * BGMList.length);
            changeBGM(randomIndex);
            playBGM();
        };

        // 오디오가 끝났을 때 랜덤한 곡을 재생하는 이벤트 리스너를 등록합니다.
        // BGMRef.current.addEventListener('ended', ChangeRandomBGM);

        // 컴포넌트 unmount 시에 이벤트 리스너를 제거합니다.
        return () => {
            // BGMRef.current.removeEventListener('ended', ChangeRandomBGM);
        };
    }, []);


    return (
        <AudioContext.Provider value={{ BGMRef, BGSRef, isBGMPlaying, isBGSPlaying, currentBGMName, toggleBGM, toggleBGS, changeEmotion, pauseBGM, pauseBGS, playBGM, playBGS, setBGMVolume, setBGSVolume, initPlayer }}>
            <audio ref={BGMRef} src={BGMList[0]} loop />
            <audio ref={BGSRef} src={BGSList[0]} loop />
            {children}
        </AudioContext.Provider>
    );
};
