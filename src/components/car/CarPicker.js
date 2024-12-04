import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getToken, saveSelectedCar } from '../auth/tokenManager';
import { fetchUserData, fetchCarsData, addCar, editCar } from '../../api/dataController';
import './CarPicker.css';

function CarPicker() {
  const [cars, setCars] = useState([]);
  const [options, setOptions] = useState({ sizes: [], colors: [], types: [] });
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userEmail, setUserEmail] = useState(null); // Add this state
  const [newCar, setNewCar] = useState({
    name: '',
    rendszam: '',
    size: '',
    color: '',
    type: ''
  });
  const [editCarIndex, setEditCarIndex] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null); // Kijelölt autó

  useEffect(() => {
    const token = getToken(); // Token lekérése

    if (token) {
      // Első fetch: felhasználói adatok lekérése
      fetchUserData(token)
        .then((userData) => {
          const userEmail = userData.email; // Email kinyerése a felhasználói adatokból
          setUserEmail(userEmail); // Store userEmail in state
          // Második fetch: autók lekérése az email használatával
          return fetchCarsData(userEmail);
        })
        .then((carData) => {
          setCars(carData); // Autók adatainak mentése
        })
        .catch((error) => {
          console.error('Hiba a felhasználói adatok vagy autók betöltésekor:', error);
        });
    } else {
      console.error('Nincs token!');
    }
  }, []);
  

  useEffect(() => {
    fetch('/data/options.json')
      .then(response => response.json())
      .then(data => setOptions(data))
      .catch(error => console.error('Hiba az opciók betöltésekor:', error));
  }, []);

  const sizeMapping = {
    Small: 1,
    Medium: 2,
    Large: 3,
  };

  const handleAddCar = async () => {
    if (newCar.name && newCar.rendszam && newCar.size && newCar.color && newCar.type) {
      try {
        // Az addCar metódus meghívása
        const response = await addCar({
          email: userEmail, // Feltételezve, hogy a userEmail elérhető a komponensben
          meret: sizeMapping[newCar.size] || 0, // Leképezzük a méretet számra, alapértelmezett: 0
          rendszam: newCar.rendszam,
          color: newCar.color,
          name: newCar.name,
          type: newCar.type,
        });
        console.log(newCar.size);
        // Ha sikeres, frissítsük az autók listáját
        setCars([...cars, newCar]);
        setNewCar({ name: '', rendszam: '', size: '', color: '', type: '' });
        setShowModal(false);
        alert('Az autó sikeresen hozzáadásra került!');
      } catch (error) {
        // Hiba esetén figyelmeztetés
        alert(`Hiba történt: ${error.message}`);
      }
    } else {
      alert('Kérlek, töltsd ki az összes mezőt!');
    }
  };

  const handleEditCar = async () => {
    console.log("car-id: " + cars[editCarIndex].auto_id);
    if (
      editCarIndex !== null &&
      newCar.name &&
      newCar.rendszam &&
      newCar.size &&
      newCar.color &&
      newCar.type
    ) {
      try {
        const carData = {
          email: userEmail, // Felhasználói email
          auto_id: cars[editCarIndex].auto_id, // Az autó ID-ja az index alapján
          rendszam: newCar.rendszam,
          color: newCar.color,
          name: newCar.name,
          type: newCar.type,
        };
  
        // Hívja meg az editCar metódust a frissített adatokkal
        const response = await editCar(carData);
  
        console.log('Autó sikeresen módosítva:', response);
  
        // Frissítse a helyi állapotot a sikeres válasz után
        const updatedCars = [...cars];
        updatedCars[editCarIndex] = { ...updatedCars[editCarIndex], ...newCar };
        setCars(updatedCars);
  
        // Törölje a mezők tartalmát és zárja be a modált
        setNewCar({ name: '', rendszam: '', size: '', color: '', type: '' });
        setShowEditModal(false);
      } catch (error) {
        alert(`Hiba történt az autó frissítése során: ${error.message}`);
        console.error(error);
      }
    } else {
      alert('Kérlek, töltsd ki az összes mezőt!');
    }
  };
  
  
  

  const handleDeleteCar = (index) => {
    const updatedCars = cars.filter((_, i) => i !== index);
    setCars(updatedCars);
    if (index === selectedCar) setSelectedCar(null); // Ha törölt autó kijelölt, töröljük a kijelölést
  };

  const openEditModal = (index) => {
    setEditCarIndex(index);
    setNewCar(cars[index]);
    setShowEditModal(true);
  };

  const handleSelectCar = (index) => {
    setSelectedCar(index === selectedCar ? null : index); // Toggling selection
  };

  const handleContinue = () => {
    if (selectedCar !== null) {
      // Elmentjük a kiválasztott autó ID-ját a localStorage-ba
      saveSelectedCar(cars[selectedCar].auto_id); // Assuming cars[selectedCar] contains the car object and auto_id is the identifier
      window.location.href = '/datePicker'; // Példa navigációra
    } else {
      alert('Kérlek, válassz egy autót!');
    }
  };

  return (
    <div className="grid-container">
      <div className="left-panel-grey">
        <button>
          <Link to="/">Vissza a főoldalra</Link>
        </button>
      </div>

      <div className="right-panel">
        <h1>Select your car</h1>
        {cars.length > 0 ? (
          <ul>
            {cars.map((car, index) => (
              <li
                key={index}
                className={`car-container ${
                  selectedCar === index ? 'selected' : ''
                }`}
                onClick={() => handleSelectCar(index)}
              >
                <img src={`/cars/${car.type.toLowerCase()}.png`} alt={car.type} />
                <div className="car-details">
                  <h2>{car.name}</h2>
                  <div className="license-type">
                    <span className='license'><strong>License</strong> • {car.rendszam}</span>
                    <span className={`type ${car.color.toLowerCase()}`}><strong>Type</strong> • {car.type}</span>
                  </div>
                </div>
                <div className="btns">
                  <button className="edit-btn" onClick={() => openEditModal(index)}>
                    <img src="/icons/edit.png" alt="edit" />
                  </button>
                  <button className="delete-btn" onClick={() => handleDeleteCar(index)}>
                    <img src="/icons/delete.png" alt="delete" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Nem találhatóak autók az adott felhasználóhoz.</p>
        )}
        <button onClick={() => setShowModal(true)}>Add new car</button>
        <button onClick={handleContinue}>Continue</button>
      </div>

      {/* Add Car Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add new car</h2>
            <div className='modal-carpicker'>
            <CarForm newCar={newCar} setNewCar={setNewCar} options={options} />
            </div>
            <div className="modal-actions">
              <button onClick={handleAddCar}>Hozzáadás</button>
              <button onClick={() => setShowModal(false)}>Mégse</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Car Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Change car information</h2>
            <div className='modal-carpicker'>
              <CarForm newCar={newCar} setNewCar={setNewCar} options={options} />
            </div>
            <div className="modal-actions">
              <button onClick={handleEditCar}>Save</button>
              <button onClick={() => setShowEditModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CarForm({ newCar, setNewCar, options }) {
  return (
    <>
      <label>
        Car name
        <input
          type="text"
          value={newCar.name}
          onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
        />
      </label>
      <label>
        License-number
        <input
          type="text"
          value={newCar.rendszam}
          onChange={(e) => setNewCar({ ...newCar, rendszam: e.target.value })}
        />
      </label>
      <label>
        Car size
        <select
          value={newCar.size}
          onChange={(e) => setNewCar({ ...newCar, size: e.target.value })}
        >
          <option value="">Válassz méretet</option>
          {options.sizes.map((size, index) => (
            <option key={index} value={size}>{size}</option>
          ))}
        </select>
      </label>
      <label>
        Car color
        <select
          value={newCar.color}
          onChange={(e) => setNewCar({ ...newCar, color: e.target.value })}
        >
          <option value="">Válassz színt</option>
          {options.colors.map((color, index) => (
            <option key={index} value={color}>{color}</option>
          ))}
        </select>
      </label>
      <label>
        Car type
        <select
          value={newCar.type}
          onChange={(e) => setNewCar({ ...newCar, type: e.target.value })}
        >
          <option value="">Válassz típust</option>
          {options.types.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </select>
      </label>
    </>
  );
}

export default CarPicker;
