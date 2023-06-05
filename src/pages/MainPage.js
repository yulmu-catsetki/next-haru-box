import React, { useEffect,useRef,useState   } from 'react';
import { Experience } from "../components/Experience.js";
import { Canvas,useFrame } from "@react-three/fiber";
import CameraControls from '../components/CameraControls';
import {
  usePathname,
  useRouter,
  useSearchParams,
  useSelectedLayoutSegment,
  useSelectedLayoutSegments,
  redirect,  
  notFound,
} from 'next/navigation';
import { OrthographicCamera, Shadow } from "@react-three/drei";
import { db } from "../firebase";
import {
  collection,
  query,
  doc,
  getDocs,
  orderBy
} from "firebase/firestore";





const MainPage = () => {
  const router = useRouter();

  const [dashboardClicked, setDashboardClicked] = useState(false);
  const [cameraPosition, setCameraPosition] = useState([2.56529, 2.20877, -2.05944]);
  const handleDashboardClick = () => {
    console.log("Dashboard clicked");
    setDashboardClicked(true);
  };

  const handleCameraUpdate = (camera) => {
    // Manipulate the camera as desired
    //camera.rotation.x += 0.01;
    //camera.rotation.y += 0.01;
    //camera.rotation.z += 0.01;
  };

  const getEmotion = async () => {  
    const diaryCollection = collection(db, "users", "dummy-id", "diaries");
    const q = query(
      diaryCollection,
      orderBy('date', 'desc')
    );
    const result = await getDocs(q);
    const emotion = result.docs[0].data().emotion;
  }
 
  
  useEffect(() => {
    getEmotion();
  }, []);
  

  const cameraRef = useRef();
  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <h1>Main Page</h1>
      <Canvas orthographic camera={{ zoom: 150, position: cameraPosition }}>
        <CameraControls onCameraUpdate={handleCameraUpdate} handleDashboardClick={handleDashboardClick} />
        
      </Canvas>
    </div>
  );
};



export default MainPage;
