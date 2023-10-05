import { Link } from "react-router-dom";
import { APIURL } from "../../assets/data";

type ChannelType = {
  id: string;
  name: string;
  picture: string;
}

const ChannelCard = ({ id, picture, name }: ChannelType) => {
    return (
        <Link to={`/channels/info/${id}`} className="flex flex-col gap-2 items-center p-2">
            <img src={`${APIURL}/image/profile_pics/${picture}`} alt="" className="h-[80px] aspect-square rounded-full bg-white/5" />
            <p className="text-sm font-bold truncate text-center">{ name }</p>
        </Link>
    )
}

export default ChannelCard
