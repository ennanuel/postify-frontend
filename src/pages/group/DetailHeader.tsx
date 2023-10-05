import { useContext } from 'react';
import { KeyboardArrowDown, Search, MoreHoriz, Add, EditRounded } from '@mui/icons-material'
import { Link, NavLink } from 'react-router-dom'
import { GroupContext } from '.';
import { APIURL } from '../../assets/data';

const DetailHeader = () => {
    const { group: { id, name, cover, member_pics, owner } } = useContext(GroupContext)
        
    return (
        <>
            <div className="details-header lg:px-[12%] pb-4">
                <img className="cover w-full h-[250px] rounded-b-[10px]" src={`${APIURL}/image/covers/${cover}`} alt="" />
                <div className="flex items-center justify-between gap-4 p-4 lg:px-[30px] lg:pt-[20px] pb-[10px]">
                    <h3 className="font-bold text-3xl">{name}</h3>
                    {
                        owner &&
                        <Link to={`/groups/edit_group/${id}`} className="flex items-center justify-center py-1 px-2 bg-white/10 rounded-md">
                            <EditRounded />
                        </Link>
                    }
                </div>
                <div className="info flex items-center justify-between px-4 lg:px-[30px]">
                    <ul className="group-members">
                        {
                            member_pics?.map((member, i) => (
                                <li key={i} className="group-member">
                                    <img src={member} alt="" />
                                </li>
                            ))
                        }
                    </ul>
                    <div className="actions flex items-center gap-[15px] h-[40px]">
                        <button className="h-full flex items-center justify-center rounded-[8px] p-[10px]">
                            <Add />
                            <span>Invite</span>
                        </button>
                        <button className="h-full flex items-center justify-center rounded-[8px] p-[10px]"><KeyboardArrowDown /></button>
                    </div>
                </div>
            </div>
            <div className="header-nav sticky top-[60px] flex items-center justify-between gap-[10px] px-2 lg:px-[15%]">
                <ul className="links flex-1 flex items-center overflow-x-scroll lg:overflow-x-clip overflow-y-clip text-sm lg:text-base">
                    <NavLink to={`/group/${id}`} className={({ isActive }) => `${isActive && 'active_link'} link py-3 px-4 relative text-center`}>
                        Posts
                    </NavLink>
                    <NavLink to={`/group/members/${id}`} className={({ isActive }) => `${isActive && 'active_link'} link py-3 px-4 relative text-center`}>
                        Members
                    </NavLink>
                    <NavLink to={`/group/photos/${id}`} className={({ isActive }) => `${isActive && 'active_link'} link py-3 px-4 relative text-center`}>
                        Photos
                    </NavLink>
                    <NavLink to={`/group/videos/${id}`} className={({ isActive }) => `${isActive && 'active_link'} link py-3 px-4 relative text-center`}>
                        Videos
                    </NavLink>
                    {
                        owner &&
                        <NavLink to={`/group/invites/${id}`} className={({ isActive }) => `${isActive && 'active_link'} link py-3 px-4 relative text-center`}>
                            Invites
                        </NavLink>
                    }
                </ul>
                <button className="flex items-center justify-center py-1 px-2 rounded-md"><Search /></button>
                <button className="flex items-center justify-center py-1 px-2 rounded-md"><MoreHoriz /></button>
            </div>
        </>
    )
}

export default DetailHeader
