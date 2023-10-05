import { 
  Home,
  SearchOutlined,
  VideoLibraryOutlined,
  GroupsOutlined,
  PeopleOutlineRounded,
  Menu,
  MessageOutlined,
  NotificationsOutlined,
  CancelOutlined,
} from '@mui/icons-material'
import { Link, NavLink, useSearchParams } from 'react-router-dom';
import Menus from './menus';
import Shortcuts from './menus/Shortcuts';

const Navbar = () => {
  const [params, setParams] = useSearchParams();

  return (
    <div className="navbar grid grid-cols-1 lg:grid-cols-3 gap-4 items-center p-[10px] lg:h-[60px] sticky top-0">
      <div className="left w-full flex items-center justify-between lg:justify-start gap-2">
        <Link to="/" className="flex-1 lg:flex-[0]">
          <h3 className="logo font-bold text-[20px]">Postify</h3>
        </Link>
        <div className="h-[40px] rounded-[20px] flex items-center bg-white/5">
          <label htmlFor="search" className="flex items-center justify-center h-full aspect-square">              
            <SearchOutlined />
          </label>
          <input id="search" className="max-w-0 outline-0 border-0 transition-[max-width] focus:pr-[7px] focus:max-w-[120px] md:focus:max-w-[200px]" type="text" placeholder="Search Postify" />
        </div>
        <div className="relative md:hidden z-[99999]">
          <button
            className="h-[40px] w-[40px] rounded-full bg-white/5"
            onClick={() => setParams({ menu: 'shortcut' })}>
            <Menu />
          </button>
          {
            params.get('menu') === 'shortcut' &&
            <Shortcuts close={() => setParams({ menu: '' })} />
          }
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
        <li className="flex-1 relative lg:hidden flex items-center justify-center">
          <NavLink to="/message" className={({ isActive }) => `flex items-center justify-center nav-link ${isActive && 'active-nav-link'}`}>
            <MessageOutlined />
          </NavLink>
        </li>
        <li className="flex-1 relative flex items-center justify-center">
          <NavLink to="/channels/feed" className={({ isActive }) => `flex items-center justify-center nav-link ${isActive && 'active-nav-link'}`}>
            <VideoLibraryOutlined />
          </NavLink>
        </li>
        <li className="flex-1 relative flex items-center justify-center lg:hidden">
          <NavLink to="/notifications" className={({ isActive }) => `flex items-center justify-center nav-link ${isActive && 'active-nav-link'}`}>
            <NotificationsOutlined />
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
