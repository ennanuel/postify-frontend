import { Person, Message, KeyboardArrowDown, MoreHoriz, EditRounded } from "@mui/icons-material"
import { useContext } from "react"
import { NavLink, Link } from "react-router-dom"
import { ProfileContext } from "."
import { APIURL } from "../../assets/data"

const DetailsHeader = () => {
  const { id, name, username, profile_pic, cover, user_friends, mutual_pics, mutual_friends, is_user, is_friend } = useContext(ProfileContext);

  return (
    <>
      <div className="header w-full lg:px-[15%] pb-2 md:pb-6">
        <img src={`${APIURL}/image/covers/${cover}`} alt="" className="cover h-[200px] w-full rounded-b-md mt-[-4px]" />
        <div className="profile-details w-full flex flex-col lg:flex-row lg:items-center gap-3 px-4 lg:px-4">
          <img src={`${APIURL}/image/profile_pics/${profile_pic}`} alt="" className="profile-img w-[80px] lg:h-[150px] aspect-square rounded-full mt-[-40px]" />
          <div className="profile-info flex-1">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-2xl lg:text-[2rem]">
                <span className="font-bold">{name}</span>
                <span> ({username})</span>
              </h2>
              {
                is_user &&
                <Link to={`/edit_profile/${id}`} className="float-right flex items-center justify-center h-[40px] aspect-square rounded-lg bg-white/10 text-white">
                  <EditRounded />
                </Link>
              }
            </div>
            {
              !is_user &&
              <div className="mutual-friends flex items-center gap-[5px]">
                  <span className="text-sm">{user_friends} Friends</span>
                  {
                    !is_friend &&
                    <>
                      <span className="dot"></span>
                      <span className="text-sm">{mutual_friends} Mutual</span>
                    </>
                  }
              </div>
            }
            <div className="friends flex items-center justify-between gap-2 mt-2">
              {
                mutual_pics?.length > 0 &&
                  <ul className="friends-container flex items-center">
                    {
                      mutual_pics?.map((pic, i) => <li key={i} className="friend w-[34px] aspect-square rounded-full">
                        <img src={pic} />
                      </li>)
                    }
                  </ul>
              }
              <div className="friend-options flex items-center gap-3 justify-center">
                {
                  is_friend ?
                    <>
                    <button className="flex items-center justify-center gap-1 px-2 h-[35px] rounded-md shadow-lg">
                      <Message />
                      <span>Message</span>
                    </button>
                    <button className="flex items-center justify-center gap-1 px-2 h-[35px] rounded-md shadow-lg">
                      <KeyboardArrowDown />
                    </button>
                    </> :
                    !is_user &&
                    <button className="flex items-center justify-center gap-1 px-2 h-[35px] rounded-md shadow-lg">
                      <Person />
                      <span>Add Friend</span>
                    </button>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sections sticky top-[50px] md:top-[90px] lg:top-[60px] px-2 lg:px-[13%] flex items-center justify-between">
        <ul className="pages flex flex-1 gap-[10px] items-center text-sm overflow-x-scroll lg:overflow-clip overflow-y-clip lg:text-base">
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
