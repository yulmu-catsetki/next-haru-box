import React, { useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { Html } from '@react-three/drei';

export function Diary({ handleDiaryClick }) {
  const { nodes } = useGLTF('/models/diary.glb');
  const [hovered, setHovered] = useState(false);
  const ref = useRef();

  const handlePointerOver = () => {
    setHovered(true);
  };

  const handlePointerOut = () => {
    setHovered(false);
  };


  const textPosition = [-0.3, 0, 0]; // Adjust the position of the text

  return (
    <group ref={ref} onClick={handleDiaryClick} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut}>
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
      {hovered && (
        <Html position={textPosition}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '150px',
              height: '25px',
              background: 'white',
              color: '#6096B4',
              font: 'Roboto',
            }}
          >
            Go to Diary Page
          </div>
        </Html>
      )}
    </group>
  );
}

useGLTF.preload('/models/diary.glb');
