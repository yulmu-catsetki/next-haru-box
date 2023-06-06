import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, getBlob } from "firebase/storage";
import "firebase/firestore";
import { db } from "../firebase";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import axios from 'axios';

const DashboardPage = () => {

  const router = useRouter();
  const { data: session, status } = useSession();

  const [diaries, setDiaries] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [diaryToDelete, setDiaryToDelete] = useState(null);

  const getDiaries = async () => {
    const diaryCollection = collection(db, "users", session.user.id, "diaries");
    const q = query(diaryCollection, orderBy('date'));
    const result = await getDocs(q);

    const fetchedDiaries = result.docs.map((doc) => {
      return { id: doc.id, ...doc.data() };
    });
    setDiaries(fetchedDiaries);
  }

  const handleDelete = async (id) => {
    try {
      const diaryRef = doc(db, "users", session.user.id, "diaries", id);
      await deleteDoc(diaryRef);
      console.log("Diary deleted with id:", id);

      // Refresh the diaries list after deleting
      getDiaries();
      closeModal();
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  }

  const openModal = (id) => {
    setDiaryToDelete(id);
    setIsModalOpen(true);
  }

  const closeModal = () => {
    setDiaryToDelete(null);
    setIsModalOpen(false);
  }

  const handleScrollLeft = () => {
    const container = document.getElementById('diariesContainer');
    container.scrollLeft -= 200; // Adjust the scroll distance as needed
  }

  const handleScrollRight = () => {
    const container = document.getElementById('diariesContainer');
    container.scrollLeft += 200; // Adjust the scroll distance as needed
  }

  useEffect(() => {
    if (status === "authenticated") {
      getDiaries();
    }
  }, [status]);


  return (
    <div className="p-4">
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

      {isModalOpen && (
        <div className="fixed z-10 inset-0 overflow-y-auto bg-black bg-opacity-50" aria-labelledby="modal-title" role="dialog" aria-modal="true">
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
                  onClick={closeModal}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="grid grid-cols-5 gap-4 px-20">
        {Array(15).fill(null).map((_, idx) => (
          diaries[idx] ? (
            <div key={diaries[idx].id} className="rounded overflow-hidden shadow-lg flex flex-col justify-between min-h-[24rem]">
              <img className="w-full h-64 object-cover" src={diaries[idx].imgUrl} alt="Diary" />
              <div className="px-6 py-4 flex-grow overflow-hidden">
                <div className="font-bold text-xl mb-2">{diaries[idx].date.toDate().toLocaleDateString()}</div>
                <p className="text-gray-700 text-base line-clamp-3 overflow-ellipsis">{diaries[idx].content}</p>
              </div>
              <div className="px-6 pt-4 pb-2 flex items-center justify-between">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-lg font-bold text-gray-700 mr-2">
                  {[
                    '',   // No emotion
                    '😐', // Neutral
                    '😀', // Joy
                    '😭', // Sadness
                    '😡', // Anger
                  ][diaries[idx].emotion]}
                </span>
                <button
                  className="inline-block bg-red-200 rounded-full px-3 py-1 text-lg font-bold text-gray-700 mr-2"
                  onClick={() => openModal(diaries[idx].id)}
                >
                  🗑
                </button>
              </div>
            </div>
          ) : (
            <div key={idx} className="rounded overflow-hidden shadow-lg flex items-center justify-center text-xl min-h-[24rem]">📝</div>
          )
        ))}
      </div>
    </div>
  );

};

export default DashboardPage;
