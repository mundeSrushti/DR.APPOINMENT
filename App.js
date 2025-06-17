import React, { useState, useEffect } from "react";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    speciality: "",
    doctor: ""
  });

  const [bookedSlots, setBookedSlots] = useState([]);

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "02:00 PM", "02:30 PM",
    "03:00 PM", "03:30 PM"
  ];

  // Fetch booked slots for selected date
  useEffect(() => {
    if (!formData.date) {
      setBookedSlots([]);
      return;
    }

    setFormData(prev => ({ ...prev, time: "" }));

    fetch(`http://localhost:4000/api/slots?date=${formData.date}`)
      .then(res => res.json())
      .then(data => {
        const times = data.map(slot => slot.time);
        setBookedSlots(times);
      })
      .catch(err => {
        console.error("Error fetching slots:", err);
        setBookedSlots([]);
      });
  }, [formData.date]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const { name, time, date, phone, email } = formData;

    if (!name || !time || !date) {
      toast.warn("Please fill in all required fields and select a date/time.");
      return;
    }

    // Phone number validation: must be 10 digits
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      toast.error("Phone number must be exactly 10 digits.");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    fetch("http://localhost:4000/api/appointment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(() => {
        toast.success("Appointment successfully booked!");
        setFormData({
          name: "",
          age: "",
          email: "",
          phone: "",
          date: "",
          time: "",
          speciality: "",
          doctor: ""
        });
        setBookedSlots([]); // Refresh booked slots
      })
      .catch(err => {
        console.error("Error booking appointment:", err);
        toast.error("Failed to book appointment.");
      });
  };

  return (
    <div className="container">
      <h1>Online Appointment Booking System</h1>

      <div className="date-header">
        <h2>Book Your Appointment Here!</h2>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="date-input"
        />
      </div>

      <div className="form-grid">
        <input name="name" value={formData.name} onChange={handleChange} placeholder="Patient Name" />
        <input name="age" value={formData.age} onChange={handleChange} placeholder="Patient Age" />
        <input name="email" value={formData.email} onChange={handleChange} placeholder="Email ID" />
        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Mobile No" />
        <select name="speciality" value={formData.speciality} onChange={handleChange}>
          <option value="">Select Specialty</option>
          <option value="Dentist">Dentist</option>
          <option value="Cardiologist">Cardiologist</option>
          <option value="Neurologist">Neurologist</option>
        </select>
        <select name="doctor" value={formData.doctor} onChange={handleChange}>
          <option value="">Select Doctor</option>
          <option value="Dr. Smith">Dr. Smith</option>
          <option value="Dr. John">Dr. John</option>
        </select>
      </div>

      {/* Time slot selection */}
      {formData.date && (
        <>
          <h3>Available Time Slots for {formData.date}</h3>
          <div className="slot-container">
            {timeSlots.map((slot, index) => {
              const isBooked = bookedSlots.includes(slot);
              const isSelected = formData.time === slot;
              return (
                <button
                  key={index}
                  className={`slot-btn ${isBooked ? "booked" : ""} ${isSelected ? "selected" : ""}`}
                  onClick={() => !isBooked && setFormData(prev => ({ ...prev, time: slot }))}
                  disabled={isBooked}
                >
                  {slot} {isBooked ? "- Booked" : ""}
                </button>
              );
            })}
          </div>
        </>
      )}

      <button className="book-btn" onClick={handleSubmit}>Book Appointment</button>
      

      <ToastContainer position="top-right" autoClose={3000} />

      <footer className="footer">
        <div><strong>Our Address:</strong><br /> Katraj Colony, Near New Bus Stand, Pune</div>
        <div><strong>Phone No:</strong><br />1800-7854-9635</div>
        <div><strong>Email:</strong><br />bookonlineappointment@gmail.com</div>
      </footer>
    </div>
  );
}

export default App;
