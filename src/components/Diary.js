import React, { useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { Html } from '@react-three/drei';
import { useRouter } from 'next/navigation';
export function Diary({handleDiaryClick}) {
  const { nodes } = useGLTF('/models/diary.glb');
  const [hovered, setHovered] = useState(false);
  const ref = useRef();
  const router = useRouter();
  const handlePointerOver = () => {
    setHovered(true);
  };

  const handlePointerOut = () => {
    setHovered(false);
  };


  
  


  return (
    <group ref={ref} onClick={handleDiaryClick} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
      {Object.entries(nodes).map(([name, node], index) => {
        if (!hovered && name === 'Text') {
          return null; // Skip rendering the 'Text' node if not hovered
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

useGLTF.preload('/models/diary.glb');
