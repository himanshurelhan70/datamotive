import React, {useContext} from 'react'
import axios from 'axios'
import {useNavigate} from "react-router-dom"
import { BACKEND_URL } from '../utils/constants';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { UserContext } from '../context/UserContext'

function LogoutPage() {

    const {logoutUser} = useContext(UserContext);

    const navigate = useNavigate();

    const config = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        withCredentials: true,
        url: `${BACKEND_URL}/logout`
    };


    axios(config)
        .then((response) => {
            console.log("logout successful");
            const data = response.data;
            console.log(data);
            logoutUser();
            navigate("/login");
            toast.success("Logout Successful");

        })
        .catch((error) => {
            console.log("error while logging out");
            console.log(error);
            toast.error("Something went wrong");
        });

  return (
    <h1>Logout Page</h1>
  )
}

export default LogoutPage