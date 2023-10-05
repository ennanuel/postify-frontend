import { useContext, useState } from 'react';
import { friendAction } from '../../utils/friend';
import { APIURL } from '../../assets/data';
import { AuthContext } from '../../context/authContext'
import { FriendType } from '../../types/friend.types';

const FriendCard = ({ id, profile_pic, name, mutual_pics, type, active }: FriendType) => {
  const [hide, setHide] = useState(false);
  const { user, socket } = useContext(AuthContext);
  function sendFriendRequest() { friendAction(user.id, id, 'send', socket) };
  function declineFriendRequest() { friendAction(user.id, id, 'decline', socket) };
  function acceptFriendRequest() { friendAction(user.id, id, 'accept', socket) };
  function unfriend() { friendAction(user.id, id, 'unfriend', socket) };

  if (hide) return;

  return (
    <div key={id} className="friend rounded-md overflow-clip">
          <img src={`${APIURL}/image/profile_pics/${profile_pic}`} alt="" className='w-full aspect-square' />
          <div className="info p-2">
          <p className="name">{name}</p>
          <div className="flex items-center gap-1">
            {
            type === 'friend' ?
              true &&
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
          type === 'sent' ?
            <button onClick={declineFriendRequest} className="cancel">Cancel Request</button> :
            type === 'friend' ?
              <>
              <button>Send Message</button>
              <button onClick={unfriend}>Unfriend</button>
              </> :
              type === 'received' ?
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
