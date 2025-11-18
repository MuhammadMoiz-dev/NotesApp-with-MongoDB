import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Components/Home'
import Login from './Components/Login'
import SignUp from './Components/SignUp'
import PageNotFound from './Components/PageNotFound'
import Dashboard from './Components/DashBoard'
import NavBar from './Components/NavBar'
function App() {

  return (

    <>
      <BrowserRouter>
        <Routes>

          <Route path='/' element={<NavBar><Home /></NavBar>} />
          <Route path='*' element={<PageNotFound />} />
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/dashboard' element={<NavBar><Dashboard /></NavBar>} />
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
