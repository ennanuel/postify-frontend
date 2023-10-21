import { Link } from 'react-router-dom';
import { KeyboardArrowRight } from '@mui/icons-material';
import { GroupCardProp } from '../../types/group.types';
import { APIURL } from '../../assets/data';

const SmallGroupCard = ({ id, name, picture, members, is_member, joinGroup }: GroupCardProp) => {
    return (
        <div className="group-list p-1 rounded-md flex items-center gap-[10px]">
            <img className="w-[60px] aspect-square rounded-[8px]" src={`${APIURL}/image/profile_pics/${picture}`} alt="" />
            <Link to={`/group/info/${id}`} className="flex-1 flex flex-col justify-center">
                <p className="font-semibold text-sm truncate">{name}</p>
                <p className="text-xs">{members} {members === 1 ? 'member' : 'members'}</p>
            </Link>
            {
                is_member ?
                    <Link to={`/group/info/${id}`} className="w-[30px] aspect-square rounded-full flex items-center justify-center">
                        <KeyboardArrowRight />
                    </Link> :
                    <button
                        className="h-[30px] px-2 rounded-md bg-blue-400/20 text-blue-300 shadow flex items-center justify-center text-sm"
                        onClick={joinGroup && joinGroup}
                    >Join</button>
            }
        </div>
    )
}

export default SmallGroupCard
