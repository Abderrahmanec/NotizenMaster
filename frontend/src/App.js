import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import Logout from './Components/Logout';
import AddNote from './Components/AddNote';

function App() {
  return (
    <Router>
      <Routes>
       
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/add-note" element={<AddNote />} />

      </Routes>
    </Router>
  );
}

export default App;
