import { useState, useContext, useEffect } from 'react'
import { APIURL } from '../../assets/data';
import { AuthContext } from '../../context/authContext'

type FriendType = {
  id: string;
  name: string;
  profile_pic: string;
  mutual_friends: [];
}

const FriendSuggestions = () => {
  const { user } = useContext(AuthContext);

  const [suggestions, setSuggestions] = useState<FriendType[]>([])
  const [filters, setFilters] = useState<string[]>([])

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

  useEffect(() => {getFriendSuggestions()}, [])

  return (
    <div className="menu">
      <div className="menu-title">
        <h3>Suggested Friends</h3>
      </div>

      <div className="container">
        {
          suggestions.filter( friend => !filters.includes(friend.id) ).map( friend => (   
            <div key={friend.id} className="friend">
              <img src="" alt="" className='profile-pic' />
              <div className="info">
                <p className="name">{friend.name}</p>
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
              <button onClick={() => sendRequest(friend.id)}>Add Friend</button>
              <button onClick={() => setFilters( prev => [...prev, friend.id])}>Remove</button>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default FriendSuggestions
