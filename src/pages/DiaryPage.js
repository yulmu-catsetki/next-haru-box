import React, { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import "firebase/firestore";
import { db } from "../firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import axios from 'axios';
import { useAudio } from '../contexts/AudioContext';
import '../../public/font.css'

import './book-layout.css';
import Layout from '../components/Layout';
const DiaryPage = () => {

  const router = useRouter();
  const { data: session, status } = useSession();

  const MAX_CONTENT_LENGTH = 140;  // 일기 글자수 제한
  const MAX_GENERATE_TIMES = 6; // 하루에 생성할 수 있는 그림의 최대 횟수

  const [isLoading, setLoading] = useState(false);

  const [date, setDate] = useState(new Date().toLocaleDateString('ko-KR'));
  const [content, setContent] = useState('');
  const [emotion, setEmotion] = useState(0);

  const [imgUrl, setImgUrl] = useState(''); // 임시 URL. 화면 표시용
  const [imgB64, setImgB64] = useState(''); // base64문자열. 사진 저장용

  // 남은 생성 횟수
  const [generateTimes, setGenerateTimes] = useState(MAX_GENERATE_TIMES);
  const [dummyMode, setDummyMode] = useState(false); // 테스트 용



  const handleSaveDiary = async () => {

    if (!session) {
      alert('로그인이 필요합니다!');
      return;
    }

    if (content.trim() === '') {
      alert('일기 내용을 입력하세요!');
      return;
    }

    if (imgUrl.trim() === '') {
      alert('그림을 생성하세요!');
      return;
    }

    setLoading(true);  // 로딩 시작

    // Firebase Storage와 Firestore 초기화
    const storage = getStorage(); // Firebase Storage 인스턴스
    const userDiariesCollection = collection(db, 'users', session.user.id, 'diaries');

    const blob = b64toBlob(imgB64, 'image/jpeg');

    // 기존 내용을 덮어쓰는 것을 방지하기 위해 파일에 대해 고유한 이름 생성
    const fileName = `${content.substring(0, 20)}_${session?.user?.name}_${Date.now()}`;

    // Firebase Storage에 파일에 대한 참조 생성
    const storageRef = ref(storage, fileName);

    try {

      // 파일을 Firebase Storage에 업로드
      const snapshot = await uploadBytesResumable(storageRef, blob);

      // 파일에 대한 다운로드 URL 가져오기
      let url = await getDownloadURL(snapshot.ref);

      // 이미지 URL이 포함된 일기 객체 생성
      if (imgUrl && !imgB64) { url = imgUrl }

      const diary = { content, emotion, date: serverTimestamp(), imgUrl: url };

      // 일기를 Firestore에 저장
      await addDoc(userDiariesCollection, diary);

      console.log('Diary successfully written!');
      alert('일기가 정상적으로 저장되었습니다.');

      console.log('daa');

      changeEmotion(emotion);
      router.push('/MainPage');

    } catch (e) {
      console.error('Error writing document: ', e);
    } finally {
      setLoading(false); // 로딩 끝
    }

    setContent('');
    setEmotion(1);
    setImgUrl('');
    setImgB64('');
  };

  // base64를 Blob으로 변환하는 함수
  function b64toBlob(b64Data, contentType = '', sliceSize = 512) {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  const checkAndResetGenerateTimes = () => {
    const storedDate = localStorage.getItem('generateDate');
    const currentDate = new Date().toLocaleDateString();

    console.log("checkAndResetGenerateTimes");

    if (storedDate !== currentDate) {
      console.log("resetToken");

      localStorage.setItem('generateTimes', MAX_GENERATE_TIMES);
      localStorage.setItem('generateDate', currentDate);
      setGenerateTimes(MAX_GENERATE_TIMES);
    }
  };
  
  const { changeEmotion } = useAudio();

  const handleGenerateImage_Dummy = () => {

    // 그림 생성 전에 로컬 스토리지를 확인하고 제한 횟수를 확인하는 함수
    const canGenerateImage = () => {

      console.log("canGenerateImage");

      checkAndResetGenerateTimes();

      let storedTimes = Number(localStorage.getItem('generateTimes'));

      if (storedTimes > 0) {
        localStorage.setItem('generateTimes', String(storedTimes - 1));
        setGenerateTimes(storedTimes - 1);

        console.log("generateTimes: " + generateTimes);
        return true;
      } else {
        alert(`하루에 ${MAX_GENERATE_TIMES}번만 그림을 생성할 수 있습니다.`);
        return false;
      }
    };

    if (canGenerateImage()) {
      const url = "https://picsum.photos/seed/" + Date.now() + "/800/600";
      setImgUrl(url);
    }
  };

  const handleGenerateImage_OPENAI = async (event) => {

    if (content.trim() === '') {
      alert('일기 내용을 입력하세요!');
      return;
    }

    event.preventDefault();
    console.log("prompt: " + content);

    // 날짜가 바뀌었는지 확인하고 횟수를 재설정하는 함수
    const checkAndResetGenerateTimes = () => {
      const storedDate = localStorage.getItem('generateDate');
      const currentDate = new Date().toLocaleDateString();

      if (storedDate !== currentDate) {
        localStorage.setItem('generateTimes', MAX_GENERATE_TIMES);
        localStorage.setItem('generateDate', currentDate);
        setGenerateTimes(MAX_GENERATE_TIMES);
      }
    };

    // 그림 생성 전에 로컬 스토리지를 확인하고 제한 횟수를 확인하는 함수
    const canGenerateImage = () => {
      checkAndResetGenerateTimes();

      let storedTimes = Number(localStorage.getItem('generateTimes'));

      if (storedTimes > 0) {
        localStorage.setItem('generateTimes', String(storedTimes - 1));
        setGenerateTimes(storedTimes - 1);

        console.log("generateTimes: " + generateTimes);
        return true;
      } else {
        alert(`하루에 ${MAX_GENERATE_TIMES - 1}번만 그림을 생성할 수 있습니다.`);
        return false;
      }
    };

    if (!canGenerateImage()) { return; }

    try {
      const res = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: content }),
      });

      if (!res.ok) {
        alert(`HTTP error! status: ${res.status}`);
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setImgUrl(data.imageUrl);
    } catch (error) {
      // 오류 객체 전체를 출력
      console.error("이미지 생성 요청에서 오류 발생: ", error);

      // 오류 메시지를 출력
      console.error("오류 메시지: ", error.message);

      // 오류가 발생한 위치를 출력 (브라우저에서 지원하는 경우)
      console.error("오류 스택: ", error.stack);

      // fetch 요청에 사용한 URL과 옵션을 출력
      console.error("fetch 요청 URL: /api/image");
      console.error("fetch 요청 옵션: ", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
    }
  };
  const handleGenerateImage_Dream = async () => {
    console.log("prompt: " + content);

    // 그림 생성 전에 로컬 스토리지를 확인하고 제한 횟수를 확인하는 함수
    const canGenerateImage = () => {
      checkAndResetGenerateTimes();

      let storedTimes = Number(localStorage.getItem('generateTimes'));

      if (storedTimes > 0) {
        localStorage.setItem('generateTimes', String(storedTimes - 1));
        setGenerateTimes(storedTimes - 1);

        console.log("generateTimes: " + generateTimes);
        return true;
      } else {
        alert(`하루에 ${MAX_GENERATE_TIMES}번만 그림을 생성할 수 있습니다.`);
        return false;
      }
    };

    if (!canGenerateImage()) { return; }

    try {

      setLoading(true); // 로딩 시작
      const res = await axios.post('/api/dream', { style_id: 96, prompt: content, target_img_path: null });

      console.log("응답 데이터: ", res.data);

      setImgUrl(res.data.imageUrl);
      setImgB64(res.data.imgB64);

      setIsDiaryFinished(true);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // 로딩 완료
    }
  };

  const [isDiaryFinished, setIsDiaryFinished] = useState(false);

  const handleFinishDiary = () => {

    if (content.trim() === '') {
      alert('일기 내용을 입력하세요!');
      return;
    }

    handleGenerateImage_Dream();
  };


  const handleContentChange = (e) => setContent(e.target.value);
  const handleEmotionChange = (val) => setEmotion(val);
  const handleDummyModeChange = () => setDummyMode(!dummyMode);

  useEffect(() => {

    if (typeof localStorage !== 'undefined') {
      const storedTimesString = localStorage.getItem('generateTimes');
      if (storedTimesString === null) {
        localStorage.setItem('generateTimes', MAX_GENERATE_TIMES);
        setGenerateTimes(MAX_GENERATE_TIMES);
      } else {
        setGenerateTimes(Number(storedTimesString));
      }
    }

    checkAndResetGenerateTimes();
  }, []);

  const backIcon = (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
  </svg>
  );

  const imageIcon = (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
    <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
  );

  const getDayOfWeek = (dateString) => {
    const days = ["(일)", "(월)", "(화)", "(수)", "(목)", "(금)", "(토)"];
    const date = new Date(dateString);
    return days[date.getDay()];
  };

  const displayDate = `${date} ${getDayOfWeek(date)}`; // 예: '2023-06-12 (월)'

  return (
    <Layout><div className={`flex min-h-screen flex-col bg-gray-100 p-4 ${isLoading ? 'relative' : ''}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center" style={{ zIndex: 10 }}>
          <div className="loader">
            <div className="spinner"></div>
          </div>
        </div>
      )}
      <div className="scene" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>

        {/* 뒤로 가기 버튼*/}
        <div className="flex self-start items-center mb-4" style={{ zIndex: 10, position: 'absolute', top: '5px', left: '10px' }}>
          <button
            onClick={() => router.push('/MainPage')}
            className="flex items-center space-x-2 px-4 py-2 font-bold text-white bg-transparent rounded-full focus:outline-none focus:shadow-outline"
          >
            <div>{backIcon}</div>
            <div>메인으로 돌아가기</div>
          </button>

        </div>

        {/* 책 오브젝트 */}
        <div className="book-wrap">
          <div className="left-side">
            <div className="book-cover-left"></div>
            <div className="layer1">
              <div className="page-left"></div>
            </div>
            <div className="layer2">
              <div className="page-left"></div>
            </div>
            <div className="layer3">
              <div className="page-left"></div>
            </div>
            <div className="layer4">
              <div className="page-left"></div>
            </div>
            <div className="layer-text">
              <div className="page-left-2">
                <div className="corner"></div>
                <div className="corner2"></div>
                <div className="corner-fold"></div>
                <div className="page-text w-richtext flex flex-col h-full">
                  {/* Placeholder for DiaryPage content */}
                  <h3 className="font-bold text-gray-800 mb-3" style={{ fontFamily: 'CustomFont, sans-serif', fontSize: 35 }}>{displayDate}</h3>

                  <textarea
                    value={content}
                    onChange={handleContentChange}
                    maxLength={MAX_CONTENT_LENGTH}
                    placeholder="일기를 작성하세요..."
                    disabled={isDiaryFinished}
                    className="w-full h-3/5 flex-grow px-3 py-2 mb-0 text-gray-700 border rounded-lg focus:outline-none focus:shadow-outline"
                    style={{ flexBasis: '60%', fontFamily: 'CustomFont, sans-serif', fontSize: 25 }}
                  />
                  <div className="flex flex-col w-full px-3 py-1">
                    <div className="flex items-start">
                      <div className="flex mr-auto">
                        {[
                          '😐', // Neutral
                          '😀', // Joy
                          '😭', // Sadness
                          '😡', // Anger
                        ].map((val, index) => (
                          <button
                            key={index}
                            onClick={() => handleEmotionChange(index)}
                            disabled={isDiaryFinished}
                            className={`w-14 h-10 rounded-full border-2 border-gray-300 focus:outline-none mx-2 text-xl ${emotion === index ? 'bg-blue-500' : 'bg-white'
                              }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                      <div className="ml-auto text-xs text-gray-400">
                        {`${content.length}/${MAX_CONTENT_LENGTH}`}
                      </div>
                    </div>

                  </div>
                  <button
                    onClick={handleFinishDiary}
                    disabled={isDiaryFinished}
                    className={`w-full px-10 py-3 mt-4 font-bold rounded-full focus:outline-none focus:shadow-outline ${!isDiaryFinished ? 'text-white bg-blue-500 hover:bg-blue-400' : 'text-gray-500 bg-gray-300'}`}>

                    일기 작성 완료
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="center"></div>
          <div className="right-side">
            <div className="book-cover-right"></div>
            <div className="layer1">
              <div className="page-right"></div>
            </div>
            <div className="layer2 right">
              <div className="page-right"></div>
            </div>
            <div className="layer3 right">
              <div className="page-right"></div>
            </div>
            <div className="layer4 right">
              <div className="page-right"></div>
            </div>
            <div className="layer-text right">
              <div className="page-right-2">
                <div className="page-text w-richtext relative">

                  {/* 그림 표시 */}
                  <div className="w-full h-3/5 shadow-md flex-grow mt-20 mb-0 text-gray-700 border focus:outline-none focus:shadow-outline overflow-hidden">
                    {imgUrl ? (
                      <img src={imgUrl} alt="Generated Art" className="object-cover h-full w-full" />
                    ) : (
                      <img src={'https://via.placeholder.com/900x600/ffffff/&text='} alt="dummy Art" className="object-cover h-full w-full" />
                    )}
                  </div>


                  {/* 다시 그리기 */}
                  <div className="mt-3 mb-3">
                    <button
                      onClick={handleGenerateImage_Dream}
                      disabled={!isDiaryFinished}
                      className={`w-full px-10 py-2.5 mt-3 font-bold rounded-full focus:outline-none focus:shadow-outline ${isDiaryFinished ? 'text-white bg-blue-500 hover:bg-blue-400' : 'text-gray-500 bg-gray-300'}`}
                    >
                      다시 그리기 ({generateTimes}/{MAX_GENERATE_TIMES - 1})
                    </button>
                  </div>

                  {/* 일기 저장 */}
                  <div className="mb-3">
                    <button
                      onClick={handleSaveDiary}
                      disabled={!isDiaryFinished}
                      className={`w-full px-10 py-3 font-bold rounded-full focus:outline-none focus:shadow-outline ${isDiaryFinished ? 'text-white bg-green-500 hover:bg-green-400' : 'text-gray-500 bg-gray-300'}`}
                    >
                      일기 저장
                    </button>
                  </div>

                </div>


              </div>
            </div>
          </div>
        </div>
      </div>



      <div className="flex flex-grow items-center justify-center">
        <div className="w-2/5 flex flex-col items-center justify-center pr-4">


        </div>
        <div className="w-3/5 h-1/2 flex flex-col items-center justify-center pr-5">


        </div>
      </div>
    </div></Layout>
  );


};

export default DiaryPage;