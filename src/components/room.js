import { OrthographicCamera, useGLTF,useScroll } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import React, { useLayoutEffect, useRef,useState  } from "react";
import * as THREE from 'three';
import { useNavigate } from "react-router-dom";
import styles from './Room.module.css';

export function Room(props) {
  const { nodes, materials } = useGLTF("./models/room.glb");
  const ref = useRef(null);
  const tl = useRef(null);
  const diaryMesh = useRef(null);
  const [isDiaryHovered, setIsDiaryHovered] = useState(false);

  const diaryPosition =nodes["diary"].position;
  const navigate = useNavigate();

  const scroll = useScroll();

  useFrame(() => {
    if(tl.current){
      tl.current.seek(scroll.offset * tl.current.duration());
    }
    

  });

  const handleDiaryClick = () => {
    console.log("Diary clicked");
    navigate("/diary");
  };

  const handleDashboardClick = () => {
    console.log("Dashboard clicked");
    navigate("/dashboard");
  };

  const handleDiaryMouseOver =() =>{
    console.log("over");
    setIsDiaryHovered(true);
    //diaryPosition.current.z += 0.01;
    if(tl.current){
      tl.current.kill();
      tl.current = gsap.timeline();
    }
    
    
  }
  const handleDiaryMouseLeave =() =>{
    console.log("leave");
    setIsDiaryHovered(false);
    //diaryPosition.current.z -= 0.01;
    if(tl.current){
      tl.current.to(diaryMesh.current.rotation, { duration: 1, y: Math.PI * 2 });
    }
    
    
  }
  useLayoutEffect(() => {
    if(tl.current){
    tl.current = gsap.timeline();
    // Room Rotation
    tl.current.to(ref.current.rotation, { duration: 1, x: 0, y: Math.PI / 6, z: 0 }, 0);
    tl.current.to(ref.current.rotation, { duration: 1, x: 0, y: -Math.PI / 6, z: 0 }, 1);

    // Room movement
    tl.current.to(ref.current.position, { duration: 1, x: -1, z: 2 }, 0);
    tl.current.to(ref.current.position, { duration: 1, x: 1, z: 2 }, 1);

    }
    Object.values(nodes).forEach((mesh) => {
      console.log(mesh.name, mesh.scale,mesh.position,mesh.rotation);

});

// ...
}, []);
// Separate useFrame for diary mesh rotation
useFrame(() => {
  if (diaryMesh.current) {
    diaryMesh.current.rotation.y += 0.01;
  }
});



return (
  
<group {...props} dispose={null} ref={ref}>
<mesh
geometry={nodes["diary"].geometry}
material={nodes["diary"].material}
position={diaryPosition}
rotation={nodes["diary"].rotation}
scale={nodes["diary"].scale}
onClick={handleDiaryClick}
onPointerOver={handleDiaryMouseOver}
onPointerLeave={handleDiaryMouseLeave}
ref={diaryMesh}
pointerEvents="auto"
/> 
  <mesh

    geometry={nodes["dashboard"].geometry}
    material={nodes["dashboard"].material}
    position={nodes["dashboard"].position}
    rotation={nodes["dashboard"].rotation}
    scale={nodes["dashboard"].scale}
    onClick={handleDashboardClick}

  />
  <mesh
    geometry={nodes["room"].geometry}
    material={nodes["room"].material}
    position={nodes["room"].position}
    rotation={nodes["room"].rotation}
    scale={nodes["room"].scale}

  />
  
</group>


);
}

useGLTF.preload("./models/room.glb");