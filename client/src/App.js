import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import { Landing, Home } from './Views/index';
import AboutUs from "./components/AboutUs/AboutUs"
import Navbar from './components/Navbar/Navbar';

function App() {
  const location = useLocation();
  return (
    <div className="App">
      {location.pathname === '/home' && <Navbar />}
      <Routes>
        <Route exact path='/' element={<Landing />} />
        <Route path='/home' element={<Home />} />
        <Route path='/about' element={<AboutUs />} />

      </Routes>
    </div>
  );
}

export default App;