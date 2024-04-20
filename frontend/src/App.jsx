import "./App.css";
import { Route, Routes } from 'react-router-dom';
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import LogoutPage from "./pages/LogoutPage";
import LeadsPage from "./pages/LeadsPage";
import UsersPage from "./pages/UsersPage";
import CreateRecord from "./pages/CreateRecord";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";

function App() {

  return (
    <>

      <Navbar />

      <Routes>
        <Route index element={<Home />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/leads' element={<LeadsPage />} />
        <Route path='/users' element={<UsersPage />} />
        <Route path='/createRecord' element={<CreateRecord />} />
        <Route path='/logout' element={<LogoutPage />} />
      </Routes>
    </>
  )
}

export default App;
