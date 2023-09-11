import { useState, useEffect, useContext } from 'react'
import { APIURL } from '../../assets/data'
import { AuthContext } from '../../context/authContext'
import { friendContext } from '../../pages/friends';

type FriendType = {
  id: string;
  name: string;
  profile_pic: string;
  mutual_pics: string[];
}

type UsersType = {
  received: FriendType[];
  suggestions: FriendType[];
}

const Friends = () => {
  const { user, socket } = useContext(AuthContext)
  const { refresh } = useContext(friendContext)

  const [{ received, suggestions }, setUsers] = useState<UsersType>({ received: [], suggestions: [] })
  const [filters, setFilters] = useState<string[]>([]);

  const getUsers = async (type : string) => {
    const response = await fetch(`${APIURL}/friend/requests/${user.id}?type=${type}`)
    if(response.status !== 200) {
      alert('something went wrong');
      return;
    } else {
      const res = await response.json();
      setUsers(prev => ({ ...prev, [type]: res }))
    }
  }

  const requestAction = async (other_user_id : string, type: string) => {
    socket.emit('friend-action', { user_id: user.id, other_user_id }, type)
  }

  useEffect(() => {
    getUsers('received');
    getUsers('suggestions');
  }, [refresh])

  return (
    <div className="friends">
      <div className="menu">
        <div className="menu-title">
          <h3>Friend Requests</h3>
            <p>See all</p>
        </div>

        <div className="container">
        {
          received.map( ({ id, profile_pic, name, mutual_pics }) => (
            <div key={id} className="friend">
              <img src={profile_pic} alt="" className='profile-pic' />
              <div className="info">
                <p className="name">{ name }</p>
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
              <button className='accept' onClick={() => requestAction(id, 'accept')}>Accept</button>
              <button onClick={() => requestAction(id, 'decline')}>Decline</button>
            </div>
          ))
        }
        </div>
      </div>

      <div className="menu">
        <div className="menu-title">
          <h3>Suggested Friends</h3>
            <p>See all</p>
        </div>

        <div className="container">
          {
            suggestions.filter( elem => !filters.includes(elem.id) ).map( ({ id, name, profile_pic, mutual_pics }) => (
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
                <button onClick={() => requestAction(id, 'send')}>Add Friend</button>
                <button onClick={() => setFilters( prev => [...prev, id])}>Remove</button>
              </div>
            ))
          }
        </div>
      </div>

    </div>
  )
}

export default Friends
