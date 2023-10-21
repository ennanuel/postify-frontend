import { useState, useEffect, useContext, useRef, useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Search, TvRounded, Explore, VideoLibrary, Add, KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import { AuthContext } from '../../context/authContext';
import { ChannelContext } from '.';
import { getChannels } from '../../utils/channel';
import { ChannelType } from '../../types/channel.types';
import { ChannelAltCard } from '../../components/cards';

const NAVIGATIONS = [
    { to: 'feed', text: 'Your Feed', Icon: VideoLibrary },
    { to: 'explore', text: 'Discover', Icon: Explore },
    { to: 'list/all', text: 'My Channels', Icon: TvRounded },
]

const Leftbar = () => {
    const { user } = useContext(AuthContext)
    const { refresh } = useContext(ChannelContext);
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const [show, setShow] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [following, setFollowing] = useState<ChannelType[]>([]);
    const [search, setSearch] = useState('');

    const menuRef = useRef<HTMLUListElement>(null);
    const topRef = useRef<HTMLDivElement>(null);
    const hideForMobile = useMemo(() => /(info|create|edit)/.test(pathname) && isMobile, [pathname, isMobile]);
    const style = useMemo(getMaxHeight, [show, window.innerWidth]);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        if (!search) return;
        navigate(`/channels/search/${search}`);
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
        window.removeEventListener('resize', handleWindowResize)
        window.addEventListener('resize', handleWindowResize);
        return () => window.removeEventListener('resize', handleWindowResize);
    }, [])
    useEffect(() => {
        getChannels(user.id, 'created')
            .then(res => setFollowing(res))
            .catch(error => alert(error));
    }, [refresh])

    if (hideForMobile) return;

    return (
        <div 
            style={style}
            className="left-bar lg:sticky lg:h-[calc(100vh-80px)] top-[70px] lg:p-2 lg:mx-2 lg:rounded-md flex flex-col gap-3 overflow-clip transition-[max-height] lg:shadow-lg shadow-black-900/40"
        >
            <div ref={topRef} className="px-2 py-1 lg:p-0">
                <div className="top p-1 lg:pb-4 flex items-center justify-between gap-4">
                <h3 className="text-xl lg:text-2xl font-bold">Channels</h3>
                <button
                    onClick={show ? collapseMobileMenu : expandMobileMenu}
                    className={`h-[44px] lg:hidden flex items-center justify-center`}
                >
                    { show ? <KeyboardArrowUp /> : <KeyboardArrowDown /> }
                </button>
                </div>
                <form onSubmit={handleSubmit} className="search rounded-md mb-2 pr-[3px] flex items-center">
                    <input value={search} onChange={(e) => setSearch(e.target.value)} className="flex-1 h-[40px] px-3 border-none outline-none" type="text" placeholder="Search channels" />
                    <button onClick={collapseMobileMenu} className="flex items-center justify-center h-[34px] aspect-square rounded-md bg-black-900/30">
                        <Search />
                    </button>
                </form>
            </div>
            <ul ref={menuRef} className="flex flex-col gap-2 px-2 pb-5 lg:p-0">
                {
                    NAVIGATIONS.map(({ to, text, Icon }) => (
                        <li key={to}>
                            <NavLink
                                to={`/channels/${to}`}
                                className={({ isActive }) => `channel-nav ${isActive && 'active-channel-nav'} p-1 flex items-center gap-2 rounded-md`}
                            >
                                <span className="icon flex items-center justify-center h-[36px] aspect-square rounded-lg"><Icon /></span>
                                <span>{text}</span>
                            </NavLink>
                        </li>
                    ))
                }
                <li>
                <NavLink
                    onClick={collapseMobileMenu}
                    to="/channels/create"
                    className={({ isActive }) => `bg-blue-400/20 text-blue-300 w-full font-semibold flex items-center justify-center gap-[5px] p-[8px] rounded-[5px] mt-[10px] text-sm ${isActive && 'bg-gradient-to-r from-blue-600/40 via-blue-400/40 to-purple-500/40 text-white shadow'}`}
                >
                    <Add />
                    <span>Create Channel</span>
                </NavLink>
                </li>
            </ul>
            <div className="bottom hidden lg:block mt-1 py-2">
                <h3 className="font-bold text-lg">Your Channels</h3>
                <ul className="flex flex-col gap-2 mt-3">
                    {
                        following.map((channel, i) => <li key={i}><ChannelAltCard {...channel} /></li>)
                    }
                </ul>
            </div>
        </div>
    )
}

export default Leftbar
