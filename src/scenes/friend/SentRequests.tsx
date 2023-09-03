import { useState, useEffect, useContext } from 'react'
import { APIURL } from '../../assets/data'
import { AuthContext } from '../../context/authContext'

type FriendType = {
  id: string;
  name: string;
  profile_pic: string;
  mutual_friends: [];
}

const SentRequests = () => {
  const [requests, setRequests] = useState<FriendType[]>([])
  const { user } = useContext(AuthContext)


  const getSentRequests = async () => {
    const response = await fetch(`${APIURL}/friend/sent/${user.id}`)
    if(response.status !== 200) {
      alert('something went wrong');
      return;
    } else {
      const res = await response.json();
      setRequests(res)
    }
  }


  const removeRequest = async (other_user_id : string) => {
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

  useEffect(() => {getSentRequests()}, [])

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
