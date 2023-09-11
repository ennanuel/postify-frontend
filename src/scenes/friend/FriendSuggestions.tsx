import { useState, useContext, useEffect } from 'react'
import { APIURL } from '../../assets/data';
import { AuthContext } from '../../context/authContext'
import { friendContext } from '../../pages/friends';

type FriendType = {
  id: string;
  name: string;
  profile_pic: string;
  mutual_pics: string[];
}

const FriendSuggestions = () => {
  const { user, socket } = useContext(AuthContext);
  const { refresh } = useContext(friendContext);

  const [suggestions, setSuggestions] = useState<FriendType[]>([])
  const [filters, setFilters] = useState<string[]>([])

  const getFriendSuggestions = async () => {
    const response = await fetch(`${APIURL}/friend/requests/${user.id}?type=suggestions`)
    if(response.status !== 200) {
      alert('something went wrong');
      return;
    } else {
      const res = await response.json();
      setSuggestions(res)
    }
  }
  const sendRequest = async (other_user_id: string) => {
    socket.emit('friend-action', { user_id: user.id, other_user_id }, 'send')
  }

  useEffect(() => {
    getFriendSuggestions()
  }, [refresh])

  return (
    <div className="menu">
      <div className="menu-title">
        <h3>Suggested Friends</h3>
      </div>

      <div className="container">
        {
          suggestions
            .filter(friend => !filters.includes(friend.id))
            .map(({ id, name, profile_pic, mutual_pics }) => (   
            <div key={id} className="friend">
              <img src={profile_pic} alt="" className='profile-pic' />
              <div className="info">
                <p className="name">{name}</p>
                {
                  mutual_pics.length > 0 &&
                    <div className="mutual">
                      <ul className="friends-list">
                      {
                        mutual_pics.map(pic => <li className="friend-list"><img src={pic} /></li> )
                      }
                      </ul>
                      <p>{ mutual_pics.length } Mutual Friends</p>
                    </div>
                }
              </div>
              <button onClick={() => sendRequest(id)}>Add Friend</button>
              <button onClick={() => setFilters( prev => [...prev, id])}>Remove</button>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default FriendSuggestions
