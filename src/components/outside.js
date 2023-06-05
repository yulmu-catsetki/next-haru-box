import * as THREE from 'three';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Mask, useMask } from '@react-three/drei';

function Rain() {
  const stencil = useMask(1, false);
  const { nodes } = useGLTF('/models/rain.glb');

  // Map through all the nodes and return a mesh for each one
  return Object.entries(nodes).map(([name, node], index) => (
    <mesh
      key={index}
      geometry={node.geometry}
      castShadow
      receiveShadow
      position={node.position} // Use the original position of each node
      rotation={node.rotation} // Use the original rotation of each node
      scale={node.scale} // Use the original scale of each node
    >
      <meshPhongMaterial color="#000000" {...stencil} />
    </mesh>
  ));
}

export function Outside() {
  const ref = useRef(null);
  useFrame(() => {});

  return (
    <group dispose={null} ref={ref}>
      <Mask id={1} position={[-1.1, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial />
      </Mask>
      <Rain />
    </group>
  );
}
