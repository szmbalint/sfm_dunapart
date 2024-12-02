import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import CarPicker from "./components/car/CarPicker";
import DatePicker from "./components/date/DatePicker";
import PlotPicker from "./components/plot/PlotPicker";
import ForgotPassword from './components/auth/ForgotPassword';
import Dashboard from './Dashboard';

import logoImage from '../src/assets/logo.png';
import kepImage from '../src/assets/kep.png';

function Home() {
  return (
    <div className="grid-container">
      <div className="left-panel">
      <div className="section1">
          <img src={logoImage} alt="Section1" className='section-logo' /> {/* Használjuk a logoImage változót */}
        </div>

        <div className="section2">
          <p className="section-text">
            We make <br />
            parking <br />
            effortless
          </p>
        </div>

        <div className="section3">
          <img src={kepImage} alt="Section3" className='section-kep' /> {/* Használjuk a kepImage változót */}
        </div>
      </div>

      <div className="right-panel">
      <h1>Welcome to DunaPark!</h1>
      <nav>
        <button><Link to="/Login">Login</Link></button>
        <button><Link to="/Register">Register</Link></button>
      </nav>
      </div>
    </div>
  );
}


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/CarPicker" element={<CarPicker />} />
        <Route path="/DatePicker" element={<DatePicker />} />
        <Route path="/PlotPicker" element={<PlotPicker />} />
        <Route path="/forgotpassword" element={<ForgotPassword />}/>
        <Route path="/Dashboard" element={<Dashboard />}/>
      </Routes>
    </Router>
  );
}

export default App;
