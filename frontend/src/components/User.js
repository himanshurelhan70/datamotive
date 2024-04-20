import React from 'react'
import axios from 'axios'
import { BACKEND_URL } from '../utils/constants';
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

function User({ user }) {

    const updateUserRole = (userId) => {
        console.log(userId);
        const selectedRole = document.querySelector("#selectedRole").value;
        console.log(selectedRole);

        const config = {
            method: "PUT",
            url: `${BACKEND_URL}/updateUserRole/${userId}`,
            withCredentials: true,
            data: {
                role: selectedRole
            }
        }
        axios(config)
            .then((response) => {
                const data = response.data;
                console.log("user role updated", data);
                // fetchData();
                toast.success("User Role Updated");
            })
            .catch((error) => {
                console.log("error in updating user role");
                console.log(error.message);
                toast.error("Error while updating User's role");
            })
    }


    return (
        <tr>
            <td className="border-2 px-2 py-1">{user.name}</td>
            <td className="border-2 px-2 py-1">{user.email}</td>
            <td className="border-2 px-2 py-1">{user.role}</td>
            <td className="border-2 px-2 py-1 flex gap-2">
                <select name="selectedRole" id="selectedRole">
                    <option value="" disabled defaultValue={true}>--Select--</option>
                    <option value="Manager" disabled={user.role === "Manager"}>Manager</option>
                    <option value="Visitor" disabled={user.role === "Visitor"}>Visitor</option>
                    <option value="Admin" disabled={user.role === "Admin"}>Admin</option>
                </select>

                <button className='bg-blue-700 p-2 text-white hover:bg-blue-900' onClick={() => updateUserRole(user._id)}>
                    Update
                </button>
            </td>
        </tr>
    )
}

export default User