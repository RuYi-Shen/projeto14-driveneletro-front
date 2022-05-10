import { React, useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserContext from "./contexts/UserContext";

import Login from "./routecomponents/Login.jsx";
import Register from "./routecomponents/Register";

import NotFound from "./routecomponents/NotFound";

import './css/reset.css';
import './css/style.css';

export default function App() {

    const [userData, setUserData] = useState({});

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </UserContext.Provider>
    );
}
