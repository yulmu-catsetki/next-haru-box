import "../styles/globals.css";
import { useEffect, useRef, useState } from 'react';
import { SessionProvider } from "next-auth/react";
import { AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const { session, ...restPageProps } = pageProps;
  const router = useRouter();

  const audioRef = useRef(null);

  const [audioFiles, setAudioFiles] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    // You can replace the fetch URL with your API endpoint that lists the audio files.
    fetch('/api/audioFiles')
      .then(response => response.json())
      .then(files => {
        const filePaths = files.map(file => `/audio/bgm/${file}`);
        setAudioFiles(filePaths);
      })
      .catch(error => console.error('Error fetching audio files:', error));
  }, []);

  const handleTrackEnd = () => {
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    setCurrentTrackIndex(randomIndex);
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("ended", handleTrackEnd);
      audioElement.currentTime = currentTime;

      return () => {
        audioElement.removeEventListener("ended", handleTrackEnd);
      };
    }
  }, [audioFiles, currentTime]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.ontimeupdate = () => {
        setCurrentTime(audioRef.current.currentTime);
      };
    }
  }, [audioRef.current]);

  return (
    <SessionProvider session={session}>
      <AnimatePresence mode="wait" initial={false}>
        <div>
          {audioFiles.length > 0 && (
            <audio ref={audioRef} src={audioFiles[currentTrackIndex]} autoPlay loop></audio>
          )}

          <div style={{ position: 'absolute', top: '10px', right: '15px', zIndex: 1000 }}>
            <button onClick={togglePlay} style={{ background: 'transparent', border: 'none' }}>
              {isPlaying ? (
                <span style={{ fontSize: '20px', color: 'white' }}>❚❚</span>
              ) : (
                <span style={{ fontSize: '20px', color: 'white' }}>▶</span>
              )}
            </button>
          </div>
          
          <Component {...restPageProps} key={router.asPath} />
        </div>
      </AnimatePresence>
    </SessionProvider>
  );
}
