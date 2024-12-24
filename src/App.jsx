import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './index.css';
import AdminHome from './pages/Admin/AdminHome';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminProviders from './pages/Admin/AdminProviders';
import AdminCranes from './pages/Admin/AdminCranes';
import AdminContracts from './pages/Admin/AdminContracts';
import AdminProfile from  './pages/Admin/AdminProfile';
import AdminContractDetail from './components/AdminComponents/AdminContractDetail';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/AdminHome" />} />
                <Route path="/AdminHome" element={<AdminHome />} />
                <Route path="/AdminUsers" element={<AdminUsers />} />
                <Route path="/AdminOrders" element={<AdminOrders />} />
                <Route path="/AdminProviders" element={<AdminProviders />} />
                <Route path="/AdminCranes" element={<AdminCranes />} />
                <Route path="/AdminContracts" element={<AdminContracts />} />
                <Route path="/AdminContractDetail/:id" element={<AdminContractDetail />} />
                <Route path="/AdminProfile" element={<AdminProfile />} />

            </Routes>
        </Router>
    );
};

export default App;