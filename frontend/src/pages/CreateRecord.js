import React, { useState } from 'react'
import axios from 'axios';
import Loader from '../components/Loader';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BACKEND_URL } from '../utils/constants';

function CreateRecord() {

    const [isLoading, setIsLoading] = useState(false);

    const initialState = {
        name: "",
        email: "",
        phone: "",
        file: null,
    }

    const [formData, setFormData] = useState(initialState);

    // const navigate = useNavigate();

    // ////// input handler
    const inputHandler = (event) => {
        const { name, value } = event.target;
        // console.log("files", files);

        console.log(name, value);

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }

    const fileHandler = (event) => {
        setFormData((prevData) => ({
            ...prevData,
            file: event.target.files[0],
        }));
    }

    // submit handler
    const submitHandler = (event) => {
        // loader
        setIsLoading(true);

        event.preventDefault();
        console.log(formData);

        axios({
            method: 'post',
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            url: `${BACKEND_URL}/createZohoLead`,
            data: formData
        })
            .then((response) => {
                console.log('response :', response.data);
                toast.success("Lead created Successfully");
                setFormData(initialState);
                // loader
                setIsLoading(false);
            })
            .catch((error) => {
                if (error?.response?.status === 409) {
                    console.log('you are already registered with us');
                    toast.info("Lead already exists");
                    return;
                }

                toast.error("Something went wrong");

                console.log('error', error);
            })
    }

    return (
        <div className='flex flex-col py-5'>
            <h1 className='text-3xl font-bold text-center my-4'>Create Lead</h1>
            {
                isLoading ? (<Loader />) : (<div className='w-[400px] flex flex-col justify-center mx-auto'>
                    {/* <h2 className='text-center text-xl my-4'>Fill this form to connect with us</h2> */}
                    <form onSubmit={submitHandler}>
                        <label htmlFor="" className='mb-2'>Company Name</label>
                        <input
                            type="text"
                            name="name"
                            className='w-full block border-2 border-slate-400 rounded-md mb-2'
                            onChange={inputHandler}
                            value={formData.name}
                            required={true}
                        />

                        <label htmlFor="" >Email</label>
                        <input
                            type="email"
                            name="email"
                            className=' w-full block border-2 border-slate-400 rounded-md mb-2'
                            onChange={inputHandler}
                            value={formData.email}
                            required={true}
                        />

                        <label htmlFor="" >Phone</label>
                        <input
                            type="tel"
                            name="phone"
                            className=' w-full block border-2 border-slate-400 rounded-md mb-2'
                            onChange={inputHandler}
                            value={formData.phone}
                            required={true}
                        />


                        <label htmlFor="" >File</label>
                        <input
                            type="file"
                            name="file"
                            className=' w-full block border-2 border-slate-400 rounded-md mb-2'
                            onChange={fileHandler}
                            required={true}
                        />

                        <input type="submit" className='w-full bg-slate-500 text-white py-1 rounded-md' />
                    </form>
                </div>)

            }

        </div>
    )
}

export default CreateRecord