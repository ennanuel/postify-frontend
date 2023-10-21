import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { groupContext } from '../../pages/groups';
import { fetchGroups } from '../../utils/group';
import { GroupCard } from '../../components/cards';
import { GroupType } from '../../types/group.types';

const GroupsList = () => {
  const { user } = useContext(AuthContext)
  const { refresh } = useContext(groupContext);

  const [createdGroups, setCreatedGroups] = useState<GroupType[]>([]);
  const [joinedGroups, setJoinedGroups] = useState<GroupType[]>([]);

  useEffect(() => {
    fetchGroups({ user_id: user.id, fetchType: 'created' })
      .then(res => setCreatedGroups(res))
      .catch(error => alert(error));
  }, [])

  useEffect(() => {
    fetchGroups({ user_id: user.id, fetchType: 'joined' })
      .then(res => setJoinedGroups(res))
      .catch(error => alert(error));
  }, [refresh])

  return (
    <div className='joined-groups w-full p-4 lg:pl-[5%] lg:pr-[8%]'>
      <h3 className="font-bold text-2xl">Created Groups ({createdGroups.length})</h3>
      <ul className="mt-[20px] grid grid-cols-1 md:grid-cols-2 gap-[10px]">
        {
          createdGroups.map( (group) => (
            <li key={group.id}>
              <GroupCard {...group} />
            </li>
          ))
        }
      </ul>
      <h3 className="font-bold text-2xl mt-10 ">Joined Groups ({joinedGroups.length})</h3>
      <ul className="mt-[20px] grid grid-cols-1 md:grid-cols-2 gap-[10px]">
        {
          joinedGroups.map( (group) => (
            <li key={group.id} className="joined-group rounded-[10px] p-[15px]">
              <GroupCard {...group} />
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default GroupsList
