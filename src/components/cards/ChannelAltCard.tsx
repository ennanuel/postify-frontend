import { Link } from 'react-router-dom';
import { KeyboardArrowRight } from '@mui/icons-material';
import { ChannelType } from '../../types/channel.types';
import { APIURL } from '../../assets/data';

const ChannelAltCard = ({ id, name, picture }: ChannelType) => {
    return (
        <Link to={`/channels/info/${id}`} className="bottom-channel flex items-center gap-3 p-1 rounded-md">
            <img className="w-[50px] aspect-square rounded-full bg-white/5" src={`${APIURL}/image/profile_pics/${picture}`} alt="" />
            <p className="flex-1 font-bold text-sm truncate">{name}</p>
            <KeyboardArrowRight />
        </Link>
    )
};

export default ChannelAltCard
