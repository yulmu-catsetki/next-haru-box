import React, { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import { TextureLoader, RepeatWrapping } from 'three';
import '/public/font.css';

export function DiaryObjects({ diaries }) {
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
        await document.fonts.ready; // Wait for the font to be loaded
        const latestDiaries = diaries.slice(-12); // Get the latest 12 diaries from the back

        const loadedBoxes = await Promise.all(
          latestDiaries.map((diary, index) =>
            new Promise((resolve) => {
              const canvas = document.createElement('canvas');
              canvas.width = 600; // Set the canvas width
              canvas.height = 800; // Set the canvas height
              canvas.setAttribute('willReadFrequently', 'true');
              const ctx = canvas.getContext('2d');
              ctx.fillStyle = 'white';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.font = '18px CustomFont'; // Set the font style to your custom font
              ctx.fillStyle = 'white';

              const img = new Image();
              img.crossOrigin = 'anonymous';
              img.src = diary.imgUrl;
              img.onload = () => {
                // Draw the image on the canvas
                ctx.drawImage(img, 30, 20, 540, 360);

                // Set the text style for date, emotion, and content
                const date = diary.date.toDate().toLocaleDateString('ko-KR');
                ctx.fillText(date, 35, 40);
                ctx.font = '25px CustomFont'; // Set the font style to your custom font
                const emoji = emotionMap[diary.emotion] || '';
                ctx.fillText(emoji, 30, 440);

                ctx.font = '45px CustomFont'; // Set the font style to your custom font
                ctx.fillStyle = 'black';
                const maxLineWidth = 540; // Maximum width for a line of text
                const lineHeight = 43; // Height of each line
                const lines = splitTextIntoLines(diary.content, ctx, maxLineWidth);

                // Draw each line of the text
                lines.forEach((line, lineIndex) => {
                  const lineY = 490 + lineIndex * lineHeight;
                  ctx.fillText(line, 30, lineY);
                });

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

                  const position = [-0.5 + (index % 4) * 0.35, 0.55 - Math.floor(index / 4) * 0.25, -1];

                  const tmpBox = new THREE.BoxGeometry(0.3, 0.2, 0.01);
                  const frontMaterial = new THREE.MeshBasicMaterial({ map: textureFront });
                  const backMaterial = new THREE.MeshBasicMaterial({ map: textureBack });
                  const sideMaterial = new THREE.MeshBasicMaterial({ color: 'white' });

                  const materials = [
                    sideMaterial, // Right side
                    sideMaterial, // Left side
                    sideMaterial, // Top side
                    sideMaterial, // Bottom side
                    frontMaterial, // Front side
                    backMaterial, // Back side
                  ];

                  const rotation = [0, 0, 0];
                  const handleCardHover = (event) => {
                    const hoveredBox = event.object;
                    hoveredBox.rotation.y += Math.PI;
                  };
                  const handleCardLeave = (event) => {
                    const leftBox = event.object;
                    leftBox.rotation.y -= Math.PI;
                  };

                  const box = (
                    <mesh
                      key={diary.id}
                      rotation={rotation}
                      position={position}
                      geometry={tmpBox}
                      material={materials}
                      onPointerOver={handleCardHover}
                      onPointerLeave={handleCardLeave}
                    />
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

  const splitTextIntoLines = (text, ctx, maxLineWidth) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';

    words.forEach((word) => {
      const lineWithWord = currentLine ? currentLine + ' ' + word : word;
      const lineWidth = ctx.measureText(lineWithWord).width;

      if (lineWidth <= maxLineWidth) {
        currentLine = lineWithWord;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });

    lines.push(currentLine);
    return lines;
  };

  return <group>{boxes}</group>;
}
