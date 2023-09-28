import { Person, Message, KeyboardArrowDown, MoreHoriz, EditRounded } from "@mui/icons-material"
import { useContext } from "react"
import { NavLink, Link } from "react-router-dom"
import { ProfileContext } from "."
import { APIURL } from "../../assets/data"

const DetailsHeader = () => {
  const { id, name, username, profile_pic, cover, user_friends, mutual_pics, mutual_friends, is_user, is_friend } = useContext(ProfileContext);

  return (
    <>
      <div className="header w-full px-[15%] pb-6">
        <img src={`${APIURL}/image/covers/${cover}`} alt="" className="cover h-[200px] w-full rounded-b-[10px] mt-[-4px]" />
        <div className="profile-details flex items-center gap-[15px] px-[20px]">
          <img src={`${APIURL}/image/profile_pics/${profile_pic}`} alt="" className="profile-img h-[150px] aspect-square rounded-full mt-[-40px]" />
          <div className="profile-info flex-1">
            <h2 className="text-[2rem]">
              <span className="font-bold">{name}</span>
              <span> ({username})</span>
              {
                is_user &&
                <Link to={`/edit_profile/${id}`} className="float-right flex items-center justify-center h-[40px] aspect-square rounded-lg bg-white/10 text-white">
                  <EditRounded />
                </Link>
              }
            </h2>
            {
              !is_user &&
              <div className="mutual-friends flex items-center gap-[5px]">
                <span className="text-sm">{user_friends} Friends</span>
                <span className="dot"></span>
                <span className="text-sm">{mutual_friends} Mutual</span>
              </div>
            }
            <div className="friends flex items-center justify-between gap-[10px]">
              <ul className="friends-container flex items-center">
                {
                  mutual_pics?.map((pic, i) => <li key={i} className="friend w-[34px] aspect-square rounded-full"><img src={pic} /></li>)
                }
              </ul>
              <div className="friend-options flex items-center gap-[15px]">
                {
                  is_friend ?
                    <>
                    <button className="flex items-center justify-center gap-[5px] px-[10px] h-[35px] rounded-[8px] shadow-lg">
                      <Message />
                      <span>Message</span>
                    </button>
                    <button className="flex items-center justify-center gap-[5px] px-[10px] h-[35px] rounded-[8px] shadow-lg">
                      <KeyboardArrowDown />
                    </button>
                    </> :
                    !is_user &&
                    <button className="flex items-center justify-center gap-[5px] px-[10px] h-[35px] rounded-[8px] shadow-lg">
                      <Person />
                      <span>Add Friend</span>
                    </button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sections sticky top-[60px] px-[13%] flex items-center justify-between">
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
    </>
  )
}

export default DetailsHeader
