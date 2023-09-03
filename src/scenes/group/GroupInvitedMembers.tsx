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
  const { user } = useContext(AuthContext)
  const { owner:  groupOwner } = useContext(GroupContext);

  const { id } = useParams()
  const [invitedUsers, setInvitedUsers] = useState<UserType[]>([])

  if (!groupOwner) return <Navigate to={`/groups/group/${id}`} />

  const removeInvite = async (user_id: string) => {
    if (!groupOwner) return;
    const requestBody = { user_id, group_id: id }
    const fetchOptions = {
      method: "DELETE",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      }
    }

    const response = await fetch(`${APIURL}/invite/remove`, fetchOptions);
    if (response.status !== 200) return alert('something went wrong');
    alert('member removed!')
  }

  const fetchGroupMembers = async () => {
    const response = await fetch(`${APIURL}/group/members/invites/${id}`)
    if (response.status !== 200) return alert('something went wrong')
    const res = await response.json();
    setInvitedUsers(res);
  }

  useEffect(() => {
    fetchGroupMembers()
  }, [])
  
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
