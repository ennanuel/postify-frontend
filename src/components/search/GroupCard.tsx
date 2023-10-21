import { Add, KeyboardArrowRight } from "@mui/icons-material"
import { Link } from 'react-router-dom'
import { APIURL } from "../../assets/data"
import { GroupType } from "../../types/group.types"

const GroupCard = ({ id, name, group_desc, picture }: GroupType) => {
    return (
        <li className="flex flex-col gap-2 border border-white/5 p-2">
            <div className="flex items-end gap-2 flex-wrap">
                <img src={`${APIURL}/image/profile_pics/${picture}`} alt="" className="w-[60px] aspect-square rounded-full row-span-2 bg-white/5" />
                <h3 className="text-lg font-semibold flex-1 truncate">{ name }</h3>
                <div className="flex items-center gap-2">
                    <Link to={`/group/post/${id}`} className="pl-3 pr-1 py-1 flex items-center justify-center rounded-[17px] bg-white text-black-900 text-sm font-semibold">
                        <span>View</span>
                        <KeyboardArrowRight fontSize='small' />
                    </Link>
                    <button className="pl-2 px-3 flex items-center justify-center gap-[3px] py-1 rounded-[17px] bg-white/5 text-sm">
                        <Add fontSize="small" />
                        <span>Join</span>
                    </button>
                </div>
            </div>
            <p className="text-sm">{ group_desc }</p>
        </li>
    )
}

export default GroupCard
