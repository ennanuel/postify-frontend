import { Person, Message, KeyboardArrowDown, MoreHoriz } from "@mui/icons-material"
import { useContext } from "react"
import { NavLink } from "react-router-dom"
import { ProfileContext } from "."

const DetailsHeader = () => {
  const { id, name, username, profile_pic, cover, user_friends, mutual_pics, mutual_friends } = useContext(ProfileContext);

  return (
    <div className="header w-full px-[15%]">
      <img src={cover} alt="" className="cover h-[200px] w-full rounded-b-[10px] mt-[-4px]" />
      <div className="profile-details flex items-center gap-[15px] px-[20px]">
        <img src={profile_pic} alt="" className="profile-img h-[150px] aspect-square rounded-full mt-[-40px]" />
        <div className="profile-info flex-1">
          <h2 className="text-[2rem]">
            <span className="font-bold">{name}</span>
            <span>({username})</span>
          </h2>
          <div className="mutual-friends flex items-center gap-[5px]">
            <span className="text-sm">{user_friends} Friends</span>
            <span className="dot"></span>
            <span className="text-sm">{mutual_friends} Mutual</span>
          </div>
          <div className="friends flex items-center justify-between gap-[10px]">
            <ul className="friends-container flex items-center">
              {
                mutual_pics?.map((pic, i) => <li key={i} className="friend w-[34px] aspect-square rounded-full"><img src={pic} /></li>)
              }
            </ul>
            <div className="friend-options flex items-center gap-[15px]">
              <button className="flex items-center justify-center gap-[5px] px-[10px] h-[35px] rounded-[8px] shadow-lg">
                <Person />
                <span>Add Friend</span>
              </button>
              <button className="flex items-center justify-center gap-[5px] px-[10px] h-[35px] rounded-[8px] shadow-lg">
                <Message />
                <span>Message</span>
              </button>
              <button className="flex items-center justify-center gap-[5px] px-[10px] h-[35px] rounded-[8px] shadow-lg">
                <KeyboardArrowDown />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="sections flex items-center justify-between mt-[20px] mx-[15px]">
        <ul className="pages flex gap-[10px] items-center">
          <li>
            <NavLink to={`/profile/${id}`} className={({isActive}) => `${isActive && 'active-friend-link'} block p-[15px] relative text-center`}>Posts</NavLink>
          </li>
          <li>
            <NavLink to={`/profile/friends/${id}`} className={({isActive}) => `${isActive && 'active-friend-link'} block p-[15px] relative text-center`}>Friends</NavLink>
          </li>
          <li>
            <NavLink to={`/profile/photos/${id}`} className={({isActive}) => `${isActive && 'active-friend-link'} block p-[15px] relative text-center`}>Photos</NavLink>
          </li>
          <li>
            <NavLink to={`/profile/videos/${id}`} className={({isActive}) => `${isActive && 'active-friend-link'} block p-[15px] relative text-center`}>Videos</NavLink>
          </li> 
        </ul>
        <button><MoreHoriz /></button>
      </div>
    </div>
  )
}

export default DetailsHeader
