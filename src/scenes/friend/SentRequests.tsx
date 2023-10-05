import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/authContext'
import { friendContext } from '../../pages/friends';
import { FriendCard } from '../../components/cards';
import { FriendType } from '../../types/friend.types';
import { fetchUsers } from '../../utils/friend';

const SentRequests = () => {
  const { user } = useContext(AuthContext)
  const { refresh } = useContext(friendContext)

  const [requests, setRequests] = useState<FriendType[]>([])

  useEffect(() => {
    fetchUsers(user.id, 'sent')
      .then(res => setRequests(res as FriendType[]))
      .catch(error => alert(error))
  }, [refresh])

  return (
    <div className="menu">
      <div className="menu-title">
        <h3>Sent Requests</h3>
      </div>

      <div className="container">
        {
          requests.map(request => <FriendCard {...request} key={request.id} type="sent" />)
        }
      </div>
    </div>
  )
}

export default SentRequests
