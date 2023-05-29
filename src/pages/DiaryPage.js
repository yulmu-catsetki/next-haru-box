import React from 'react';
import { Link } from 'react-router-dom';

const DiaryPage = () => {
  const handleSaveDiary = () => {
    // Implement logic to save the diary entry
  };

  return (
    <div>
      <h1>Diary Page</h1>
      {/* Render the blurred background image of a zoomed-in desk */}
      <textarea maxLength={140} />
      <button onClick={handleSaveDiary}>Save</button>
      <Link to="/">Back</Link>
    </div>
  );
};

export default DiaryPage;
