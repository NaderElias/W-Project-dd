import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUserRole, setNewUserRole] = useState({
    email: '',
    role: '',
    password: '',
    profile: {
      firstName: '',
      lastName: '',
      username: '',
    },
  });

  // Separate state for assigning a new role
  const [assignRoleState, setAssignRoleState] = useState({
    email: '',
    role: '',
  });

  useEffect(() => {
    // Fetch all users from the backend when the component mounts
    axios.get('http://localhost:3000/api/users/get-all-users', { withCredentials: true })
      .then(response => {
        setUsers(response.data.users);
      })
      .catch(error => {
        console.error('Error fetching users:', error);
      });
  }, []); // Empty dependency array ensures that this effect runs once on mount

  const assignRole = (email) => {
    // Implement logic to assign role using the backend API
    axios.post('http://localhost:3000/api/users/assign-role', { email, newRole: assignRoleState.role }, { withCredentials: true })
      .then(response => {
        console.log('Role assigned successfully:', response.data);
        // Refresh the user list after role assignment
        axios.get('http://localhost:3000/api/users/get-all-users', { withCredentials: true })
          .then(response => {
            setUsers(response.data.users);
            // Clear the input field after role assignment
            setAssignRoleState({ email: '', role: '' });
          })
          .catch(error => {
            console.error('Error fetching users:', error);
          });
      })
      .catch(error => {
        console.error('Error assigning role:', error);
        // You may want to display an error message
      });
  };

  const createUser = () => {
    // Implement logic to create a new user using the backend API
    axios.post('http://localhost:3000/api/users/create', newUserRole, { withCredentials: true })
      .then(response => {
        console.log('User created successfully:', response.data);
        // Reset newUserRole state after user creation
        setNewUserRole({
          email: '',
          role: '',
          password: '',
          profile: {
            firstName: '',
            lastName: '',
            username: '',
          },
        });
        // Refresh the user list after user creation
        axios.get('http://localhost:3000/api/users/get-all-users', { withCredentials: true })
          .then(response => {
            setUsers(response.data.users);
          })
          .catch(error => {
            console.error('Error fetching users:', error);
          });
      })
      .catch(error => {
        console.error('Error creating user:', error);
        // You may want to display an error message
      });
  };

  return (
    <div>
      <h2>User Management</h2>

      <div>
        <h3>Create New User</h3>
        <input
          type="text"
          placeholder="Email"
          value={newUserRole.email}
          onChange={(e) => setNewUserRole({ ...newUserRole, email: e.target.value })}
        />
        <input
          type="text"
          placeholder="Role"
          value={newUserRole.role}
          onChange={(e) => setNewUserRole({ ...newUserRole, role: e.target.value })}
        />
         <input
          type="text"
          placeholder="Password"
          value={newUserRole.password}
          onChange={(e) => setNewUserRole({ ...newUserRole, password: e.target.value })}
        />
        <div>
          <label>First Name:</label>
          <input
            type="text"
            placeholder="First Name"
            value={newUserRole.profile.firstName}
            onChange={(e) => setNewUserRole({
              ...newUserRole,
              profile: { ...newUserRole.profile, firstName: e.target.value }
            })}
          />
        </div>
        <div>
          <label>Last Name:</label>
          <input
            type="text"
            placeholder="Last Name"
            value={newUserRole.profile.lastName}
            onChange={(e) => setNewUserRole({
              ...newUserRole,
              profile: { ...newUserRole.profile, lastName: e.target.value }
            })}
          />
        </div>
        <div>
          <label>Username:</label>
          <input
            type="text"
            placeholder="Username"
            value={newUserRole.profile.username}
            onChange={(e) => setNewUserRole({
              ...newUserRole,
              profile: { ...newUserRole.profile, username: e.target.value }
            })}
          />
        </div>
        <button onClick={createUser}>Create User</button>
      </div>

      <div>
      <ul>
    {users.map(user => (
      <li key={user._id}>
        <div>
          <strong>Email:</strong> {user.email}
        </div>
        <div>
          <strong>First Name:</strong> {user.profile.firstName || 'N/A'}
        </div>
        <div>
          <strong>Last Name:</strong> {user.profile.lastName || 'N/A'}
        </div>
        <div>
          <strong>Username:</strong> {user.profile.username || 'N/A'}
        </div>
        <div>
          <strong>Role:</strong> {user.role}
        </div>
        <input
          type="text"
          placeholder="Type new role"
          value={assignRoleState.role}
          onChange={(e) => setAssignRoleState({ ...assignRoleState, role: e.target.value })}
        />
        <button onClick={() => assignRole(user.email)}>Assign Role</button>
      </li>
    ))}
  </ul>
</div>

    </div>
  );
};

export default UserManagement;
