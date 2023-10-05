import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/authContext'
import { Search, SortRounded } from '@mui/icons-material';
import { friendContext } from '../../pages/friends';
import { FriendCard } from '../../components/cards';
import { FriendType } from '../../types/friend.types';
import { fetchFriends } from '../../utils/friend';

const Friends = () => {
  const { refresh } = useContext(friendContext);
  const { user } = useContext(AuthContext)
  const [friends, setFriends] = useState<FriendType[]>([])

  useEffect(() => {
    fetchFriends(user.id)
      .then(res => setFriends(res as FriendType[]))
      .catch(error => alert(error));
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
        { friends.map((friend) => <FriendCard {...friend} key={friend.id} type="friend" />) }
      </div>
    </div>
  )
}

export default Friends
