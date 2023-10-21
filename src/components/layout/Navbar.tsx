import { 
  Home,
  SearchOutlined,
  GroupsOutlined,
  PeopleOutlineRounded,
  Menu,
  CommentRounded,
  NotificationsOutlined,
  TvRounded
} from '@mui/icons-material'
import { Link, NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import Menus from './menus';
import Shortcuts from './menus/Shortcuts';
import { useMemo, useState } from 'react';

const NAVIGATIONS = [
  { to: '/', Icon: Home, hideDesktop: false, hideMobile: false },
  { to: '/friends/all', Icon: PeopleOutlineRounded, hideDesktop: false, hideMobile: false },
  { to: '/message', Icon: CommentRounded, hideDesktop: true, hideMobile: false },
  { to: '/channels/feed', Icon: TvRounded, hideDesktop: false, hideMobile: true },
  { to: '/notifications', Icon: NotificationsOutlined, hideDesktop: true, hideMobile: false },
  { to: '/groups/posts', Icon: GroupsOutlined, hideDesktop: false, hideMobile: true },
]

const Navbar = () => {
  const [params, setParams] = useSearchParams();
  const showMobileMenu = useMemo(() => params.get('menu') === 'shortcut', [params]);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [search, setSearch] = useState('')

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!search.replace(' ', '')) return;
    navigate(`/search/${search}`);
    setSearch('');
  }

  return (
    <div className="navbar grid grid-cols-1 grid-rows-2 lg:grid-rows-1 lg:grid-cols-3 px-4 pt-2 lg:pt-0 h-[100px] md:h-[90px] lg:h-[60px] sticky top-[-50px] md:top-0">
      <div className="left w-full flex items-center justify-between lg:justify-start gap-2 md:gap-4 lg:p-0">
        <Link to="/" className="flex-1 lg:flex-[0]">
          <h3 className="logo font-bold text-xl">Postify</h3>
        </Link>
        {
          !/search/i.test(pathname) &&
            <form onSubmit={handleSubmit} className="relative h-[40px] rounded-lg md:rounded-[20px] bg-white/5">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                id="search"
                className="peer h-full text-sm md:text-base pr-[40px] max-w-0 outline-none border-none transition-[max-width] focus:pl-3 focus:max-w-[160px] md:focus:max-w-[240px]"
                type="text"
                placeholder="Search Postify"
              />
              <button className="block absolute z-1 top-0 right-0 h-full aspect-square items-center justify-center pointer-events-none peer-focus:pointer-events-auto active:pointer-events-auto">
                <SearchOutlined />
              </button>
            </form>
        }
        <div className="relative md:hidden z-[99999]">
          <button
            className="h-[40px] w-[40px] rounded-lg md:rounded-full bg-white/5 flex items-center justify-center"
            onClick={() => setParams({ menu: 'shortcut' })}
          >
            <Menu />
          </button>
          {
            showMobileMenu &&
            <Shortcuts close={() => setParams({ menu: '' })} />
          }
        </div>
      </div>
      <ul className="nav-links flex items-stretch sticky lg:relative top-0">
        {
          NAVIGATIONS.map(({ to, hideDesktop, hideMobile, Icon }) => (
            <li key={to} className={`flex-1 relative flex items-stretch justify-center ${hideDesktop && 'lg:hidden'} ${hideMobile && 'hidden md:flex'}`}>
              <NavLink to={to} className={({ isActive }) => `h-full flex items-center justify-center nav-link ${isActive && 'active-nav-link'}`}>
                <Icon />
              </NavLink>
            </li>
          ))
        }
      </ul>
      <Menus />
    </div>
  )
}

export default Navbar
