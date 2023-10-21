import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { groupContext } from "../../pages/groups";
import { fetchGroups, addOrRemoveMember, inviteOrRejectInvite } from "../../utils/group";
import { GroupType } from "../../types/group.types";
import { GroupCard } from "../../components/cards";

const GroupInvites = () => {
  const { user } = useContext(AuthContext);
  const { refresh } = useContext(groupContext);

  const [groups, setGroups] = useState<GroupType[]>([])

  function accept(group_id: string) { addOrRemoveMember({ user_id: user.id, group_id, actionType: 'add' }) };
  function decline(group_id: string) { inviteOrRejectInvite({ user_id: user.id, group_id, actionType: 'remove' }) };

  useEffect(() => {
    fetchGroups({ user_id: user.id, fetchType: 'invites' })
      .then(res => setGroups(res))
      .catch(error => alert(error));
  }, [refresh])

  return (
    <div className='joined-groups w-full p-4 lg:pl-[5%] lg:pr-[8%]'>
      <h3 className="font-bold text-2xl">Group Invites</h3>
      <ul className="mt-[20px] grid grid-cols-1 lg:grid-cols-2 gap-2">
        {
          groups.map((group) => (
            <li key={group.id}>
              <GroupCard {...group} joinGroup={() => accept(group.id)} rejectInvite={() => decline(group.id)} />
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default GroupInvites
