import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import ZkCDNMinting from './components/UploadContent';
import App from './App';
import './index.css';
import Navbar from './components/Navbar';
import ZkCDNSearch from './components/ZkCDNSearch';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* <Route path="/app" element={<App />} /> */}
        <Route path="/search" element={<ZkCDNSearch />} />
        <Route path="/contentprovider" element={<ZkCDNMinting />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);