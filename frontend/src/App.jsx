import React from 'react'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import { Toaster } from 'react-hot-toast'; 
import Dashboard from './pages/Dashboard'; 
import Productos from './pages/Productos'; 
import Reportes from './pages/Reportes'; 

function App() { 
  return ( 
    <BrowserRouter> 
      <Toaster position="top-right" /> 
      <Routes> 
        <Route path="/" element={<Dashboard />} /> 
        <Route path="/productos" element={<Productos />} /> 
        <Route path="/reportes" element={<Reportes />} /> 
        <Route path="*" element={<Dashboard />} /> 
      </Routes> 
    </BrowserRouter> 
  ); 
} 

export default App; 
