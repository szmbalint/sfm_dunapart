import React, { useEffect, useState } from 'react';
import { deleteCarSize, deleteEndDate, deleteSelectedCar, deleteStartDate, getToken, saveCarName, saveCarSize, saveSelectedCar } from '../auth/tokenManager';
import { fetchUserData, fetchCarsData, addCar, editCar, deleteCar } from '../../api/dataController';
import './CarPicker.css';
import FloatingMenu from '../../utils/FloatingMenu';
import { validateLicensePlate } from '../../utils/ValidateLicensePlate';

function CarPicker() {
  const [cars, setCars] = useState([]);
  const [options, setOptions] = useState({ sizes: [], colors: [], types: [] });
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userEmail, setUserEmail] = useState(null); // Add this state
  const [theme] = useState(localStorage.getItem('theme')); // Alapértelmezett téma
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
    const htmlElement = document.documentElement; // A html tag referencia
    if (theme === 'dark') {
        htmlElement.classList.add('dark');
    } else {
        htmlElement.classList.remove('dark');
    }
}, [theme]);

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
        // Rendszám validáció
        
        const validatedPlate = validateLicensePlate(newCar.rendszam);
        // A validált rendszám beállítása
        setNewCar((prev) => ({ ...prev, rendszam: validatedPlate }));
        
        // Új autó hozzáadása az adatbázishoz
        await addCar({
          email: userEmail,
          meret: sizeMapping[newCar.size] || 0,
          rendszam: validatedPlate,
          color: newCar.color,
          name: newCar.name,
          type: newCar.type,
        });
  
        // Autók újra lekérése az adatbázisból
        const updatedCars = await fetchCarsData(userEmail);
        setCars(updatedCars);
  
        // Mezők alaphelyzetbe állítása és modal bezárása
        setNewCar({ name: '', rendszam: '', size: '', color: '', type: '' });
        setShowModal(false);
        alert('Az autó sikeresen hozzáadásra került!');
      } catch (error) {
        // Hiba esetén
        alert(`Hiba történt: ${error.message}`);
        console.error(error);
      }
    } else {
      alert('Kérlek, töltsd ki az összes mezőt!');
    }
  };
  
  const handleEditCar = async () => {
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
  
  const handleDeleteCar = async (index) => {
    try {
      const carToDelete = cars[index]; // Az autó, amit törölni szeretnénk
      const carData = {
        email: userEmail, // Itt adhatod meg a felhasználói email-t
        auto_id: carToDelete.auto_id, // Az autó ID-ja, amit törölni akarunk
      };
      const result = await deleteCar(carData); // A deleteCar metódus meghívása
      console.log(result); // A válasz kiírása (például: "Autó törlés sikeres")
  
      // Ha a törlés sikeres, eltávolítjuk az autót a listából
      const updatedCars = cars.filter((_, i) => i !== index);
      setCars(updatedCars);
  
      // Ha a törölt autó volt kijelölve, töröljük a kijelölést
      if (index === selectedCar) {
        setSelectedCar(null);
      }
    } catch (error) {
      console.error('Hiba történt a törlés során:', error.message);
      alert('Hiba történt a törlés során: ' + error.message); // Hibaüzenet megjelenítése
    }
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
      const selectedCarSize = cars[selectedCar].meret; // Kiválasztott autó méretének lekérése
      
      deleteSelectedCar();
      deleteCarSize();
      deleteStartDate();
      deleteEndDate();
      // Elmentjük a kiválasztott autó méretét 1-2-3 formátumban
      saveCarSize(selectedCarSize); // Itt hívjuk meg a saveCarSize-t
      saveCarName(cars[selectedCar].name);
      // Elmentjük a kiválasztott autót a localStorage-ba
      saveSelectedCar(cars[selectedCar].auto_id);
      
       window.location.href = '/datePicker'; 
    } else {
      alert('Kérlek, válassz egy autót!');
    }
  };
  
  return (
    <div className="grid-container">
      <div className="left-panel green">
      </div>
      <FloatingMenu />
      <div className="right-panel grey">
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
          <p>No cars found for the given user.</p>
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
              <button onClick={handleAddCar}>Add car</button>
              <button onClick={() => setShowModal(false)}>Cancel</button>
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
          type="text" placeholder='Enter car name'
          value={newCar.name}
          onChange={(e) => setNewCar({ ...newCar, name: e.target.value })}
        />
      </label>
      <label>
        License-number
        <input
          type="text" placeholder='Enter license number'
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
          <option value="">Choose size</option>
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
          <option value="">Choose color</option>
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
          <option value="">Choose type</option>
          {options.types.map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </select>
      </label>
    </>
  );
}

export default CarPicker;
