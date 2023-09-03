import { MoreHoriz } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { APIURL } from '../../assets/data';

type FriendType = {
  id: string;
  name: string;
  profile_pic: string;
  active: string;
}

type CustomGroupType = {
  id: string;
  group_name: string;
}

const CustomListSingle = () => {
  const [groupInfo, setGroupInfo] = useState<CustomGroupType>({ id: '', group_name: '' })
  const [friends, setFriends] = useState<FriendType[]>([]);
  const { id } = useParams()

  const getCustomGroupInfo = async () => {
      const response = await fetch(`${APIURL}/friend/group/${id}`)

      if(response.status !== 200) return alert('something went wrong')

      const res = await response.json();
      setGroupInfo(res)
  }

  const getCustomGoupFriends = async () => {
      const response = await fetch(`${APIURL}/friend/group/friends/${id}`)

      if(response.status !== 200) return alert('something went wrong')

      const res = await response.json();
      setFriends(res)
  }

  useEffect( () => {
    getCustomGroupInfo();
    getCustomGoupFriends();
  }, [id])

  return (
    <div className="menu">
      <div className="menu-title">
        <h3>{ groupInfo.group_name }</h3>
        <button className="more create-btn"><MoreHoriz /></button>
      </div>

      <div className="container">
        {
          friends.map( ({id, name, profile_pic, active}) => (
            <div key={id} className="friend">
              <img src={profile_pic} alt="" className='profile-pic' />
              <div className="info">
                <p className="name">{name}</p>
                <div className="mutual">
                  <div className="dot"></div>
                  <p className="close">Active</p>
                </div>
              </div>
              <button>Send Message</button>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default CustomListSingle
