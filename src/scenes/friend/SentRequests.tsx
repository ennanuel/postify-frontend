import { useState, useEffect, useContext } from 'react'
import { APIURL } from '../../assets/data'
import { AuthContext } from '../../context/authContext'
import { friendContext } from '../../pages/friends';

type FriendType = {
  id: string;
  name: string;
  profile_pic: string;
  mutual_friends: [];
}

const SentRequests = () => {
  const { user, socket } = useContext(AuthContext)
  const { refresh } = useContext(friendContext)

  const [requests, setRequests] = useState<FriendType[]>([])

  const getSentRequests = async () => {
    const response = await fetch(`${APIURL}/friend/requests/${user.id}?type=sent`)
    if(response.status !== 200) {
      alert('something went wrong');
      return;
    } else {
      const res = await response.json();
      setRequests(res)
    }
  }


  const removeRequest = async (user_id: string) => {
    socket.emit('friend-action', { user_id, other_user_id: user.id }, 'decline')
  }

  useEffect(() => {
    getSentRequests()
  }, [refresh])

  return (
    <div className="menu">
      <div className="menu-title">
        <h3>Sent Requests</h3>
      </div>

      <div className="container">
        {
          requests.map( request => (
            <div key={request.id} className="friend">
              <img src="" alt="" className='profile-pic' />
              <div className="info">
                <p className="name">{request.name}</p>
                <div className="mutual">
                  <ul className="friends-list">
                    <li className="friend-list"></li>
                    <li className="friend-list"></li>
                    <li className="friend-list"></li>
                    <li className="friend-list"></li>
                  </ul>
                  <p>3 Mutual Friends</p>
                </div>
              </div>
              <button onClick={() => removeRequest(request.id)} className="cancel">Cancel Request</button>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default SentRequests
