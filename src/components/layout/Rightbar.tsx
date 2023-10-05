import { useState, useEffect, useContext } from 'react';
import { APIURL } from "../../assets/data"
import { SearchOutlined, MoreHorizOutlined } from '@mui/icons-material';
import { AuthContext } from '../../context/authContext';
import { Link } from 'react-router-dom';
import { fetchOptions } from '../../assets/data/data';

type UserType = {
  id: string;
  name: string;
  profile_pic: string;
}

const Rightbar = () => {
  const { user } = useContext(AuthContext)
  const [friends, setFriends] = useState<UserType[]>([])

  useEffect(() => {
    const fetchFriends = async () => {
      const response = await fetch(`${APIURL}/friend/${user.id}`, fetchOptions)

      if(response.status != 200) return alert('something went wrong')

      const res = await response.json()
      setFriends(res)
    }
    fetchFriends()
  }, [])

  return (
    <div className="rightbar hidden lg:block sticky top-[70px] h-[calc(100vh-80px)] m-[10px] mt-0 rounded-md shadow-lg shadow-black-900/50 overflow-y-scroll overflow-x-clip">
    <div className="bar-actions flex items-center justify-between">
      <p>Friends</p>
      <div className="actions flex items-center">
        <SearchOutlined />
        <MoreHorizOutlined />
      </div>
    </div>
      <div className="container flex flex-col">
        {
          friends.map( ({ id, name, profile_pic }) => (
            <Link to={`/profile/${id}`} className="user flex items-center" key={id}>
              <img src={ profile_pic } alt={name} className="aspect-square rounded-full" />
              <span>{ name }</span>
              <div className="active-indicator aspect-square rounded-full"></div>
            </Link>
          ))
        }
      </div>
    </div>
  )
}

export default Rightbar
