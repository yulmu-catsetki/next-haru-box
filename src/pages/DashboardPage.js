import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, getBlob } from "firebase/storage";
import "firebase/firestore";
import { db } from "../firebase";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import axios from 'axios';
import DashboardPageEach from '../components/DashboardPageEach';
import Layout from '../components/Layout';

const DashboardPage = () => {

  const COLUMN_NUM = 5; // 일기 배열 가로 크기
  const ROW_NUM = 3; // 일기 배열 세로 크기

  const router = useRouter();
  const { data: session, status } = useSession();

  const [diaries, setDiaries] = useState([]);

  const [selectedDiary, setSelectedDiary] = useState(null);
  const [isDiaryModalOpen, setIsDiaryModalOpen] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [diaryToDelete, setDiaryToDelete] = useState(null);


  const addDummyDiary = () => {
    const dummyDiary = {
      id: `dummy-${Date.now()}`,
      imgUrl: "https://firebasestorage.googleapis.com/v0/b/haru-box-test.appspot.com/o/mjss.png?alt=media&token=b269907e-6f86-41c6-b38b-a390cd088c62",
      date: new Date(),
      content: "오늘은 세수를 했다.",
      emotion: 2,
    };
    setDiaries(prevDiaries => [...prevDiaries, dummyDiary]);
  }


  const getDiaries = async () => {
    const diaryCollection = collection(db, "users", session.user.id, "diaries");
    const q = query(diaryCollection, orderBy('date'));
    const result = await getDocs(q);

    const fetchedDiaries = result.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    setDiaries(fetchedDiaries);
  }

  const handleDiaryClick = (diary) => {
    setSelectedDiary(diary);
    setIsDiaryModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const diaryRef = doc(db, "users", session.user.id, "diaries", id);
      await deleteDoc(diaryRef);
      console.log("Diary deleted with id:", id);

      // Refresh the diaries list after deleting
      getDiaries();
      closeDeleteModal();

      if (isDiaryModalOpen) { handleCloseDiary(); }
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  }

  // 일기 페이지화 관련 부분

  const [currentPage, setCurrentPage] = useState(1); // 현재 몇 번째 페이지인지
  const [paginatedDiaries, setPaginatedDiaries] = useState([]); // 현재 페이지 일기만 모아둠

  const itemsPerPage = COLUMN_NUM * ROW_NUM;
  const totalPages = Math.ceil(diaries.length / itemsPerPage);

  function paginateDiaries(diaries, itemsPerPage, currentPage) {
    // 현재 페이지에 표시할 시작 인덱스와 끝 인덱스 계산
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // 해당 범위의 일기들만 반환
    return diaries.slice(startIndex, endIndex);
  }

  // Effect로 현재 페이지 일기 계속 반영
  useEffect(() => {
    const paginatedDiaries = paginateDiaries(diaries, itemsPerPage, currentPage);
    setPaginatedDiaries(paginatedDiaries);
  }, [diaries, currentPage]);

  const handleCloseDiary = () => {
    setIsDiaryModalOpen(false);
    setSelectedDiary(null);
  };

  const openDeleteModal = (id) => {
    setDiaryToDelete(id);
    setIsDeleteModalOpen(true);
  }

  const closeDeleteModal = () => {
    setDiaryToDelete(null);
    setIsDeleteModalOpen(false);
  }

  useEffect(() => {
    if (status === "authenticated") {
      getDiaries();
    }
  }, [status]);


return (
  <Layout><div className="p-4">
    <div className="flex self-start items-center mb-4">
      <button
        onClick={() => router.push('/MainPage')}
        className="px-2 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-400 focus:outline-none focus:shadow-outline w-8 h-8 flex items-center justify-center"
      >
        ←
      </button>
      <div className="flex items-center bg-gray-200 p-2 rounded ml-2">
        {session ? (
          <>
            <img
              src={session.user.image}
              alt="Profile Picture"
              className="rounded-full h-8 w-8 mr-2"
            />
            <p className="text-xs font-bold text-gray-800">
              Logged in as {session?.user?.name}
            </p>
          </>
        ) : (
          <p className="text-xs font-bold text-gray-800">
            Not logged in
          </p>
        )}
      </div>
    </div>
    {/* 더미 데이터 추가 버튼 */}
    <button
      onClick={addDummyDiary}
      className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75 mb-4"
    >
      Add Dummy Diary
    </button>

    {/* 페이지네이션 컨트롤 */}
    <div className="flex justify-center my-4">
      {currentPage > 1 && (
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 mr-3"
        >
          Previous Page
        </button>
      )}
      <span className="align-middle self-center mx-4 text-lg font-semibold text-blue-500">
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages && (
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75 ml-3"
        >
          Next Page
        </button>
      )}
    </div>

    {/* 일기 그리드 */}
    <div className={`grid grid-cols-5 gap-4 px-20`}>
      {paginatedDiaries &&
        Array(itemsPerPage).fill(null).map((_, idx) => {
          const diary = paginatedDiaries[idx];
          return diary ? (
            <div
              key={paginatedDiaries[idx].id}
              className="rounded overflow-hidden shadow-lg flex flex-col justify-between min-h-[24rem]"
              onClick={() => handleDiaryClick(diary)} // Added onClick event handler
            >
              <img
                className="w-full h-64 object-cover cursor-pointer" // Added cursor-pointer
                src={diary.imgUrl}
                alt="Diary"
              />
              <div className="px-6 py-4 flex-grow overflow-hidden">
                <div className="font-bold text-xl mb-2">
                  {diary.date instanceof Date
                    ? diary.date.toLocaleDateString()
                    : diary.date.toDate().toLocaleDateString()}
                </div>
                <p className="text-gray-700 text-base line-clamp-3 overflow-ellipsis">
                  {diary.content}
                </p>
              </div>
              <div className="px-6 pt-4 pb-2 flex items-center justify-between">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-lg font-bold text-gray-700 mr-2">
                  {['', '😐', '😀', '😭', '😡'][diary.emotion]}
                </span>
                <button
                  className="inline-block bg-red-200 rounded-md px-3 py-1 text-lg font-bold text-gray-700 mr-2"
                  onClick={() => openDeleteModal(diary.id)}
                >
                  🗑
                </button>
              </div>
            </div>
          ) : (
            <div
              key={idx}
              className="rounded overflow-hidden shadow-lg flex items-center justify-center text-xl min-h-[24rem]"
            >
              📝
            </div>
          );
        })}
    </div>

    {/* 삭제 모달 */}
    {isDeleteModalOpen && (
      <div
        className="fixed z-50 inset-0 overflow-y-auto bg-black bg-opacity-50"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-lg px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                  일기 삭제
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    이 일기를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => handleDelete(diaryToDelete)}
              >
                삭제
              </button>
              <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mr-3 sm:w-auto sm:text-sm"
                onClick={closeDeleteModal}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>
    )}

    {/* 일기 모달 */}
    {isDiaryModalOpen && (
      <DashboardPageEach diary={selectedDiary} onClose={handleCloseDiary} onDelete={openDeleteModal} />
    )}
  </div></Layout>
);


};

export default DashboardPage;
