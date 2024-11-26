import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import CarPicker from "./components/car/CarPicker";
import DatePicker from "./components/date/DatePicker";
import PlotPicker from "./components/plot/PlotPicker";
import ForgotPassword from './components/auth/ForgotPassword';

function Home() {
  return (
    <div className="grid-container">
      <div className="left-panel-grey">
      </div>

      <div className="right-panel">
      <h1>Üdvözlünk a főoldalon!</h1>
      <nav>
        <button><Link to="/Login">Login</Link></button>
        <button><Link to="/Register">Register</Link></button>
        <button><Link to="/CarPicker">Car Picker</Link></button>
        <button><Link to="/DatePicker">Date Picker</Link></button>
        <button><Link to="/PlotPicker">Plot Picker</Link></button>
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
        <Route path="/forgot-password" element={<ForgotPassword />}/>
      </Routes>
    </Router>
  );
}

export default App;
