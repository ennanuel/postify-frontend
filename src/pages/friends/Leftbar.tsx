import { NavLink } from 'react-router-dom';
import { KeyboardArrowDown, PersonAdd, KeyboardArrowRight, PeopleAltRounded, PeopleRounded } from '@mui/icons-material'
import { useRef, useState } from 'react';

const Leftbar = () => {
    const menuRef = useRef<HTMLUListElement>(null);
    const [show, setShow] = useState(false)

    return (
        <div
            style={{ maxHeight: `${show && window.innerWidth < 1024 ? ((menuRef?.current?.offsetHeight || 0) + 70) + 'px' : window.innerWidth >= 1024 ? 'auto' : '60px'}` }}
            className="left flex-1 lg:sticky lg:h-[calc(100vh_-_60px)] top-[60px] py-1 px-2 transition-[max-height] overflow-clip"
        >
            <div className="peer top p-1 flex items-center justify-between gap-3 mb-2">
                <h3 className="text-2xl font-bold">Friends</h3>
                <button
                    onClick={() => setShow(!show)}
                    className='h-[44px] lg:hidden aspect-square rounded-full flex items-center justify-center bg-transparent'
                >
                    <KeyboardArrowDown />
                </button>
            </div>
            <ul ref={menuRef} className="sections flex flex-col gap-1">
                <li className="section">
                    <NavLink 
                        to="/friends/all"
                        className={({isActive}) => `${isActive && 'active_link'} w-full  flex items-center justify-between gap-[10px] p-[5px] rounded-[8px]`}
                    >
                        <span className='icon first flex items-center justify-center h-[38px] aspect-square rounded-full'><PeopleAltRounded /></span>
                        <span className="flex-1">Home</span>
                    </NavLink>
                </li>
                <li className='section'>
                    <NavLink 
                        to="/friends/requests"
                        className={({isActive}) => `${isActive && 'active_link'} w-full  flex items-center justify-between gap-[10px] p-[5px] rounded-[8px]`}
                    >
                        <span className="icon first flex items-center justify-center h-[38px] aspect-square rounded-full"><PersonAdd /></span>
                        <span className="flex-1">Friend Requests</span>
                        <span className="icon last flex items-center justify-center h-[38px] aspect-square rounded-full"><KeyboardArrowRight /></span>
                    </NavLink>
                </li>
                <li className='section'>
                    <NavLink 
                        to="/friends/suggestions"
                        className={({isActive}) => `${isActive && 'active_link'} w-full  flex items-center justify-between gap-[10px] p-[5px] rounded-[8px]`}
                    >
                        <span className="icon first flex items-center justify-center h-[38px] aspect-square rounded-full"><PersonAdd /></span>
                        <span className="flex-1">Suggestions</span>
                        <span className="icon last flex items-center justify-center h-[38px] aspect-square rounded-full"><KeyboardArrowRight /></span>
                    </NavLink>
                </li>
                <li className='section'>
                    <NavLink 
                        to="/friends/sent"
                        className={({isActive}) => `${isActive && 'active_link'} w-full  flex items-center justify-between gap-[10px] p-[5px] rounded-[8px]`}
                    >
                        <span className="icon first flex items-center justify-center h-[38px] aspect-square rounded-full"><PersonAdd /></span>
                        <span className="flex-1">Sent Requests</span>
                        <span className="icon last flex items-center justify-center h-[38px] aspect-square rounded-full"><KeyboardArrowRight /></span>
                    </NavLink>
                </li>
                <li className='section'>
                    <NavLink 
                        to="/friends/list"
                        className={({isActive}) => `${isActive && 'active_link'} w-full  flex items-center justify-between gap-[10px] p-[5px] rounded-[8px]`}
                    >
                        <span className="icon first flex items-center justify-center h-[38px] aspect-square rounded-full"><PeopleRounded /></span>
                        <span className="flex-1">All Friends</span>
                        <span className="icon last flex items-center justify-center h-[38px] aspect-square rounded-full"><KeyboardArrowRight /></span>
                    </NavLink>
                </li>
                <li className='section'>
                    <NavLink 
                        to="/friends/custom"
                        className={({isActive}) => `${isActive && 'active_link'} w-full  flex items-center justify-between gap-[10px] p-[5px] rounded-[8px]`}
                    >
                        <span className="icon first flex items-center justify-center h-[38px] aspect-square rounded-full"><PeopleRounded /></span>
                        <span className="flex-1">Custom List</span>
                        <span className="icon last flex items-center justify-center h-[38px] aspect-square rounded-full"><KeyboardArrowRight /></span>
                    </NavLink>
                </li>
            </ul>
        </div>
    )
}

export default Leftbar
