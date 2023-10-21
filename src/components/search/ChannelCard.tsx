import { Add } from "@mui/icons-material";
import { Link } from 'react-router-dom';
import { ChannelType } from "../../types/channel.types";
import { APIURL } from "../../assets/data";

const ChannelCard = ({ id, name, channel_desc, picture }: ChannelType) => {
    return (
        <li className="flex flex-col gap-2 border border-white/5 p-2">
            <div className="flex items-end gap-2">
                <img src={`${APIURL}/image/profile_pics/${picture}`} alt="" className="w-[60px] aspect-square rounded-full row-span-2 bg-white/5" />
                <h3 className="text-lg font-semibold flex-1">{ name }</h3>
                <div className="flex items-center gap-2">
                    <Link to={`/channel/info/${id}`} className="px-3 py-1 rounded-[17px] bg-white text-black-900 text-sm font-semibold">View Channel</Link>
                    <button className="pl-2 px-3 flex items-center justify-center gap-[3px] py-1 rounded-[17px] bg-white/5 text-sm">
                        <Add fontSize="small" />
                        <span>Follow</span>
                    </button>
                </div>
            </div>
            <p className="text-sm">{ channel_desc }</p>
        </li>
    )
}

export default ChannelCard
