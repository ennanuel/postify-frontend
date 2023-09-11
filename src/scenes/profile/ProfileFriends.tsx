import { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../../context/authContext'
import { Link, useParams } from 'react-router-dom'
import { APIURL } from '../../assets/data'
import { ProfileContext } from '../../pages/profile'

type UserType = {
  user_id: string;
  name: string;
  profile_pic: string;
  mutual_pics: string[];
  is_user: boolean;
  is_mutual: boolean;
}

const ProfileFriends = () => {
  const { user_friends, mutual_friends } = useContext(ProfileContext)
  const { user, socket } = useContext(AuthContext)
  const { id } = useParams();
  const [friends, setFriends] = useState<UserType[]>([])
  
  async function fetchUserFriends() {
    const response = await fetch(`${APIURL}/user/friends/${id}?other_user=${user.id}`)
    if (response.status !== 200) return alert('something went wrong');
    const res = await response.json();
    setFriends(res);
  }

  async function sendRequest( user_id : string ) {
    socket.emit('friend-action', { user_id: user.id, other_user_id: user_id }, 'send')
  }

  useEffect(() => {
    fetchUserFriends()
  }, [])
  
  return (
    <div className='profile-friends'>
      <div className="top">
        <h3 className="font-bold text-lg">Friends</h3>
        <div className="friend-count">
            <p>{ user_friends } Friends</p>
            <div className="dot"></div>
            <p>{ mutual_friends } Mutual</p>
        </div>
      </div>

      <div className="container">
        {
          friends.map( ({ user_id, name, profile_pic, mutual_pics, is_user, is_mutual }) => (
            <div key={user_id} className="friend">
              <img src={profile_pic}  alt="" className='profile-pic' />
              <div className="info">
                <p className="name">{ is_user ? 'You' : name }</p>
                  <div className="mutual">
                    <ul className="friends-list">
                    {
                      mutual_pics?.map( (pic, i) => <li key={i} className="friend-list"><img src={pic} /></li>)
                    }
                    </ul>
                    {(!is_user && mutual_pics.length > 0) && <p>{ mutual_pics?.length } Mutual Friends</p>}
                  </div>
                </div>
              <button onClick={() => !is_mutual && sendRequest(user_id)}>{ is_mutual ? 'Message' : 'Add Friend' }</button>
              <Link to={`/profile/${user_id}`}>View Profile</Link>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default ProfileFriends
