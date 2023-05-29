import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StartPage from './StartPage';
import MainPage from './MainPage';
import DiaryPage from './DiaryPage';
import DashboardPage from './DashboardPage';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // 일단 임시로 이렇게 둠. 

  return (
    <div className="App">
      <Router>
        <h1>3D Website</h1>
        <Routes>
          <Route path="/" element={<StartPage setIsLoggedIn={setIsLoggedIn} />} />
          {isLoggedIn && <Route path="/main/*" element={<MainPage />} />}
          <Route path="/diary" element={<DiaryPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
