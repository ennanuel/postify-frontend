import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/authContext'
import { KeyboardArrowDown, Search } from '@mui/icons-material';
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
      <div className="flex items-center justify-between mt-4">
        <h3 className="font-bold text-3xl">Friends</h3>
        <p className='text-sm opacity-80'>{friends.length} Friend{friends.length === 1 ? '' : 's'}</p>
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center pl-2 rounded-[20px] bg-white/5">
          <label htmlFor="flex items-center justify-center">
            <Search />
          </label>
          <input className="h-[40px] px-2 border-none outline-none" type="text" id="search" placeholder="Search Friends" />
        </div>
        <button className="h-[34px] pl-2 pr-3 gap-1 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-sm">
          <KeyboardArrowDown />
          <span>Sort</span>
        </button>
      </div>

      <ul className="container">
        { friends.map((friend) => <FriendCard {...friend} key={friend.id} />) }
      </ul>
    </div>
  )
}

export default Friends
