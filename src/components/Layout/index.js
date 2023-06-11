import { motion } from "framer-motion";
import { useAudio } from '../../contexts/AudioContext';
import { useEffect } from "react";

const Layout = ({ children, delay = 0 }) => {

  const { BGMRef, BGSRef, isBGMPlaying, isBGSPlaying, toggleBGM, toggleBGS, setBGMVolume, setBGSVolume, pauseBGM, pauseBGS, playBGM, playBGS } = useAudio();

  const handleBGMVolumeChange = (event) => {
    setBGMVolume(event.target.value);
  };

  const handleBGSVolumeChange = (event) => {
    setBGSVolume(event.target.value);
  };

  return (
    <div>
      <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1000, color: 'white' }}>
        {/* BGM Controls */}
        <div style={{ padding: '5px', cursor: 'pointer' }} onClick={toggleBGM}>
          BGM: {isBGMPlaying ? '❚❚' : '▶'}
        </div>
        <div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            onChange={handleBGMVolumeChange}
            defaultValue={BGMRef.current ? BGMRef.current.volume : 1}
          />
        </div>

        {/* BGS Controls */}
        <div style={{ padding: '5px', cursor: 'pointer' }} onClick={toggleBGS}>
          BGS: {isBGSPlaying ? '❚❚' : '▶'}
        </div>
        <div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            onChange={handleBGSVolumeChange}
            defaultValue={BGSRef.current ? BGSRef.current.volume : 1}
          />
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
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Layout;
