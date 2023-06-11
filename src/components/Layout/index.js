import { motion } from "framer-motion";
import { useAudio } from '../../contexts/AudioContext';
import { useState } from "react";

const Layout = ({ children, delay = 0 }) => {

  const { BGMRef, BGSRef, isBGMPlaying, isBGSPlaying, currentBGMName, toggleBGM, toggleBGS, setBGMVolume, setBGSVolume } = useAudio();

  const handleBGMVolumeChange = (event) => {
    setBGMVolume(event.target.value);
  };

  const handleBGSVolumeChange = (event) => {
    setBGSVolume(event.target.value);
  };

  // 모달 상태를 관리하는 state
  const [isModalOpen, setIsModalOpen] = useState(false);

  const muteIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.531V19.94a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.506-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.395C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
  );

  const unmuteIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
    </svg>
  );

  const pauseIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
    </svg>
  );

  const playIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
    </svg>
  );

  const closeIcon = (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
  );

  const configIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="white" className="w-7 h-7">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    </svg>
  );

  const musicIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
    </svg>
  );

  return (
    <div>

      <div className="absolute bottom-0 left-0 m-5 z-10">
        <div
          className="cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          {configIcon}
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-2xl"
            >
              {closeIcon}
            </button>
            {/* BGM Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-1/2 text-right mr-2">
                <span className="text-lg font-semibold">배경음</span>
              </div>
              <div
                className="cursor-pointer w-1/5 text-center mr-2"
                onClick={toggleBGM}
              >
                {isBGMPlaying ? unmuteIcon : muteIcon}
              </div>
              <div className="flex items-center w-3/5">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  onChange={handleBGMVolumeChange}
                  defaultValue={BGMRef.current ? BGMRef.current.volume : 1}
                  className="w-32 mr-4"
                />
              </div>

            </div>
            {/* BGS Controls */}
            <div className="flex items-center justify-between">
              <div className="w-1/2 text-right mr-2">
                <span className="text-lg font-semibold">환경음</span>
              </div>
              <div
                className="cursor-pointer w-1/5 text-center mr-2"
                onClick={toggleBGS}
              >
                {isBGSPlaying ? unmuteIcon : muteIcon}
              </div>
              <div className="flex items-center w-3/5">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  onChange={handleBGSVolumeChange}
                  defaultValue={BGSRef.current ? BGSRef.current.volume : 1}
                  className="w-32 mr-4"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed top-0 right-0 m-2 flex items-center text-white z-10">

              {/* 설정 버튼 */}
        <div
          className="cursor-pointer mr-2"
          onClick={() => setIsModalOpen(true)}
        >
          {configIcon}
        </div>
        {/* 현재 재생 중인 BGM 제목 */}
        <div className="mr-2 font-pointer">{musicIcon}</div>
        <span className="mr-2 font-pointer">{currentBGMName}</span>

        {/* BGM Controls */}
        <div className="p-1 cursor-pointer" onClick={() => { toggleBGM(); toggleBGS() }}>
          {isBGMPlaying ? pauseIcon : playIcon}
        </div>
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
          transition: { delay, type: "spring", stiffness: 300, damping: 20 },
        }}
        exit={{ y: 50, opacity: 0, transition: { type: "spring", stiffness: 300, damping: 20 } }}
        className="z-0"
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Layout;
