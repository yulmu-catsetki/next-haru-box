import React, { useLayoutEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { usePathname, useRouter } from 'next/navigation';
import { useGLTF } from '@react-three/drei';
import styles from './Room.module.css';

export function Diary() {
  const { nodes, materials, animations } = useGLTF('/models/diary.glb');
  const router = useRouter();
  const ref = useRef(null);

  const handleDiaryClick = () => {
    router.push('/DiaryPage') ; // Replace '/DiaryPage' with the actual path of your DiaryPage component
  };

  
  return (
    <group dispose={null} ref={ref} onClick={handleDiaryClick} >
      {Object.entries(nodes).map(([name, node], index) => (
        <mesh
          key={index}
          geometry={node.geometry}
          material={node.material}
          position={node.position}
          rotation={node.rotation}
          scale={node.scale}
   
        />
      ))}
    </group>
  );
}

useGLTF.preload('/models/Diary.glb');
