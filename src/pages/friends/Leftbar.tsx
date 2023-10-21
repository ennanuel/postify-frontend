import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { KeyboardArrowDown, KeyboardArrowUp, Search, PersonAdd, PeopleAltRounded, PeopleRounded } from '@mui/icons-material'
import { useRef, useState, useMemo, useEffect } from 'react';

const NAVIGATIONS = [
    { to: 'all', text: 'Home', Icon: PeopleAltRounded },
    { to: 'requests', text: 'Friend Requests', Icon: PersonAdd },
    { to: 'suggestions', text: 'Suggestions', Icon: PersonAdd },
    { to: 'sent', text: 'Sent Requests', Icon: PersonAdd },
    { to: 'list', text: 'All Friends', Icon: PeopleRounded },
    { to: 'custom', text: 'Friend Groups', Icon: PeopleRounded }
];

const Leftbar = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const [show, setShow] = useState(true)
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    const [search, setSearch] = useState('');

    const menuRef = useRef<HTMLUListElement>(null);
    const topRef = useRef<HTMLDivElement>(null);
    const hideForMobile = useMemo(() => /custom/.test(pathname) && isMobile, [pathname, isMobile]);
    const style = useMemo(getMaxHeight, [show, window.innerWidth]);

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        if (!search) return;
        navigate(`/friends/search/${search}`);
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

    if (hideForMobile) return;

    return (
        <div
            style={style}
            className="left flex-1 lg:sticky lg:h-[calc(100vh_-_80px)] lg:mx-2 lg:rounded-md top-[70px] py-1 px-2 transition-[max-height] overflow-clip lg:shadow-lg shadow-black-900/40"
        >
            <div ref={topRef} className="px-2 py-1 lg:p-0">
                <div className="top p-1 lg:pb-4 flex items-center justify-between gap-4">
                <h3 className="text-xl lg:text-2xl font-bold">Friends</h3>
                <button
                    onClick={show ? collapseMobileMenu : expandMobileMenu}
                    className={`h-[44px] lg:hidden flex items-center justify-center`}
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
            <ul ref={menuRef} className="sections flex flex-col gap-1 pb-2">
                {
                    NAVIGATIONS.map(({ to, text, Icon }) => (
                        <li key={to} className="section">
                            <NavLink 
                                to={`/friends/${to}`}
                                onClick={collapseMobileMenu}
                                className={({isActive}) => `${isActive && 'active_link'} w-full  flex items-center justify-between gap-[10px] p-[5px] rounded-[8px]`}
                            >
                                <span className='icon flex items-center justify-center h-[38px] aspect-square rounded-lg'>
                                    <Icon />
                                </span>
                                <span className="flex-1">{text}</span>
                            </NavLink>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default Leftbar
