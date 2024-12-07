import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import AdminHome from './pages/Admin/AdminHome';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminOrders from './pages/Admin/AdminOrders';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/AdminHome" />} />
                <Route path="/AdminHome" element={<AdminHome />} />
                <Route path="/AdminUsers" element={<AdminUsers />} />
                <Route path="/AdminOrders" element={<AdminOrders />} />
            </Routes>
        </Router>
    );
};

export default App;