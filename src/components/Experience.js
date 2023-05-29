
import { OrbitControls,ScrollControls } from "@react-three/drei";
import { Room } from "./room.js";
import { Overlay } from "./overlay.js";

import { Canvas, Group, } from "@react-three/fiber";

export const Experience = ({ handleDiaryClick, handleDashboardClick }) => {
  return (
    <group scale={[1, 1, 1]}>
      <ambientLight intensity={2} />
      <OrbitControls enableZoom={true} />
      <ScrollControls pages={3} damping={0.2}>
        <Overlay />
       
        <Room
          handleDiaryClick={handleDiaryClick}
          handleDashboardClick={handleDashboardClick}
        />
      </ScrollControls>
    </group>
  );
};
