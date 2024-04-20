import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BACKEND_URL } from '../utils/constants';

function Signup() {

    const [signupData, setSignupData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    // ////// input handler
    const inputHandler = (event) => {
        const { name, value } = event.target;
        // console.log(name, value);
        setSignupData({
            ...signupData,
            [name]: value
        });
    }

    // submit handler
    const submitHandler = (event) => {
        event.preventDefault();
        console.log(signupData);

        axios({
            method: 'post',
            url: `${BACKEND_URL}/signup`,
            data: signupData
        })
            .then((response) => {
                console.log('response :', response);
                toast.success(response?.data?.message);
                navigate("/login");
            })
            .catch((error) => {
                console.log('error', error);
                toast.error(error?.response?.data?.message || "Something went wrong");
            })
    }

    return (
        <div className='w-[400px] flex flex-col justify-center mx-auto'>
            <h1 className='text-center text-2xl my-4'>SignUp form</h1>
            <form onSubmit={submitHandler}>
                <label htmlFor="name" className='mb-2'>Name</label>
                <input
                    type="text"
                    name="name"
                    id='name'
                    className='w-full block border-2 border-slate-400 rounded-md mb-2 py-1 px-2'
                    onChange={inputHandler}
                    value={signupData.name}
                    required={true}
                />

                <label htmlFor="email" >Email</label>
                <input
                    type="email"
                    name="email"
                    id='email'
                    className=' w-full block border-2 border-slate-400 rounded-md mb-2 py-1 px-2'
                    onChange={inputHandler}
                    value={signupData.email}
                    required={true}
                     />

                <label htmlFor="password" >Password</label>
                <input
                    type="password"
                    name="password"
                    id='password'
                    className=' w-full block border-2 border-slate-400 rounded-md mb-2 py-1 px-2'
                    onChange={inputHandler}
                    value={signupData.password}
                    required={true}
                />

                <input type="submit" className='w-full bg-slate-500 text-white rounded-md cursor-pointer p-2 hover:bg-slate-600' />
            </form>
        </div>
    )
}

export default Signup