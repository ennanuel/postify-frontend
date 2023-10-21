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
      <h3 className="font-bold text-3xl mt-4">Sent Requests</h3>

      <div className="container">
        {
          requests.map(request => <FriendCard {...request} key={request.id} />)
        }
      </div>
    </div>
  )
}

export default SentRequests
