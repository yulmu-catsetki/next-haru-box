import React, { useLayoutEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { usePathname, useRouter } from 'next/navigation';
import { useGLTF, useVideoTexture } from '@react-three/drei';
import styles from './Room.module.css';

export function Room({ handleDashboardClick }) {
  const { nodes, materials } = useGLTF('/models/final.glb');
  const isDashboardPage = usePathname() === '/DashboardPage';
  const ref = useRef(null);
  const tl = useRef(null);
  const [hovered, setHovered] = useState(false);

  const router = useRouter();

  useFrame(() => { });

  // Load video texture
  const videoTexture = useVideoTexture('/video/screen.mp4');
  videoTexture.flipY = false;

  const handleDashboardPointerOver = () => {
    setHovered(true);
  };

  const handleDashboardPointerOut = () => {
    setHovered(false);
  };

  const [clickCount, setClickCount] = useState(0);
  const [isAngryCat, setIsAngryCat] = useState(false);
  const [timerId, setTimerId] = useState(null);

  const handleCatClick = () => {

    // Angry 상태에서 클릭될 경우
    if (isAngryCat) {
      // 시간을 다시 설정
      resetTimer();
      playAngryCatSound();
      return;
    }
  
    // 일반 클릭 처리
    setClickCount((prevCount) => {
      if (prevCount === 9) { // 10번째 클릭 시
        setIsAngryCat(true); // 고양이를 angry 상태로 설정
        resetTimer(); // 타이머 리셋
        playAngryCatSound();
        return 0; // 클릭 횟수를 초기화
      } else {
        playNormalCatSound();
        return prevCount + 1; // 클릭 횟수 증가
      }
    });
  };
  
  const playAngryCatSound = () => {
    const audio = new Audio('/audio/se/angry_cat.mp3');
    audio.volume = 0.2;
    audio.play();
  };
  
  const playNormalCatSound = () => {
    const audio = new Audio('/audio/se/meow.mp3');
    audio.volume = 0.2;
    audio.play();
  };
  
  const resetTimer = () => {
    if (timerId) {
      clearTimeout(timerId);
    }
  
    const newTimerId = setTimeout(() => {
      setIsAngryCat(false);
    }, 10000);
  
    setTimerId(newTimerId);
  };
   

  return (
    <group dispose={null} ref={ref}>
      {Object.entries(nodes).map(([name, node], index) => {
        if (name === 'dashboard') {
          return (
            <mesh
              key={index}
              geometry={node.geometry}
              material={node.material}
              position={node.position}
              rotation={node.rotation}
              scale={node.scale}
              onPointerOver={handleDashboardPointerOver}
              onPointerOut={handleDashboardPointerOut}
              onClick={handleDashboardClick}
            />
          );
        }

        if (!hovered && name === 'Text') {
          return null; // Skip rendering the 'Text' node if not hovered
        }

        if (name === 'screen') {
          return (
            <mesh
              key={index}
              geometry={node.geometry}
              material={materials[name]}
              position={node.position}
              rotation={node.rotation}
              scale={node.scale}
            >
              <meshBasicMaterial attach="material" map={videoTexture} />
            </mesh>
          );
        }


        if (name === 'cat') {
          return (
            <mesh
              key={index}
              onClick={handleCatClick}
              geometry={node.geometry}
              material={node.material}
              position={node.position}
              rotation={node.rotation}
              scale={node.scale}
            >

            </mesh>
          );
        }


        return (
          <mesh
            key={index}
            geometry={node.geometry}
            material={node.material}
            position={node.position}
            rotation={node.rotation}
            scale={node.scale}
          />
        );
      })}
    </group>
  );
}

useGLTF.preload('/models/room.glb');
