import * as THREE from 'three';
import { useRef,useEffect } from 'react';
import { useFrame,useLoader} from '@react-three/fiber';
import { useGLTF, Mask, useMask } from '@react-three/drei';

function Rain({ texture }) {
  const stencil = useMask(1, false);
  const { nodes } = useGLTF('/models/rain.glb');

  return Object.entries(nodes).map(([name, node], index) => (
    <mesh
      key={index}
      geometry={node.geometry}
      castShadow
      receiveShadow
      position={node.position}
      rotation={node.rotation}
      scale={node.scale}
    >
      <meshPhongMaterial map={texture} {...stencil} />
    </mesh>
  ));
}

export function Outside({ diaries }) {
  const ref = useRef(null);

  const getLastDiary = () => {
    if (diaries.length === 0) {
      return null;
    }
    return diaries[diaries.length - 1];
  };

  const lastDiary = getLastDiary();

  const getCurrentTexture = () => {
    const currentDate = new Date().toLocaleDateString('ko-KR');
    if (!lastDiary || lastDiary.date.toDate().toLocaleDateString('ko-KR') !== currentDate) {
      return '/models/default.jpg';
    }
    const emotion = lastDiary.emotion;
    switch (emotion) {
      case 1:
        return '/models/sunny.jpg';
      case 2:
        return '/models/rainy.jpg';
      case 3:
        return '/models/lightning.jpg';
      default:
        return '/models/default.jpg';
    }
  };

  const texture = useLoader(THREE.TextureLoader, getCurrentTexture());

  useFrame(() => {
    // Add any animation or frame updates here
  });

  return (
    <group dispose={null} ref={ref}>
      <Mask id={1} position={[-1.1, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial />
      </Mask>
      <Rain texture={texture} />
    </group>
  );
}

