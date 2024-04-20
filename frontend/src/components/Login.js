import React, {useState, useContext} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BACKEND_URL } from '../utils/constants';
import { UserContext } from '../context/UserContext'

function Login() {
    const {loginUser} = useContext(UserContext);

    const initialState = {
        email: "",
        password: ""
      }

    const [loginData, setLoginData] = useState(initialState);


    const navigate = useNavigate();

    const inputHandler = (event) => {
        const { name, value } = event.target;
        setLoginData({
            ...loginData,
            [name]: value
        })
    }

    const submitHandler = (event) => {
        event.preventDefault();

        const config = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            withCredentials: true,
            data: loginData,
            url: `${BACKEND_URL}/login`
        };

        axios(config)
            .then((response) => {
                toast.success("Successfully Logged In");

                const userData = response?.data?.user;
                const {role} = userData;

                loginUser(userData);
                
                if (role === 'Manager') {
                    navigate("/createRecord");
                }
                else if (role === 'Admin') {
                    navigate("/users");
                }
                else if (role === 'Visitor') {
                    // navigate("/createRecord");
                    navigate("/");
                }
                
            })
            .catch((error) => {
                // console.log("error while login");
                // console.log(error);
                toast.error(error?.response?.data?.message || "Something went wrong");
            });
    }

    return (
        <div className='w-[400px] flex flex-col justify-center mx-auto'>
            <h1 className='text-center text-2xl my-4'>Login form</h1>
            <form onSubmit={submitHandler}>
                <label htmlFor="email" >Email</label>
                <input
                    type="email"
                    name="email"
                    id='email'
                    className=' w-full block border-2 border-slate-400 rounded-md mb-2 py-1 px-2'
                    onChange={inputHandler}
                    value={loginData.email} />

                <label htmlFor="password" >Password</label>
                <input
                    type="password"
                    name="password"
                    id='password'
                    className=' w-full block border-2 border-slate-400 rounded-md mb-2 py-1 px-2'
                    onChange={inputHandler}
                    value={loginData.password} />

                <input type="submit" className='w-full bg-slate-500 text-white rounded-md p-2 hover:bg-slate-600 cursor-pointer' />
            </form>
        </div>
    )
}

export default Login