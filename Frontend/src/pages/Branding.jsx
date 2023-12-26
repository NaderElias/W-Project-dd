import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AppNavBar from "../components/navbar";
import "../styles/Brands.css";

const CustomizationForm = () => {
  const [brand, setBrand] = useState('');
  const [color, setColor] = useState('');
  const [_id, setId] = useState(''); 

  // Create an axios instance with withCredentials set to true
  const axiosInstance = axios.create({
    withCredentials: true,
  });
  const [colorTheme, setColorTheme] = useState('theme-blue');
  useEffect(() => {
    const currentThemeColor = localStorage.getItem('theme-color');
    if(currentThemeColor){
      setColorTheme(currentThemeColor);
    }
  }, []);
  const handleClick = (theme) => {
    setColorTheme(theme);
    localStorage.setItem('theme-color', theme)
  }

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
  const buttonColors = [
    ['#0D47A1', '#1E88E5'],
    ['#d6e5e3', '#9FD8CB'],
    ['#1e1e1e', '#4e4e4e'],  
  ];

  return (
    <div className={`test ${colorTheme}`}>
    <AppNavBar />
    <div class="page-background">
    <h2 class="txt">Create/Update Customization</h2>
    <div>
        <label class="txt">Brand:</label>
        <input type="text" value={brand} onChange={(e) => setBrand(e.target.value)} />
    </div>
    <div>
        <label class="txt">Color:</label>
        <input type="text" value={color} onChange={(e) => setColor(e.target.value)} />
    </div>
    <button onClick={handleCreateCustomization}>Create Customization (with Brand and Color)</button>
    <div>
        <label class="txt">ID:</label>
        <input type="text" value={_id} onChange={(e) => setId(e.target.value)} />
    </div>
    <button onClick={handleUpdateCustomization}>Update Customization (with ID and Color)</button>
    <div className="button-container">
  {buttonColors.map(([color1, color2], index) => {
    let buttonId = '';
    if (index === 0) buttonId = 'theme-blue';
    else if (index === 1) buttonId = 'theme-grey';
    else if (index === 2) buttonId = 'theme-black';

    return (
      <div
        key={index}
        id={buttonId} // Set the id attribute to the determined buttonId
        className="button"
        style={{ background: `linear-gradient(${color1}, ${color2})` }}
        onClick={() => handleClick(buttonId)}
      />
    );
  })}
</div>
</div>

    </div>
  );
};

export default CustomizationForm;
