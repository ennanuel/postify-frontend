import { useState, useEffect, useContext } from 'react'
import { APIURL } from '../../assets/data'
import { AuthContext } from '../../context/authContext'

type FriendType = {
  id: string;
  name: string;
  profile_pic: string;
  mutual_friends: [];
}

const FriendRequests = () => {
  const { user } = useContext(AuthContext);
  const [requests, setRequests] = useState<FriendType[]>([])


  const getFriendRequests = async () => {
    const response = await fetch(`${APIURL}/friend/received/${user.id}`)
    if(response.status !== 200) {
      alert('something went wrong');
      return;
    } else {
      const res = await response.json();
      setRequests(res)
    }
  }


  const acceptRequest = async (other_user_id : string) => {
    const requestBody = { user_id: user.id, other_user_id };

    const fetchOptions = {
      method: "PUT",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      }
    }

    const response = await fetch(`${APIURL}/friend/accept`, fetchOptions);

    if(response.status !== 200) {
      alert('something went wrong')
    } else {
      alert('request accepted')
    }
  }


  const declineRequest = async (other_user_id : string) => {
    const requestBody = { user_id: user.id, other_user_id };

    const fetchOptions = {
      method: "DELETE",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      }
    }

    const response = await fetch(`${APIURL}/friend/remove`, fetchOptions);

    if(response.status !== 200) {
      alert('something went wrong')
    } else {
      alert('request declined')
    }
  }

  useEffect(() => {getFriendRequests()}, [])

  return (
    <div className="menu">
      <div className="menu-title">
        <h3>Friend Requests</h3>
          <p>See all</p>
      </div>

      <div className="container">
        {
          requests.map( request => (
            <div className="friend">
              <img src="" alt="" className='profile-pic' />
              <div className="info">
                <p className="name">{ request.name }</p>
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
              <button className='accept' onClick={() => acceptRequest(request.id)}>Accept</button>
              <button onClick={() => declineRequest(request.id)}>Decline</button>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default FriendRequests
