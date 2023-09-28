import { useContext } from "react";
import { leftNav } from "../../assets/data";
import NavItem from "./LeftNavItem";
import { AuthContext } from "../../context/authContext";
import { profile_pic } from "../../assets/images";
import { Logout } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Leftbar = () => {
  const { user } = useContext(AuthContext)

  return (
    <div className="leftbar flex-[2] flex flex-col sticky top-[60px] overflow-y-scroll">
      <div className="container flex-1 p-[10px]">
        <Link to={`/profile/${user.id}`} className="p-[10px] user flex items-center gap-[10px]">
          <img src={ user.profile_pic || profile_pic } alt={ user.name } className="w-[30px] aspect-square rounded-full" />
          <span className="text-[16px]">{ user.name }</span>
        </Link>
        {
          leftNav.map( ({title, items}, i, arr) => (
            <>
            <div className="menu flex flex-col">
              {
                title ? <span className="bar-title mb-[10px] text-[20px]">{ title }</span> : null
              }
              {
                items.map( (item, j) => (
                  <NavItem {...item} key={j} />
                ))
              }
            </div>
            { i < arr.length - 1 ? <hr className="border-none mt-[20px] mb-[15px] h-[0.5px]" /> : null }
            </>
          ))
        }
      </div>
      <div className="logout">
        <button className="px-[15px] py-[10px] w-full flex items-center justify-start gap-[5px]">
          <Logout />
          <span>Log out</span>
        </button>
      </div>
    </div>
  )
}

export default Leftbar
