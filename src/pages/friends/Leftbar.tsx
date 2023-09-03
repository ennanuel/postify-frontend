import { NavLink, Link } from 'react-router-dom';
import { Settings, PersonAdd, KeyboardArrowRight, PeopleAltRounded, PeopleRounded } from '@mui/icons-material'

const Leftbar = () => {
  return (
    <div className="left flex-1 sticky top-[60px] py-[5px] px-[10px]">
        <div className="top p-[5px] flex items-center justify-between gap-[20px]">
            <h3 className="text-2xl font-bold">Friends</h3>
            <button className='icon h-[44px] aspect-square rounded-full flex items-center justify-center'>
                <Settings />
            </button>
        </div>
        <ul className="sections flex flex-col gap-[4px]">
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
