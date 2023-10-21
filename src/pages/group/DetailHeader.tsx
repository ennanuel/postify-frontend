import { useContext } from 'react';
import { Add, EditRounded, GroupRemove } from '@mui/icons-material'
import { Link, NavLink } from 'react-router-dom'
import { APIURL } from '../../assets/data';
import InviteMembers from './InviteMembers';
import { addOrRemoveMember } from '../../utils/group';
import { GroupContext } from '.';
import { AuthContext } from '../../context/authContext';

const NAVIGATIONS = [
  { to: 'info', text: 'Posts' },
  { to: 'members', text: 'Members' },
  { to: 'photos', text: 'Photos' },
  { to: 'videos', text: 'Videos' },
  { to: 'invites', text: 'Invites', hide: true },
]

const DetailHeader = () => {
    const { user } = useContext(AuthContext);
    const { group: { id, name, cover, member_pics, owner, is_member } } = useContext(GroupContext);

    function handleJoinGroup() { addOrRemoveMember({ user_id: user.id, group_id: id, actionType: 'add' }) };
    function handleLeaveGroup() { addOrRemoveMember({ user_id: user.id, group_id: id, actionType: 'remove' }) };
        
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
                                    <img src={`${APIURL}/image/profile_pics/${member}`} alt="" />
                                </li>
                            ))
                        }
                    </ul>
                    <div className="actions flex items-center gap-3 h-[36px]">
                        {
                            is_member ?
                            <InviteMembers /> :
                            <button onClick={handleJoinGroup} className="h-full flex gap-1 items-center justify-center rounded-md pl-1 pr-3">
                                <Add />
                                <span>Join</span>
                            </button>
                        }
                        {
                            (is_member && !owner) &&
                                <button onClick={handleLeaveGroup} className="flex items-center justify-center gap-2 h-full rounded-md bg-black-900/50 shadow px-3">
                                    <span>Leave</span>
                                    <GroupRemove />
                                </button>
                        }
                    </div>
                </div>
            </div>
            <div className="header-nav sticky top-[50px] md:top-[90px] lg:top-[60px] z-[9999] flex items-center justify-between gap-[10px] px-2 lg:px-[15%] shadow-lg shadoe-black-900/50">
                <ul className="links flex-1 flex items-center overflow-x-scroll lg:overflow-x-clip overflow-y-clip text-sm lg:text-base">
                    {
                        NAVIGATIONS.map(({ to, text, hide }) => (
                            (!hide || owner) &&
                            <li key={to}>
                                <NavLink
                                    to={`/group/${to}/${id}`}
                                    className={({ isActive }) => `${isActive && 'active_link'} block link py-3 px-4 relative text-center`}
                                >
                                    {text}
                                </NavLink>
                            </li>
                        ))
                    }
                </ul>
            </div>
        </>
    )
}

export default DetailHeader
