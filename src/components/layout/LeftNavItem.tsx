import { NavLink } from 'react-router-dom';

type NavItemProps = {
    name: string;
    icon: string;
    to: string;
}

const NavItem = ({ name, icon, to } : NavItemProps) => {
  return (
    <NavLink to={to} className="item py-[5px] px-[10px] rounded-md flex items-center gap-[10px] hover:bg-[rgba(0,0,0,0.3)]">
      <div className="flex items-center justify-center h-[35px] aspect-square rounded-full p-1 bg-gradient-to-br from-blue-300/20 to-blue-600/10">
        <img src={icon} alt="" className="w-[25px] aspect-square" />
      </div>
      <span>{name}</span>
    </NavLink>
  )
}

export default NavItem
