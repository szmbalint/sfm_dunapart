import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getToken } from '../auth/tokenManager';
import { fetchUserData, fetchCarsData } from '../../api/dataController';
import './CarPicker.css';

function CarPicker() {
  const [cars, setCars] = useState([]);
  const [options, setOptions] = useState({ sizes: [], colors: [], types: [] });
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newCar, setNewCar] = useState({
    name: '',
    licensePlate: '',
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

  const handleAddCar = () => {
    if (newCar.name && newCar.licensePlate && newCar.size && newCar.color && newCar.type) {
      setCars([...cars, newCar]);
      setNewCar({ name: '', licensePlate: '', size: '', color: '', type: '' });
      setShowModal(false);
    } else {
      alert('Kérlek, töltsd ki az összes mezőt!');
    }
  };

  const handleEditCar = () => {
    if (editCarIndex !== null && newCar.name && newCar.licensePlate && newCar.size && newCar.color && newCar.type) {
      const updatedCars = [...cars];
      updatedCars[editCarIndex] = newCar;
      setCars(updatedCars);
      setNewCar({ name: '', licensePlate: '', size: '', color: '', type: '' });
      setShowEditModal(false);
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
      console.log('Kijelölt autó:', cars[selectedCar]);
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
                    <span className='license'><strong>License</strong> • {car.licensePlate}</span>
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
          value={newCar.licensePlate}
          onChange={(e) => setNewCar({ ...newCar, licensePlate: e.target.value })}
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
