import { useState, useEffect, useContext } from 'react'
import { APIURL } from '../../assets/data'
import { AuthContext } from '../../context/authContext'
import { friendContext } from '../../pages/friends';
import { fetchOptions } from '../../assets/data/data';

type FriendType = {
  id: string;
  name: string;
  profile_pic: string;
  mutual_pics: string[];
}

const FriendRequests = () => {
  const { user, socket } = useContext(AuthContext);
  const { refresh } = useContext(friendContext);

  const [requests, setRequests] = useState<FriendType[]>([])


  async function getFriendRequests() {
    const response = await fetch(`${APIURL}/friend/requests/${user.id}?type=received`, fetchOptions)

    if(response.status !== 200) {
      alert('something went wrong');
      return;
    } else {
      const res = await response.json();
      setRequests(res)
    }
  }


  async function requestAction(other_user_id : string, type: string) {
    socket.emit('friend-action', { user_id: user.id, other_user_id }, type);
  }

  useEffect(() => {
    getFriendRequests()
  }, [ refresh ])

  return (
    <div className="menu">
      <div className="menu-title">
        <h3>Friend Requests</h3>
          <p>See all</p>
      </div>

      <div className="container">
        {
          requests.map( ({ id, name, profile_pic, mutual_pics }) => (
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
              <button className='accept' onClick={() => requestAction(id, 'accept')}>Accept</button>
              <button onClick={() => requestAction(id, 'decline')}>Decline</button>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default FriendRequests
