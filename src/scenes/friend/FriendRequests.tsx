import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/authContext';
import { friendContext } from '../../pages/friends';
import { FriendCard } from '../../components/cards';
import { fetchUsers } from '../../utils/friend';
import { FriendType } from '../../types/friend.types';

const FriendRequests = () => {
  const { user } = useContext(AuthContext);
  const { refresh } = useContext(friendContext);

  const [requests, setRequests] = useState<FriendType[]>([]);

  useEffect(() => {
    fetchUsers(user.id, 'received')
      .then(res => setRequests(res as FriendType[]))
      .catch(error => alert(error));
  }, [ refresh ])

  return (
    <div className="menu">
      <div className="menu-title">
        <h3>Friend Requests</h3>
          <p>See all</p>
      </div>

      <div className="container">
        {
          requests.map((friend) => <FriendCard {...friend} key={friend.id} type="received" />)
        }
      </div>
    </div>
  )
}

export default FriendRequests
