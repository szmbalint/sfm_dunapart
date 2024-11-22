import React from 'react';
import { Link } from 'react-router-dom';  // Importáljuk a Link komponenst a vissza gomb miatt.

function Login() {
  return (
    <div className="grid-container">                            {/* Konténer */}
      
      <div className="left-panel-grey">                        {/* Bal panel (zöld) */}
        <button><Link to="/">Vissza a főoldalra</Link></button> {/* Vissza gomb */}
      </div>

      <div className="right-panel">                             {/* Jobb panel */}
        <h1>Bejelentkező oldal!</h1>
        <p>Itt lesz implementálva a bejelentkezés a későbbiekben.</p>
      </div>
    </div>
  );
}

export default Login;
