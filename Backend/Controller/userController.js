const User = require("../Models/userModel");

// Route to create a new user, accessible only to admins
userController = {
	createUser: async (req, res) => {
		try {
			// Extract user data from the request body
			const { username, password, role, profile } = req.body;

			// Create a new user
			const newUser = new User({
				username,
				password,
				role,
				profile,
			});

			// Save the user to the database
			await newUser.save();

			res
				.status(201)
				.json({ message: "User created successfully", user: newUser });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "server error" });
		}
	},
	// Route to assign a role to a user, accessible only to admins
	assignRole: async (req, res) => {
		try {
			const { userId, newRole } = req.body;
			// Find the user by user ID
			const user = await User.findById(userId);

			if (!user) {
				return res.status(404).json({ message: "User not found" });
			}

			// Update the user's role
			user.role = newRole;
			await user.save();

			res.status(200).json({ message: "Role assigned successfully", user });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "server error" });
		}
	},
	//Admin getting all users
	getAllUsers: async (req, res) => {
		try {
			//getting all users and outputting them
			const allUsers = await User.find();
			res.status(200).json({ users: allUsers });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "server error" });
		}
	},
	// Route to update user profile, accessible to all authenticated users
	updateProfile: async (req, res) => {
		try {
			// Extract user data from the request body
			const { firstName, lastName, email } = req.body;
			// const user = await User.findById(userId);
			// Update the user's profile
			req.user.profile.firstName = firstName;
			req.user.profile.lastName = lastName;
			req.user.profile.email = email;

			//user.profile.firstName = firstName;
			//user.profile.lastName = lastName;
			//user.profile.email = email;
			// Save the updated user to the database
			await req.user.save();
			//await user.save();
			res
				.status(200)
				.json({ message: "Profile updated successfully", user: req.user });
			//res.status(200).json({ message: 'Profile updated successfully', user: user });
		} catch (error) {
			console.error(error);
			res.status(500).json({ message: "server error" });
		}
	},
	// Route to get user profile, accessible to all authenticated users
	getProfile: async (req, res) => {
		//const user = await User.findById(userId);
		//   res.status(200).json({ users: user});
		res.status(200).json({ user: req.user });
	},
};

module.exports = userController;
