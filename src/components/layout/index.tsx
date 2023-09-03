import { useContext } from 'react';
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import { DarkModeContext } from '../../context/darkModeContext';
import './layout.scss'

const Layout = () => {
  const { darkMode } = useContext(DarkModeContext)
  
  return (
    <div  className={`theme-${darkMode ? 'dark' : 'light'}`}>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default Layout
