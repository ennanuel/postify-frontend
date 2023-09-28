import { useState, useEffect, useContext } from 'react'
import { APIURL } from '../../assets/data'
import { AuthContext } from '../../context/authContext'
import { Search, SortRounded } from '@mui/icons-material';
import { friendContext } from '../../pages/friends';
import { fetchOptions } from '../../assets/data/data';

type FriendType = {
  id: string;
  name: string;
  profile_pic: string;
  mutual_friends: [];
}

const Friends = () => {
  const { refresh } = useContext(friendContext);
  const { user, socket } = useContext(AuthContext)
  
  const [friends, setFriends] = useState<FriendType[]>([])

  async function getFriends() {
    const response = await fetch(`${APIURL}/friend/${user.id}`, fetchOptions)
    if(response.status !== 200) {
      alert('something went wrong');
      return;
    } else {
      const res = await response.json();
      setFriends(res)
    }
  }

  async function unFriend(other_user_id: string) {
    socket.emit('friend-action', { user_id: user.id, other_user_id }, 'unfriend')
  }

  useEffect(() => {
    getFriends();
  }, [refresh])

  return (
    <div className="menu">
      <div className="filter-search">
        <div className="search">
          <label htmlFor="search">
            <Search />
          </label>
          <input type="text" id="search" placeholder="Search Friends" />
        </div>
        <button className="sort h-full px-[15px] gap-1 rounded-md flex items-center justify-center text-sm">
          <SortRounded />
          <span>Sort</span>
        </button>
      </div>
      <div className="menu-title">
        <h3>Friends</h3>
        <div className="count">
          <p>{friends.length} Friends</p>
        </div>
      </div>

      <div className="container">
        {
          friends.map( (friend) => (
            <div key={friend.id} className="friend">
              <img src={friend.profile_pic} alt="" className='profile-pic' />
              <div className="info">
                <p className="name">{friend.name}</p>
                <div className="mutual">
                  <div className="dot"></div>
                  <p className="close">Active</p>
                </div>
              </div>
              <button>Send Message</button>
              <button onClick={() => unFriend(friend.id)}>Unfriend</button>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Friends
