import { OrthographicCamera, useGLTF, useScroll } from "@react-three/drei";

import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import React, { useLayoutEffect, useRef, useState } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
  redirect,  
  notFound,
} from 'next/navigation';
import styles from "./Room.module.css";

export function Room(props) {
  const { nodes, materials } = useGLTF("/models/final.glb");
  
  const ref = useRef(null);
  const tl = useRef(null);

  const [isDiaryHovered, setIsDiaryHovered] = useState(false);

  const router = useRouter();

  const scroll = useScroll();

  useFrame(() => {
    if (tl.current) {
      tl.current.seek(scroll.offset * tl.current.duration());
    }
  });

  const handleDiaryClick = () => {
    console.log("Diary clicked");
    router.push("/DiaryPage");
  };

  const handleDashboardClick = () => {
    console.log("Dashboard clicked");

    //router.push("/DashboardPage");
  };

  const handleDiaryMouseOver =() =>{
    console.log("over");
    setIsDiaryHovered(true);
    if(tl.current){
      tl.current.kill();
      tl.current = gsap.timeline();
    }
    
    
  }
  const handleDiaryMouseLeave =() =>{
    console.log("leave");
    setIsDiaryHovered(false);

    if(tl.current){
      tl.current.to(diaryMesh.current.rotation, { duration: 1, y: Math.PI * 2 });
    }
    
    
  }

  const { nodes: diaryNodes, materials: diaryMaterials } = useGLTF("/models/diary.glb");
  const diaryMeshes = Object.values(diaryNodes).filter((node) => node.type === "Mesh");


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

useFrame(() => {
  
});



return (
  
<group {...props} dispose={null} ref={ref}>
{Object.entries(nodes).map(([name, node], index) => (
        <mesh
          key={index}
          geometry={node.geometry}
          material={node.material}
          position={node.position}
          rotation={node.rotation}
          scale={node.scale}
          onClick={name === "dashboard" ? handleDashboardClick : undefined}
          //onClick={name === "diary" ? handleDiaryClick : undefined}
          //onPointerOver={name === "diary" ? handleDiaryMouseOver : undefined}
          //onPointerLeave={name === "diary" ? handleDiaryMouseLeave : undefined}
          //ref={name === "diary" ? diaryMesh : undefined}
          //pointerEvents={name === "diary" ? "auto" : "none"}
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


useGLTF.preload("./models/room.glb");

