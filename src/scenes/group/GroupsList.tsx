import { useState, useEffect, useContext } from 'react';
import { MoreHoriz } from "@mui/icons-material"
import { AuthContext } from '../../context/authContext';
import { APIURL } from '../../assets/data';
import { Link } from 'react-router-dom';
import { groupContext } from '../../pages/groups';

type GroupType = {
  id: string;
  name: string;
  cover: string;
  members: number;
}

const GroupsList = () => {
  const { user, socket } = useContext(AuthContext)
  const { refresh } = useContext(groupContext);

  const [createdGroups, setCreatedGroups] = useState<GroupType[]>([])
  const [joinedGroups, setJoinedGroups] = useState<GroupType[]>([])
  
  const fetchJoinedGroups = async () => {
    const response = await fetch(`${APIURL}/group/${user.id}?type=joined`)

    if(response.status !== 200) return alert('something went wrong')
    const res = await response.json();

    setJoinedGroups(res);
  }
  
  const fetchCreatedGroups = async () => {
    const response = await fetch(`${APIURL}/group/${user.id}?type=created`)

    if(response.status !== 200) return alert('something went wrong')
    const res = await response.json();

    setCreatedGroups(res);
  }

  useEffect(() => {
    fetchCreatedGroups();
  }, [])

  useEffect(() => {
    fetchJoinedGroups();
  }, [refresh])

  return (
    <div className='joined-groups w-full m-[20px] pl-[5%] pr-[8%]'>
      <h3 className="font-bold text-lg">Created Groups ({createdGroups.length})</h3>
      <ul className="mt-[20px] grid grid-cols-2 gap-[10px]">
        {
          createdGroups.map( ({id, name, cover}) => (
            <li key={id} className="joined-group rounded-[10px] p-[15px]">
              <div className="info flex items-end gap-[10px]">
                <img className="h-[70px] aspect-square rounded-[8px] " src={cover} alt="" />
                <div className="details flex flex-col">
                  <h3 className="">{name}</h3>
                  <p className="text-xs">Last Visited 3 days ago</p>
                </div>
              </div>
              <div className="actions flex items-center h-[40px] gap-[10px] mt-[15px]">
                <Link to={`/group/${id}`} className="btn flex-1 flex items-center justify-center h-full rounded-[8px] p-[10px]">View</Link>
                <button className="flex items-center justify-center h-full rounded-[8px] p-[10px]"><MoreHoriz /></button>
              </div>
            </li>
          ))
        }
      </ul>
      <h3 className="font-bold text-lg mt-10 ">Joined Groups ({joinedGroups.length})</h3>
      <ul className="mt-[20px] grid grid-cols-2 gap-[10px]">
        {
          joinedGroups.map( ({id, name, cover}) => (
            <li key={id} className="joined-group rounded-[10px] p-[15px]">
              <div className="info flex items-end gap-[10px]">
                <img className="h-[70px] aspect-square rounded-[8px] " src={cover} alt="" />
                <div className="details flex flex-col">
                  <h3 className="">{name}</h3>
                  <p className="text-xs">Last Visited 3 days ago</p>
                </div>
              </div>
              <div className="actions flex items-center h-[40px] gap-[10px] mt-[15px]">
                <Link to={`/group/${id}`} className="flex-1 flex items-center justify-center h-full rounded-[8px] p-[10px]">View</Link>
                <button className="flex items-center justify-center h-full rounded-[8px] p-[10px]"><MoreHoriz /></button>
              </div>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default GroupsList
