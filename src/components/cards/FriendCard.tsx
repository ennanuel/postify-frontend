import { useContext, useState, useMemo } from 'react';
import { addOrRemoveFriend, sendOrDeclineRequest } from '../../utils/friend';
import { APIURL } from '../../assets/data';
import { AuthContext } from '../../context/authContext'
import { FriendType } from '../../types/friend.types';

const FriendCard = ({ id, profile_pic, name, mutual_pics, is_friend, is_sent_request, is_received_request, active }: FriendType) => {
  const [hide, setHide] = useState(false);
  const { user } = useContext(AuthContext);
  const sendFriendRequest = useMemo(() => function () { sendOrDeclineRequest({ user_id: user.id, other_user_id: id, actionType: 'add' }) }, []);
  const declineFriendRequest = useMemo(() => function () { sendOrDeclineRequest({ user_id: user.id, other_user_id: id, actionType: 'remove' }) }, []);
  const acceptFriendRequest = useMemo(() => function () { addOrRemoveFriend({ user_id: user.id, other_user_id: id, actionType: 'add' }) }, []);
  const unfriend = useMemo(() => function () { addOrRemoveFriend({ user_id: user.id, other_user_id: id, actionType: 'remove' }) }, []);

  if (hide) return;

  return (
    <div key={id} className="friend rounded-md overflow-clip">
      <img src={`${APIURL}/image/profile_pics/${profile_pic}`} alt="" className='w-full aspect-square' />
      <div className="info p-2">
        <p className="truncate">{name}</p>
          <div className="flex items-center gap-1">
            {
            is_friend ?
              active &&
                <>
                  <div className="dot w-1 h-1 rounded-full"></div>
                  <p className="close">Active</p>
                </> :
                (mutual_pics && mutual_pics?.length > 0) &&
                  <>
                    <ul className="flex items-center">
                  {
                    mutual_pics.map(pic => (
                      <li className="friend-list w-[20px] aspect-square rounded-full">
                        <img src={`${APIURL}/image/profile_pics/${pic}`} className="w-full h-full" />
                      </li>
                    ))
                  }
                    </ul>
                    <p>{ mutual_pics.length } Mutual Friends</p>
                  </>
            }
          </div>
      </div>
      <div className='flex flex-col gap-2 p-2 pt-0'>
        {
          is_sent_request ?
            <button onClick={declineFriendRequest} className="cancel">Remove</button> :
            is_friend ?
              <>
              <button>Message</button>
              <button onClick={unfriend}>Unfriend</button>
              </> :
              is_received_request ?
                <>
                <button className='accept' onClick={acceptFriendRequest}>Accept</button>
                <button onClick={declineFriendRequest}>Decline</button>
                </> :
                <>
                <button onClick={sendFriendRequest}>Add Friend</button>
                <button onClick={() => setHide(true)}>Remove</button>
                </>
      }
      </div>
    </div>
  )
}

export default FriendCard
