import { PersonAdd } from '@mui/icons-material'
import { APIURL } from '../../assets/data';
import { Link } from 'react-router-dom';
import { UserType } from '../../types/user.types';


const PeopleCard = ({ id, name, profile_pic, bio }: UserType) => {
    return (
        <div className="flex flex-col gap-2 border border-white/5 p-2">
            <div className="flex items-end gap-2 flex-wrap">
                <img src={`${APIURL}/image/profile_pics/${profile_pic}`} alt="" className="w-[60px] aspect-square rounded-full row-span-2 bg-white/5" />
                <h3 className="text-lg font-semibold flex-1 truncate">{ name }</h3>
                <div className="flex items-center gap-2">
                    <Link to={`/profile/${id}`} className="px-3 py-1 rounded-[17px] bg-white text-black-900 text-sm font-semibold">View Profile</Link>
                    <button className="px-3 py-1 rounded-[17px] bg-white/5 text-sm"><PersonAdd /></button>
                </div>
            </div>
            <p className="text-sm">{ bio }</p>
        </div>
    )
}

export default PeopleCard
