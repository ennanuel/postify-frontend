import { 
  Home,
  SearchOutlined,
  VideoLibraryOutlined,
  GroupsOutlined,
  PeopleOutlineRounded,
} from '@mui/icons-material'
import { Link, NavLink } from 'react-router-dom';
import Menus from './menus';

const Navbar = () => {
  return (
    <div className="navbar grid grid-cols-3 items-center p-[10px] h-[60px] sticky top-0">
      <div className="left w-full flex items-center gap-[15px]">
        <Link to="/">
          <h3 className="logo font-bold text-[20px]">Postify</h3>
        </Link>
        <div className="search rounded-[30px] flex items-center pl-[10px]">
          <SearchOutlined />
          <input className="w-[200px] p-[7px] bg-transparent rounded-[5px]" type="text" placeholder="Search Postify" />
        </div>
      </div>
      <ul className="nav-links flex items-center">
        <li className="flex-1 relative flex items-center justify-center">
          <NavLink to="/" className={({ isActive }) => `flex items-center justify-center nav-link ${isActive && 'active-nav-link'}`}>
            <Home />
          </NavLink>
        </li>
        <li className="flex-1 relative flex items-center justify-center">
          <NavLink to="/friends/all" className={({ isActive }) => `flex items-center justify-center nav-link ${isActive && 'active-nav-link'}`}>
            <PeopleOutlineRounded />
          </NavLink>
        </li>
        <li className="flex-1 relative flex items-center justify-center">
          <NavLink to="/channels/feed" className={({ isActive }) => `flex items-center justify-center nav-link ${isActive && 'active-nav-link'}`}>
            <VideoLibraryOutlined />
          </NavLink>
        </li>
        <li className="flex-1 relative flex items-center justify-center">
          <NavLink to="/groups/posts" className={({ isActive }) => `flex items-center justify-center nav-link ${isActive && 'active-nav-link'}`}>
            <GroupsOutlined />
          </NavLink>
        </li>
      </ul>
      <Menus />
    </div>
  )
}

export default Navbar
