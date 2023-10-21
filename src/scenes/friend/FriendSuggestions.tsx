import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../../context/authContext'
import { friendContext } from '../../pages/friends';
import { FriendCard } from '../../components/cards';
import { FriendType } from '../../types/friend.types';
import { fetchUsers } from '../../utils/friend';

const FriendSuggestions = () => {
  const { user } = useContext(AuthContext);
  const { refresh } = useContext(friendContext);
  const [suggestions, setSuggestions] = useState<FriendType[]>([])

  useEffect(() => {
    fetchUsers(user.id, 'suggestions')
      .then(res => setSuggestions(res as FriendType[]))
      .catch(error => alert(error));
  }, [refresh])

  return (
    <div className="menu">
      <h3 className="font-bold text-3xl mt-4">Suggestions</h3>
      <div className="container">
        { suggestions.map(friend => <FriendCard {...friend} key={friend.id} />) }
      </div>
    </div>
  )
}

export default FriendSuggestions
