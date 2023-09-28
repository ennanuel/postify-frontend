import { useState, useEffect, useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Search, TvRounded, Explore, VideoLibrary, Add, Settings, KeyboardArrowRight } from '@mui/icons-material'
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

    return (
        <div className="left-bar flex-[2] sticky top-[60px] p-4 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Channels</h2>
                <button className="icon flex items-center justify-center h-[40px] aspect-square rounded-full"><Settings /></button>
            </div>
            <div className="search flex items-center h-[40px] rounded-[20px] pl-2 pr-4 gap-1">
                <label htmlFor="search" className="flex items-center justify-center"><Search /></label>
                <input className="h-[40px] outline-none border-none flex-1" id="search" placeholder="Search channels" type="text" />
            </div>
            <ul className="flex flex-col gap-2">
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
            <div className="bottom mt-1 py-2">
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
