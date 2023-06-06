import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { TextureLoader,RepeatWrapping } from 'three';

export function DiaryObjects({ diaries }){
  const ref = useRef(null);
  const [boxes, setBoxes] = useState([]);

  useEffect(() => {
    const emotionMap = {
      1: '😐',
      2: '😀',
      3: '😭',
      4: '😡',
    };

    const loadTextures = async () => {
      if (Array.isArray(diaries)) {
        const loadedBoxes  = await Promise.all(
          diaries.map((diary,index) =>
            new Promise((resolve) => {
              const canvas = document.createElement('canvas');
              canvas.width = 600; // Set the canvas width
              canvas.height = 800; // Set the canvas height
              const ctx = canvas.getContext('2d');
              ctx.fillStyle = 'white';
              ctx.fillRect(0, 0, canvas.width, canvas.height);

              const img = new Image();
              img.crossOrigin = 'anonymous';
              img.src = diary.imgUrl;
              img.onload = () => {
                // Draw the image on the canvas
                ctx.drawImage(img, 30, 20, 540, 360);

                // Set the text style for date, emotion, and content
                ctx.font = '18px Arial';
                ctx.fillStyle = 'white';

                const date = diary.date.toDate().toLocaleDateString('ko-KR');
                ctx.fillText(date, 35, 40);

                const emoji = emotionMap[diary.emotion] || '';
                ctx.fillText(emoji, 30, 430);

                ctx.font = '15px Arial';
                ctx.fillStyle = 'black';
                ctx.fillText(diary.content, 30, 460);

                ctx.beginPath();
                ctx.moveTo(0, canvas.height / 2);
                ctx.lineTo(canvas.width, canvas.height / 2);
                ctx.strokeStyle = 'grey';
                ctx.lineWidth = 2;
                ctx.stroke();

                const dataURL = canvas.toDataURL();
                const textureFront = new THREE.Texture();
                const textureBack = new THREE.Texture();

                const loader = new TextureLoader();
                loader.load(dataURL, (texture) => {
                  const halfHeight = canvas.height / 2;
                  const frontData = ctx.getImageData(0, 0, canvas.width, halfHeight);
                  const backData = ctx.getImageData(0, halfHeight, canvas.width, halfHeight);

                  textureFront.image = frontData;
                  textureFront.needsUpdate = true;
                  textureFront.wrapS = RepeatWrapping;
                  textureFront.repeat.set(1, 1); // Repeat the texture on the front side

                  textureBack.image = backData;
                  textureBack.needsUpdate = true;
                  textureBack.wrapS = RepeatWrapping;
                  textureBack.repeat.set(1, 1); // Repeat the texture on the back side


                  const position = [(index % 5) * 0.8, -Math.floor(index / 5) * 1.01, 0];

                  const box = (
                    <mesh key={diary.id} position={position}>
                      <boxGeometry args={[0.6, 0.4, 0.01]} />
                      <meshBasicMaterial map={textureBack} side={THREE.FrontSide} />
                    </mesh>
                  );

                  resolve(box);



            
                });
              };
            })
          )
        );
        setBoxes(loadedBoxes);
        console.log('textures loaded');
      }
    };

    loadTextures();
  }, [diaries]);

  return (
    <group>{boxes}</group>
  );
}