'use client'
import { useState } from 'react';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Refill() {
  // State to keep track of all cylinder sizes entered by the user
  const [cylinders, setCylinders] = useState([{ size: '', amount: 0 }]);
  const ratePerLiter = 1.50; // Assuming $1.50 per liter

  // Function to handle the change of cylinder size
  const handleCylinderChange = (index:any, size:any) => {
    const newCylinders = [...cylinders];
    newCylinders[index].size = size;
    newCylinders[index].amount = size * ratePerLiter; // Calculate amount based on size
    setCylinders(newCylinders);
  };

  // Function to add another cylinder
  const addCylinder = () => {
    setCylinders([...cylinders, { size: '', amount: 0 }]);
  };

  // Function to remove a cylinder
  const removeCylinder = (index:any) => {
    const newCylinders = cylinders.filter((_, i) => i !== index);
    setCylinders(newCylinders);
  };

  // Calculate the total amount
  const totalAmount = cylinders.reduce((total, cylinder) => total + cylinder.amount, 0);

  return (
    <div className="w-screen h-screen relative">
      {/* Navbar */}
      <Navbar />

      Refill shii

      {/* Footer */}
      <Footer />
    </div>
  );
}
