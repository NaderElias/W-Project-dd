import React, { useState } from 'react';
import axios from 'axios';

const CustomizationForm = () => {
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [_id, setId] = useState(''); 

  // Create an axios instance with withCredentials set to true
  const axiosInstance = axios.create({
    withCredentials: true,
  });

  const handleCreateCustomization = async () => {
    try {
      const response = await axiosInstance.post('http://localhost:3000/api/branding/create-customization', {
        brand,
        color,
      });
      console.log(response.data);

      // Reset state after successful creation
      setBrand('');
      setColor('');
    } catch (error) {
      console.error('Error creating customization:', error.response.data.message);
    }
  };

  const handleUpdateCustomization = async () => {
    try {
      const response = await axiosInstance.put('http://localhost:3000/api/branding/update-customization', {
        _id, 
        color,
      });
      console.log(response.data);

      // Reset state after successful update
      setId('');
      setColor('');
    } catch (error) {
      console.error('Error updating customization:', error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Create/Update Customization</h2>
      <div>
        <label>Brand:</label>
        <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} />
      </div>
      <div>
        <label>Color:</label>
        <input type="text" value={color} onChange={(e) => setColor(e.target.value)} />
      </div>
      <button onClick={handleCreateCustomization}>Create Customization (with Brand and Color)</button>
      <div>
        <label>ID:</label>
        <input type="text" value={_id} onChange={(e) => setId(e.target.value)} />
      </div>
      <button onClick={handleUpdateCustomization}>Update Customization (with ID and Color)</button>
    </div>
  );
};

export default CustomizationForm;
