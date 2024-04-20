import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Navbar = () => {
    const { user } = useContext(UserContext);

    const { name: userName, email: userEmail, role: userRole } = user || {};

    console.log(userName, userEmail, userRole);

    return (
            <header className="w-full bg-slate-500">
                <div className="container w-full max-w-[1200px] mx-auto flex justify-between items-center bg-transparent">

                    <div>
                        <NavLink to="/" className="text-xl text-white block p-4 cursor-pointer">Logo</NavLink>
                    </div>

                    <nav>
                        <ul className="flex justify-between items-center">
                            {user && <p className="text-lg text-white block p-4">Hi {userName}</p>}

                            {!user && <li>
                                <NavLink to="/signup" className="text-lg text-white block p-4 cursor-pointer">SignUp</NavLink>
                            </li>}

                            {
                                !user && <li>
                                    <NavLink to="/login" className="text-lg text-white block p-4 cursor-pointer">Login</NavLink>
                                </li>
                            }

                            {
                                userRole === "Manager" && <li>
                                    <NavLink to="/createRecord" className="text-lg text-white block p-4 cursor-pointer">New Lead</NavLink>
                                </li>
                            }

                            {
                                userRole === "Manager" && <li>
                                    <NavLink to="/leads" className="text-lg text-white block p-4 cursor-pointer">Leads</NavLink>
                                </li>
                            }

                            {
                                userRole === "Admin" && <li>
                                    <NavLink to="/users" className="text-lg text-white block p-4 cursor-pointer">Users</NavLink>
                                </li>
                            }

                            {
                                user && <li>
                                    <NavLink to="/logout" className="text-lg text-white block p-4 cursor-pointer">Logout</NavLink>
                                </li>
                            }
                        </ul>
                    </nav>

                </div>
            </header>
    )
}

export default Navbar