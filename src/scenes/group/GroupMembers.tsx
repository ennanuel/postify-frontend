import { useState, useContext, useEffect } from 'react'
import { KeyboardArrowDown, Search } from '@mui/icons-material'
import { useParams } from 'react-router-dom'
import { APIURL } from '../../assets/data'
import { AuthContext } from '../../context/authContext'
import { GroupContext } from '../../pages/group'
import { fetchOptions } from '../../assets/data/data'

type UserType = {
  id: string;
  name: string;
  profile_pic: string;
  owner: string;
}

const GroupMembers = () => {
  const { user, socket } = useContext(AuthContext)
  const { group: { owner: groupOwner }, refreshDet: refresh } = useContext(GroupContext);

  const { id } = useParams()
  const [groupMembers, setGroupMembers] = useState<UserType[]>([])

  const removeUser = async (user_id: string) => {
    socket.emit('group-action', { user_id, group_id: id }, 'remove')
  }

  const fetchGroupMembers = async () => {
    const response = await fetch(`${APIURL}/group/members/${id}`, fetchOptions)
    if (response.status !== 200) return alert('something went wrong')
    const res = await response.json();
    setGroupMembers(res);
  }

  useEffect(() => {
    fetchGroupMembers()
  }, [refresh])
  
  return (
    <div className="group-members-page p-4">
      <div className="search">
        <Search />
        <input type="text" placeholder="Search group members" />
      </div>
      <div className="menu-top">
        <h3 className="font-bold text-xl">Group Members</h3>
        <button>
          <span>Filter</span>
          <KeyboardArrowDown />
        </button>
      </div>
      <ul className="container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
        {
          groupMembers.map( ({ id, name, profile_pic, owner }) => (
            <li key={id} className="group-member">
              <img src={profile_pic} alt="" />
              <div className="bottom-info">
                <p className="member-info">
                  <span className="role">{owner ? 'Admin' : 'Member'}</span>
                  <span>{ id === user.id ? 'You' : name }</span>
                </p>
                <button>Add Friend</button>
                <button
                  onClick={() => (groupOwner && !owner) && removeUser(id)}
                >{groupOwner && !owner ? 'Remove' : 'View Profile'}</button>
              </div>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default GroupMembers
