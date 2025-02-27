import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import Home from "./Components/Home";
import EditNote from "./Components/Notes/EditNote";
import AddNote from "./Components/Notes/AddNote";
import ProtectedRoute from "./Components/ProtectedRoute";
import ForgetPassword from "./Components/Auth/ForgetPassword";
import Footer from "./Components/Footer";
import ResetPassword from "./Components/Auth/ResetPassword";
const RouteList = ({ toggleDarkMode, darkMode }) => {
    const [searchTerm, setSearchTerm] = React.useState("");

    return (
        <>
            {/* Navbar mit Searchfield */}
            <Navbar toggleDarkMode={toggleDarkMode} darkMode={darkMode} setSearchTerm={setSearchTerm} searchTerm={searchTerm} />

            {/* App Routes */}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reset-password" element={<ResetPassword />} />
             

                <Route
                    path="/add-note"
                    element={
                        <ProtectedRoute>
                            <AddNote />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/edit-note/:id"
                    element={
                        <ProtectedRoute>
                            <EditNote />
                        </ProtectedRoute>
                    }
                />

                {/* gibt searchTerm zu Home  */}
                <Route path="/" element={<Home searchTerm={searchTerm} />} />

                <Route path="/forgot-password" element={<ForgetPassword />} />
            </Routes>
            <Footer />
        </>
    );
};

export default RouteList;
