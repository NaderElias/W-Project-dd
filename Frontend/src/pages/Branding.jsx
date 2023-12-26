import React, { useState, useEffect } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import axios from "axios";
import AppNavBar from "../components/navbar";
import "../styles/Brands.css";
let backend_url = "http://localhost:3000/api";

const CustomizationForm = () => {
	const [color, setColor] = useState("");
	const [_id, setId] = useState("");
	const [showModal, setShowModal] = useState(false);
	const [brand, setBrand] = useState({
    name: '',
    colorTheme: 'theme-blue',
    color1: '#000000',
    color2: '#FFFFFF',
  });
  const [brandList, setBrandList] = useState([]);
  const [colorTheme, setColorTheme] = useState('theme-blue');

	useEffect(() => {
		const getBrands = async () => {
      const response = await axios.get(`${backend_url}/branding/get-customization`, {withCredentials: true});
      setBrandList(response.data.brands)
    }
    setColorTheme(localStorage.getItem("theme-color"));
    getBrands();
	}, []);
	const handleClick = (theme) => {
    setColorTheme(theme);
		localStorage.setItem("theme-color", theme);
	};

	const handleModalShow = () => {
		setShowModal(true);
	};
	const handleModalClose = () => {
		setShowModal(false);
	};

	const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBrand((prevBrand) => ({
      ...prevBrand,
      [name]: value,
    }));
  };

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`${backend_url}/branding/create-customization`,
				brand,
				{ withCredentials: true }
			);
			handleModalClose(); // Close the modal after submission
      const res = await axios.get(`${backend_url}/branding/get-customization`, {withCredentials: true});
      setBrandList(res.data.brands)
		} catch (error) {
			console.error("Error creating brand:", error);
		}
	};

	const handleUpdateCustomization = async () => {
		try {
			const response = await axiosInstance.put(
				"http://localhost:3000/api/branding/update-customization",
				{
					_id,
					color,
				}
			);
			console.log(response.data);

			// Reset state after successful update
			setId("");
			setColor("");
		} catch (error) {
			console.error(
				"Error updating customization:",
				error.response.data.message
			);
		}
	};

	return (
		<div className={`test ${colorTheme}`}>
			<AppNavBar />
			<div class="page-background">
				{localStorage.getItem("role") === "admin"? <button onClick={handleModalShow}>Create Brand</button>:<></>}
				<div className="button-container">
					{brandList && brandList.map((brand, index) => {
						return (
							<div
								key={index}
								id={brand.colorTheme} // Set the id attribute to the determined buttonId
								className="button"
								style={{ background: `linear-gradient(${brand.buttonColors.color1}, ${brand.buttonColors.color2})` }}
								onClick={() => handleClick(brand.colorTheme)}
							/>
						);
					})}
				</div>
			</div>
			<Modal show={showModal} onHide={handleModalClose}>
				<Modal.Header closeButton>
					<Modal.Title>Create Brand</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={handleSubmit}>
						<Form.Group controlId="brandName">
							<Form.Label>Brand Name:</Form.Label>
							<Form.Control
								type="text"
								name="name"
								value={brand.name}
								onChange={handleInputChange}
								required
							/>
						</Form.Group>
						<Form.Group controlId="colorTheme">
							<Form.Label>Color Theme:</Form.Label>
							<Form.Control
								as="select"
								name="colorTheme"
								value={brand.colorTheme}
								onChange={handleInputChange}
							>
								<option value="theme-blue">Blue</option>
								<option value="theme-black">Black</option>
								<option value="theme-grey">Grey</option>
							</Form.Control>
						</Form.Group>
            <Form.Group controlId="primaryColor">
              <Form.Label>Primary Color:</Form.Label>
              <Form.Control
                type="color"
                name="color1"
                value={brand.color1}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="secondaryColor">
              <Form.Label>Secondary Color:</Form.Label>
              <Form.Control
                type="color"
                name="color2"
                value={brand.color2}
                onChange={handleInputChange}
              />
            </Form.Group>
						<Button variant="primary" type="submit">
							Create Brand
						</Button>
					</Form>
				</Modal.Body>
			</Modal>
		</div>
	);
};

export default CustomizationForm;
