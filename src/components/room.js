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

  useFrame(() => {});

  // Load video texture
  const videoTexture = useVideoTexture('/video/screen.mp4');
  videoTexture.flipY = false;

  const handleDashboardPointerOver = () => {
    setHovered(true);
  };

  const handleDashboardPointerOut = () => {
    setHovered(false);
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
