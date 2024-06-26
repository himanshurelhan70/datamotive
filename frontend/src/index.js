import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import { UserProvider } from "./context/UserContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>

  <BrowserRouter>
    <UserProvider>
      <App />
      <ToastContainer />
    </UserProvider>

  </BrowserRouter>

  // </React.StrictMode>
);
