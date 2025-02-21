import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Landing';
import GTranslate from './components/Gtranslate';
import Login from './pages/Login';
import Register from './pages/Signup';
import CommunicationAIDashboard from './pages/dashboard';
import VoiceInputPage from './pages/VoiceInput';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {/* Move GTranslate outside of Routes */}
      <GTranslate /> 

      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/dashboard' element={<CommunicationAIDashboard />} />
        <Route path='/voice' element={<VoiceInputPage />} />
      </Routes>
    </>
  );
}

export default App;
