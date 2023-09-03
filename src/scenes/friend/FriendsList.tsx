import { useState, useEffect, useContext } from 'react'
import { APIURL } from '../../assets/data'
import { AuthContext } from '../../context/authContext'

type FriendType = {
  id: string;
  name: string;
  profile_pic: string;
  mutual_friends: [];
}

const Friends = () => {
  const { user } = useContext(AuthContext)

  const [requests, setRequests] = useState<FriendType[]>([])
  const [suggestions, setSuggestions] = useState<FriendType[]>([])
  const [filters, setFilters] = useState<string[]>([]);

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

  const getFriendSuggestions = async () => {
    const response = await fetch(`${APIURL}/friend/suggestions/${user.id}`)
    if(response.status !== 200) {
      alert('something went wrong');
      return;
    } else {
      const res = await response.json();
      setSuggestions(res)
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

  const sendRequest = async (other_user_id : string) => {
    const requestBody = { user_id: user.id, other_user_id };

    const fetchOptions = {
      method: "PUT",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      }
    }

    const response = await fetch(`${APIURL}/friend/send`, fetchOptions);

    if(response.status !== 200) {
      alert('something went wrong')
    } else {
      alert('request sent')
    }
  }

  useEffect(() => {
    getFriendRequests();
    getFriendSuggestions();
  }, [])

  return (
    <div className="friends">
      <div className="menu">
        <div className="menu-title">
          <h3>Friend Requests</h3>
            <p>See all</p>
        </div>

        <div className="container">
        {
          requests.map( (request, i) => (
            <div key={i} className="friend">
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

      <div className="menu">
        <div className="menu-title">
          <h3>Suggested Friends</h3>
            <p>See all</p>
        </div>

        <div className="container">
          {
            suggestions.filter( elem => !filters.includes(elem.id) ).map( (suggestion, i) => (
              <div key={i} className="friend">
                <img src="" alt="" className='profile-pic' />
                <div className="info">
                  <p className="name">{suggestion.name}</p>
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
                <button onClick={() => sendRequest(suggestion.id)}>Add Friend</button>
                <button onClick={() => setFilters( prev => [...prev, suggestion.id])}>Remove</button>
              </div>
            ))
          }
        </div>
      </div>

    </div>
  )
}

export default Friends
