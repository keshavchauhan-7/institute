import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InstituteScreen from '../components/InstituteScreen';
import StudentScreen from '../components/StudentScreen';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InstituteScreen />} />
        <Route path="/student" element={<StudentScreen />} />
      </Routes>
    </Router>
  );
};

export default App;

