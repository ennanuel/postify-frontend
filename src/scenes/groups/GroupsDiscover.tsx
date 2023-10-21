import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { groupContext } from "../../pages/groups";
import { fetchGroups, addOrRemoveMember } from "../../utils/group";
import { GroupType } from "../../types/group.types";
import { GroupCard } from "../../components/cards";

const GroupsDiscover = () => {
  const { user } = useContext(AuthContext);
  const { refresh } = useContext(groupContext);

  const [groups, setGroups] = useState<GroupType[]>([]);
  
  function accept(group_id: string) { addOrRemoveMember({ user_id: user.id, group_id, actionType: 'add' }) };

  useEffect(() => {
    fetchGroups({ user_id: user.id })
      .then(res => setGroups(res))
      .catch(error => alert(error));
  }, [refresh])

  return (
    <div className='joined-groups w-full p-4 lg:pl-[5%] lg:pr-[8%]'>
      <h3 className="font-bold text-2xl">Discover Groups</h3>
      <ul className="mt-[20px] grid grid-cols-1 lg:grid-cols-2 gap-2">
        {
          groups.map((group) => (
            <li key={group.id}>
              <GroupCard {...group} joinGroup={() => accept(group.id)} />
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default GroupsDiscover
