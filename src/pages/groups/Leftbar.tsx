import { Link, NavLink } from 'react-router-dom';
import { Settings, Search, Add, VideoLabelRounded, ExploreRounded, PeopleAltRounded, KeyboardArrowRight, GroupAddRounded} from '@mui/icons-material'
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { APIURL } from '../../assets/data';
import { groupContext } from '.';
import { fetchOptions } from '../../assets/data/data';

type GroupType = {
  id: string;
  name: string;
  cover: string;
}

const Leftbar = () => {
  const { user } = useContext(AuthContext);
  const { refresh } = useContext(groupContext);

  const [joinedGroups, setJoinedGroups] = useState<GroupType[]>([]);

  const fetchJoinedGroups = async () => {
    const response = await fetch(`${APIURL}/group/${user.id}?type=joined`, fetchOptions)
    if (response.status !== 200) return alert('something went wrong');
    const res = await response.json()
    setJoinedGroups(res)
  }

  useEffect(() => { 
    fetchJoinedGroups()
  }, [refresh])

  return (
    <div className="left sticky top-[60px] py-[5px] px-[10px]">
      <div className="top p-[5px] flex items-center justify-between gap-[20px]">
        <h3 className="font-bold">Groups</h3>
        <button className="h-[44px] aspect-square rounded-full flex items-center justify-center"><Settings /></button>
      </div>
      <div className="search h-[40px] rounded-[20px] mb-[10px] py-[5px] px-[10px] flex items-center gap-[10px]">
        <Search />
        <input className="flex-1 h-full border-none outline-none" type="text" placeholder="Search groups"  />
      </div>
      <ul className="flex flex-col gap-[5px]">
        <li>
          <NavLink 
            to="/groups/posts" 
            className={({ isActive }) => `${isActive && 'active_section'} section p-[5px] rounded-[8px] flex items-center justify-between gap-[10px] `}
          >
            <span className="icon top h-[38px] aspect-square rounded-full flex items-center justify-center"><VideoLabelRounded /></span>
            <span className="title">Your Feed</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/groups/discover" 
            className={({ isActive }) => `${isActive && 'active_section'} section p-[5px] rounded-[8px] flex items-center justify-between gap-[10px] `}
          >
            <span className="icon top h-[38px] aspect-square rounded-full flex items-center justify-center"><ExploreRounded /></span>
            <span className="title">Discover</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/groups/list" 
            className={({ isActive }) => `${isActive && 'active_section'} section p-[5px] rounded-[8px] flex items-center justify-between gap-[10px] `}
          >
            <span className="icon top h-[38px] aspect-square rounded-full flex items-center justify-center"><PeopleAltRounded /></span>
            <span className="title">Your Groups</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/groups/invites" 
            className={({ isActive }) => `${isActive && 'active_section'} section p-[5px] rounded-[8px] flex items-center justify-between gap-[10px] `}
          >
            <span className="icon top h-[38px] aspect-square rounded-full flex items-center justify-center"><GroupAddRounded /></span>
            <span className="title">Group Invites</span>
          </NavLink>
        </li>
      </ul>
      <Link to="/groups/create" className='create-new w-full flex items-center justify-center gap-[5px] p-[8px] rounded-[5px] mt-[10px] text-sm'>
        <Add />
        <span>Create New Group</span>
      </Link>
      <div className="groups-list flex flex-col gap-[10px] mt-[20px] py-[20px]">
        <div className="top menu-top flex items-center justify-between">
          <h3 className="font-bold">Groups you've joined</h3>
          <Link to="/groups/list" className="text-xs">See all</Link>
        </div>
        <ul className="container">
          {
            joinedGroups.map(({ id, name, cover }) => (
              <li key={id}>
                <Link to={`/groups/group/${id}`} className="group-list p-1 rounded-md flex items-center gap-[10px]">
                  <img className="w-[60px] aspect-square rounded-[8px]" src={cover} alt="" />
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-sm font-bold">{ name }</p>
                    <p className="text-xs">Last Active 2 hours ago</p>
                  </div>
                  <button className="w-[30px] aspect-square rounded-full flex items-center justify-center">
                    <KeyboardArrowRight />
                  </button>
                </Link>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}

export default Leftbar
