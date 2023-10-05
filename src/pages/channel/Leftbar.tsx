import { useState, useEffect, useContext, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Search, TvRounded, Explore, VideoLibrary, Add, KeyboardArrowDown, KeyboardArrowRight } from '@mui/icons-material'
import { AuthContext } from '../../context/authContext';
import { APIURL } from '../../assets/data';
import { ChannelContext } from '.';
import { fetchOptions } from '../../assets/data/data';

type ChannelType = {
    id: string;
    name: string;
    picture: string;
}

const Leftbar = () => {
    const { user } = useContext(AuthContext)
    const { refresh } = useContext(ChannelContext);

    const { pathname } = useLocation();

    const menuRef = useRef<HTMLUListElement>(null);
  
    const [show, setShow] = useState(false)
    const [following, setFollowing] = useState<ChannelType[]>([])

    async function getFollowingChannels() { 
        const response = await fetch(`${APIURL}/channel/${user.id}?type=following`, fetchOptions)
        if (response.status !== 200) return alert('something went wrong!');
        const res = await response.json();
        setFollowing(res);
    }
    
    useEffect(() => {
        getFollowingChannels();
    }, [refresh])

    if (/(info|create|edit)/.test(pathname) && window.innerWidth < 1024) return;

    return (
        <div 
            style={{ maxHeight: `${show && window.innerWidth < 1024 ? ((menuRef?.current?.offsetHeight || 0) + 130) + 'px' : window.innerWidth >= 1024 ? 'auto' : '120px'}` }}
            className="left-bar lg:sticky lg:h-[calc(100vh-60px)] top-[60px] p-4 flex flex-col gap-3 overflow-clip transition-[max-height]"
        >
            <div className="top flex items-center justify-between gap-4">
                <h3 className="text-2xl font-bold">Channels</h3>
                <button
                    onClick={() => setShow(!show)}
                    className='h-[44px] lg:hidden aspect-square rounded-full flex items-center justify-center bg-transparent'
                >
                <KeyboardArrowDown />
                </button>
            </div>
            <div className="search flex items-center h-[40px] rounded-[20px] pl-2 pr-4 gap-1">
                <label htmlFor="search" className="flex items-center justify-center"><Search /></label>
                <input className="h-[40px] outline-none border-none flex-1" id="search" placeholder="Search channels" type="text" />
            </div>
            <ul ref={menuRef} className="flex flex-col gap-2">
                <li>
                    <NavLink
                        to="/channels/feed"
                        className={({ isActive }) => `channel-nav ${isActive && 'active-channel-nav'} p-1 flex items-center gap-2 rounded-md`}
                    >
                        <span className="icon flex items-center justify-center h-[36px] aspect-square rounded-lg"><VideoLibrary /></span>
                        <span>Your Feed</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/channels/explore"
                        className={({ isActive }) => `channel-nav ${isActive && 'active-channel-nav'} p-1 flex items-center gap-2 rounded-md`}
                    >
                        <span className="icon flex items-center justify-center h-[36px] aspect-square rounded-lg"><Explore /></span>
                        <span>Discover</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        to="/channels/list"
                        className={({ isActive }) => `channel-nav ${isActive && 'active-channel-nav'} p-1 flex items-center gap-2 rounded-md`}
                    >
                        <span className="icon flex items-center justify-center h-[36px] aspect-square rounded-lg"><TvRounded /></span>
                        <span>My Channels</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/channels/create" className="create-channel mt-2 flex p-2 rounded-md w-full items-center justify-center gap-2">
                        <Add />
                        <span>Create Channel</span>
                    </NavLink>
                </li>
            </ul>
            <div className="bottom hidden lg:block mt-1 py-2">
                <h3 className="font-bold text-lg">Your Channels</h3>
                <ul className="flex flex-col gap-2 mt-3">
                    <li>
                        {
                            following.map(({ id, name, picture }) => (
                                <Link to={`/channels/info/${id}`} className="bottom-channel flex items-center gap-3 p-[10px] rounded-md">
                                    <img className="w-[50px] aspect-square rounded-full bg-white/5" src={picture} alt="" />
                                    <div className="flex flex-col flex-1">
                                        <p className="font-bold text-sm">{ name }</p>
                                        <p className="text-xs">Posted 2 days ago</p>
                                    </div>
                                    <KeyboardArrowRight />
                                </Link>
                            ))
                        }
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default Leftbar
