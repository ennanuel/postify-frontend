import { useState, createContext, useEffect, useContext } from 'react';
import DetailsHeader from './DetailsHeader';
import { Outlet, useParams } from 'react-router-dom';
import { APIURL } from '../../assets/data';
import { AuthContext } from '../../context/authContext';
import './profile.scss';

type ProfileType = {
  id: string;
  name: string;
  username: string;
  profile_pic: string;
  cover: string;
  user_friends: number;
  mutual_pics: string[];
  mutual_friends: number;
  is_user: boolean;
}

export const ProfileContext = createContext<ProfileType>({} as ProfileType)

const Profile = () => {
  const { user, socket,getIds } = useContext(AuthContext)
  const { id } = useParams()
  const [profile, setProfile] = useState({} as ProfileType);
  
  async function getUserProfile() {
    const response = await fetch(`${APIURL}/user/${id}?other_user=${user.id}`)
    if (response.status !== 200) return alert('something went wrong');
    const res = await response.json();
    setProfile(res);
  }

  useEffect(() => {
    getUserProfile();
  }, [id])

  useEffect(() => { 
    socket.on('friend-event', ({ users } : { users: string[] }) => {
      if (users.includes(user.id)) {
        getIds('friend')
        getUserProfile()
      };
    })

    socket.on('post-event', ({ user_id }) => {
      if(user_id === user.id) alert('This user posted something')
    })
  }, [socket])
  
  return (
    <div className="profile">
      <ProfileContext.Provider value={profile}>
        <DetailsHeader />
        <div className="content">
          <Outlet />
        </div>
      </ProfileContext.Provider>
    </div>
  )
}

export default Profile
