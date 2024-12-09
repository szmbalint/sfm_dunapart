import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css';
import { getToken, saveEndDate, saveStartDate } from '../auth/tokenManager';
import FloatingMenu from '../../utils/FloatingMenu';

function DatePickerPage() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [theme] = useState(localStorage.getItem('theme')); // Alapértelmezett téma

  // Jelenlegi dátum beállítása
  const currentDate = new Date();

  useEffect(() => {
    const htmlElement = document.documentElement; // A html tag referencia
    if (theme === 'dark') {
      htmlElement.classList.add('dark');
    } else {
      htmlElement.classList.remove('dark');
    }
  }, [theme]);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const handleStartTimeChange = (e) => {
    setStartTime(e.target.value);
  };

  const handleEndTimeChange = (e) => {
    setEndTime(e.target.value);
  };

  const handleSubmit = async () => {
    // Ellenőrizzük, hogy az időpontok érvényesek-e
    if(getToken() === 'null'){
      alert('Előbb be kéne jelentkezni..');
    }
    else if (startDate && endDate && startTime && endTime) {
      const startDateTime = `${startDate.toLocaleDateString('en-CA')} ${startTime}`;
      const endDateTime = `${endDate.toLocaleDateString('en-CA')} ${endTime}`;

      // Mentés a localStorage-ba
      saveStartDate(startDateTime);
      saveEndDate(endDateTime);

      // Navigáció a következő oldalra
      window.location.href = '/plotPicker'; // Példa navigációra
      // Visszajelzés a felhasználónak
      alert('Az időpontok mentve lettek!');
    } else {
      alert('Kérlek, adj meg minden szükséges időpontot!');
    }
  };

  return (
    <div className="grid-container">
      <div className="left-panel orange"></div>
      <FloatingMenu />
      <div className="right-panel grey">
        <h1>Book parking details</h1>
        <h2>Select date</h2>
        <div className="calendar-container">
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline
            dateFormat="yyyy/MM/dd"
            minDate={currentDate}
          />
        </div>

        {startDate && endDate && (
          <div className="time-selection">
            <label>
              Start Time:
              <input
                type="time"
                value={startTime}
                onChange={handleStartTimeChange}
              />
            </label>

            <label>
              End Time:
              <input
                type="time"
                value={endTime}
                onChange={handleEndTimeChange}
              />
            </label>
          </div>
        )}
        <button onClick={handleSubmit}>Submit Data</button>
      </div>
    </div>
  );
}

export default DatePickerPage;
