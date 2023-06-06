import React, { useLayoutEffect, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import gsap from 'gsap';
import { usePathname, useRouter } from 'next/navigation';
import { useGLTF } from '@react-three/drei';
import styles from './Room.module.css';

export function Room({ handleDashboardClick }) {
  const { nodes, materials } = useGLTF('/models/final.glb');
  const isDashboardPage = usePathname() === '/DashboardPage';
  const ref = useRef(null);
  const tl = useRef(null);

  const [isDiaryHovered, setIsDiaryHovered] = useState(false);

  const router = useRouter();

  const handleDiaryClick = () => {
    console.log('Diary clicked');
    //router.push('/DiaryPage');
  };

  const handleDiaryMouseOver = () => {
    console.log('Over');
    setIsDiaryHovered(true);
    if (tl.current) {
      tl.current.kill();
      tl.current = gsap.timeline();
    }
  };

  const handleDiaryMouseLeave = () => {
    console.log('Leave');
    setIsDiaryHovered(false);
    if (tl.current) {
      tl.current.to(diaryMesh.current.rotation, { duration: 1, y: Math.PI * 2 });
    }
  };

  const { nodes: diaryNodes, materials: diaryMaterials } = useGLTF('/models/diary.glb');
  const diaryMeshes = Object.values(diaryNodes).filter((node) => node.type === 'Mesh');

  

  useFrame(() => {});

  return (
    <group dispose={null} ref={ref}>
      {Object.entries(nodes).map(([name, node], index) => (
        <mesh
          key={index}
          geometry={node.geometry}
          material={node.material}
          position={node.position}
          rotation={node.rotation}
          scale={node.scale}
          onClick={name === 'dashboard' ? handleDashboardClick : undefined}
        />
      ))}
      {diaryMeshes.map((diaryMesh, index) => (
        <mesh
          key={index}
          geometry={diaryMesh.geometry}
          material={diaryMaterials}
          onClick={handleDiaryClick}
          onPointerOver={handleDiaryMouseOver}
          onPointerLeave={handleDiaryMouseLeave}
        />
      ))}
    </group>
  );
}

useGLTF.preload('/models/room.glb');
