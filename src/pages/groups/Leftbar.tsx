import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Search, Add, VideoLabelRounded, ExploreRounded, PeopleAltRounded, GroupAddRounded, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material'
import { useState, useEffect, useContext, useRef, useMemo } from 'react';
import { AuthContext } from '../../context/authContext';
import { groupContext } from '.';
import { fetchGroups } from '../../utils/group';
import { SmallGroupCard } from '../../components/cards';
import { GroupType } from '../../types/group.types';

const NAVIGATIONS = [
  { to: 'posts', text: 'Your Feed', Icon: VideoLabelRounded },
  { to: 'discover', text: 'Discover', Icon: ExploreRounded },
  { to: 'list', text: 'Your Groups', Icon: PeopleAltRounded },
  { to: 'invites', text: 'Group Invites', Icon: GroupAddRounded },
]

const Leftbar = () => {
  const { user } = useContext(AuthContext);
  const { refresh } = useContext(groupContext);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const [show, setShow] = useState(true)
  const [joinedGroups, setJoinedGroups] = useState<GroupType[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [search, setSearch] = useState('');

  const menuRef = useRef<HTMLUListElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const hideForMobile = useMemo(() => /(edit|create)/.test(pathname) && isMobile, [pathname, isMobile]);
  const style = useMemo(getMaxHeight, [show, window.innerWidth]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    if (!search) return;
    navigate(`/groups/search/${search}`);
  }

  function expandMobileMenu() { setShow(true) };
  function collapseMobileMenu() {
    if (window.innerWidth >= 1024) return;
    setShow(false)
  };
  function getMaxHeight() {
    const totalMobileMenuHeightInPx = (Number(menuRef.current?.offsetHeight) + Number(topRef.current?.offsetHeight)) + 'px';
    const maxHeight = !isMobile ? 'auto' : show ? totalMobileMenuHeightInPx : topRef.current?.offsetHeight + 'px';
    return { maxHeight };
  }

  function handleWindowResize() {
    setIsMobile(window.innerWidth < 1024);
  };

  useEffect(() => { 
    fetchGroups({ user_id: user.id, fetchType: 'joined' })
      .then(res => setJoinedGroups(res))
      .catch(error => alert(error));
  }, [refresh])

  useEffect(() => {
    window.removeEventListener('resize', handleWindowResize)
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [])

  if (hideForMobile) return;

  return (
    <div
      style={style}
      className="left lg:sticky lg:h-[calc(100vh-80px)] top-[70px] lg:mx-2 lg:rounded-md lg:shadow-lg shadow-black-900/50 lg:px-2 lg:py-1 overflow-clip transition-[max-height]"
    >
      <div ref={topRef} className="px-2 py-1 lg:p-0">
        <div className="top p-1 lg:pb-4 flex items-center justify-between gap-4">
          <h3 className="text-xl lg:text-2xl font-bold">Groups</h3>
          <button
            onClick={show ? collapseMobileMenu : expandMobileMenu}
            className={`h-[44px] lg:hidden flex items-center justify-center bg-transparent`}
          >
            { show ? <KeyboardArrowUp /> : <KeyboardArrowDown /> } 
          </button>
        </div>
        <form onSubmit={handleSubmit} className="search rounded-md mb-2 pr-[3px] flex items-center">
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 h-[40px] px-3 border-none outline-none" type="text" placeholder="Search groups" />
          <button onClick={collapseMobileMenu} className="flex items-center justify-center h-[34px] aspect-square rounded-md bg-black-900/30">
            <Search />
          </button>
        </form>
      </div>
      <ul ref={menuRef} className="flex flex-col gap-1 px-2 pb-4 lg:p-0">
        {
          NAVIGATIONS.map(({ to, text, Icon }) => (
            <li key={to}>
              <NavLink 
                to={`/groups/${to}`}
                onClick={collapseMobileMenu}
                className={({ isActive }) => `${isActive && 'active_section'} section p-1 rounded-md flex items-center justify-between gap-[10px] `}
              >
                <span className="icon top h-[38px] aspect-square rounded-lg flex items-center justify-center"><Icon /></span>
                <span className="title flex-1">{text}</span>
              </NavLink>
            </li>
          ))
        }
        <li>
          <NavLink
            onClick={collapseMobileMenu}
            to="/groups/create"
            className={({ isActive }) => `bg-blue-400/20 text-blue-300 w-full font-semibold flex items-center justify-center gap-[5px] p-[8px] rounded-[5px] mt-[10px] text-sm ${isActive && 'bg-gradient-to-r from-blue-600/40 via-blue-400/40 to-purple-500/40 text-white shadow'}`}
          >
            <Add />
            <span>Create New Group</span>
          </NavLink>
        </li>
      </ul>
      <div className="groups-list hidden lg:flex flex-col gap-2 mt-2 py-4">
        <div className="top menu-top flex items-center justify-between">
          <h3 className="font-bold">Groups you've joined</h3>
          <Link onClick={collapseMobileMenu} to="/groups/list" className="text-xs">See all</Link>
        </div>
        <ul className="container">
          {
            joinedGroups.map((group, i) => (
              <li key={i}>
                <SmallGroupCard {...group} />
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}

export default Leftbar
