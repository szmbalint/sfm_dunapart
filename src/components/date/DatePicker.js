import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePicker.css';
import { useNavigate } from 'react-router-dom';  // Importáljuk a useNavigate hook-ot

function DatePickerPage() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const navigate = useNavigate(); // useNavigate hook használata

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
    const data = {
      startDate: startDate ? startDate.toISOString().split('T')[0] : null, // ISO formátum, csak a dátum
      endDate: endDate ? endDate.toISOString().split('T')[0] : null,
      startTime,
      endTime,
    };
  
    try {
      const response = await fetch('http://your-backend-endpoint.com/api/save-dates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log('Server response:', result);
  
      // Opcionális: Navigáció vagy értesítés sikeres beküldés után
      alert('Data submitted successfully!');
      navigate('/plotpicker'); // Példa: sikeres beküldés után navigáció egy másik oldalra
    } catch (error) {
      console.error('Error submitting data:', error);
      alert('Failed to submit data. Please try again.');
    }
  };  

  return (
    <div className="grid-container">
      <div className="left-panel-orange">
        <button onClick={handleSubmit}>Submit Data</button>
        <button className="back-button" onClick={() => navigate('/')}>
          Back to Home
        </button>
      </div>

      <div className="right-panel">
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
      </div>
    </div>
  );
}

export default DatePickerPage;
