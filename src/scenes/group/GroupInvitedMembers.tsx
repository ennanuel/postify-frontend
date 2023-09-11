import { useState, useContext, useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { APIURL } from '../../assets/data'
import { AuthContext } from '../../context/authContext'
import { GroupContext } from '../../pages/group'

type UserType = {
  id: string;
  name: string;
  profile_pic: string;
  owner: string;
}

const GroupInvitedMembers = () => {
  const { user, socket } = useContext(AuthContext)
  const { group: { owner: groupOwner }, refreshDet: refresh } = useContext(GroupContext);

  const { id } = useParams()
  const [invitedUsers, setInvitedUsers] = useState<UserType[]>([])

  if (!groupOwner) return <Navigate to={`/groups/group/${id}`} />

  const removeInvite = async (user_id: string) => {
    socket.emit( 'group-action', { user_id, group_id: id }, 'decline' )
  }

  const fetchGroupMembers = async () => {
    const response = await fetch(`${APIURL}/group/members/${id}?type=invites`)
    if (response.status !== 200) return alert('something went wrong')
    const res = await response.json();
    setInvitedUsers(res);
  }

  useEffect(() => {
    fetchGroupMembers()
  }, [id, refresh])
  
  return (
    <div className="group-members-page">
      <h3 className="font-bold text-xl mt-4">Invited Members</h3>
      <ul className="container">
        {
          invitedUsers.map( ({ id, name, profile_pic, owner }) => (
            <li key={id} className="group-member">
              <img src={profile_pic} alt="" />
              <div className="bottom-info">
                <p className="member-info">
                  <span className="role">{owner ? 'Admin' : 'Member'}</span>
                  <span>{ id === user.id ? 'You' : name }</span>
                </p>
                <button
                  onClick={() => removeInvite(id)}
                >Remove Invite</button>
              </div>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default GroupInvitedMembers
