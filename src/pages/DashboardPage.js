import React from 'react';
import { useEffect } from 'react';
import { db } from "../firebase";
import {
  collection,
  query,
  doc,
  getDocs,
  orderBy
} from "firebase/firestore";

const DashboardPage = () => {
  // Fetch user's diary entries from a server or local storage
  // Generate postcard images based on diary entries using AIImageService
  // Render postcards with the generated images and relevant information

  const diaries = [];

  const getDiaries = async () => {  
    const diaryCollection = collection(db, "users", "dummy-id", "diaries");
    const q = query(
      diaryCollection,
      orderBy('date')
    );
    const result = await getDocs(q);
    result.docs.forEach((doc) => {
      diaries.push({ id: doc.id, ...doc.data() });
    });
  }

  useEffect(() => {
    getDiaries();
  }, []);

  return (
    <div>
      <h1>Dashboard Page</h1>
      {/* Render the generated postcards */}
    </div>
  );
};

export default DashboardPage;
