import { useState, useEffect, useContext } from 'react'
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
        <div className="menu-title">
          <h3>Friend Requests</h3>
            <p>See all</p>
        </div>

        <div className="container">
        { received.map(friend => <FriendCard {...friend} key={friend.id} type="received" />) }
        </div>
      </div>

      <div className="menu">
        <div className="menu-title">
          <h3>Suggested Friends</h3>
            <p>See all</p>
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
