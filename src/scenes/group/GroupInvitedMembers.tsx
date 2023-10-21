import { useState, useContext, useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'
import { GroupContext } from '../../pages/group'
import { fetchGroupMembers, inviteOrRejectInvite } from '../../utils/group';
import { UserType } from '../../types/user.types'
import GroupMember from '../../components/cards/GroupMember';

const GroupInvitedMembers = () => {
  const { user } = useContext(AuthContext)
  const { group: { owner: groupOwner }, refreshDet: refresh } = useContext(GroupContext);

  const { id } = useParams();
  const [invitedUsers, setInvitedUsers] = useState<UserType[]>([]);
  
  function removeInvite(user_id: string) {
    const group_id = id || '';
    inviteOrRejectInvite({ user_id, group_id, actionType: 'remove' });
  }

  useEffect(() => {
    fetchGroupMembers({ group_id: id, user_id: user.id, fetchType: 'invites' })
      .then(res => setInvitedUsers(res))
      .catch()
  }, [id, refresh]);

  if (!groupOwner) return <Navigate to={`/groups/group/${id}`} />
  
  return (
    <div className="group-members-page p-4">
      <h3 className="font-bold text-2xl">Invited Members</h3>
      <ul className="container mt-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {
          invitedUsers.map( (invitedMember) => (
            <li key={invitedMember.id} className="group-member">
              <GroupMember removeInvite={() => removeInvite(invitedMember.id)} {...invitedMember} />
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default GroupInvitedMembers
