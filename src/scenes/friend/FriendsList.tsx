import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext'
import { friendContext } from '../../pages/friends';
import { FriendCard } from '../../components/cards';
import { FriendType } from '../../types/friend.types';
import { fetchUsers } from '../../utils/friend';

const Friends = () => {
  const { user } = useContext(AuthContext)
  const { refresh } = useContext(friendContext)

  const [{ received, suggestions }, setUsers] = useState<{ received: FriendType[], suggestions: FriendType[] }>({
    received: [],
    suggestions: []
  })

  useEffect(() => {
    ['received', 'suggestions'].forEach(
      (type) => {
        fetchUsers(user.id, type as 'received' | 'suggestions')
          .then(res => setUsers(prev => ({ ...prev, [type]: res as FriendType[] })))
          .catch(error => alert(error));
      }
    )
  }, [refresh])

  return (
    <div className="friends">
      <div className="menu">
      <div className="flex items-center justify-between mt-4">
        <h3 className="font-bold text-3xl">Friend Requests</h3>
        <Link to="/friends/requests" className='text-sm opacity-80'>more</Link>
      </div>

        <div className="container min-h-[30vh]">
        { received.map(friend => <FriendCard {...friend} key={friend.id} />) }
        </div>
      </div>

      <div className="menu">
        <div className="flex items-center justify-between mt-4">
          <h3 className="font-bold text-3xl">Suggestions</h3>
          <Link to="/friends/suggestions" className='text-sm opacity-80'>more</Link>
        </div>

        <div className="container">
          {
            suggestions.map(friend => <FriendCard {...friend} key={friend.id} />)
          }
        </div>
      </div>

    </div>
  )
}

export default Friends
