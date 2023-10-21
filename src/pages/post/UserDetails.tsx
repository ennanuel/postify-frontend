import { useContext, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { MoreHoriz, KeyboardArrowLeft } from '@mui/icons-material';
import { APIURL } from '../../assets/data';
import { PostContext } from '../../context/postContext';
import { postPrettierTime } from '../../utils/post';

const UserDetails = () => {
    const { showForMobile, post: { date_posted, profile_pic, name, user_id } } = useContext(PostContext);
    const showingComment = useMemo(() => showForMobile === 'comment', [showForMobile]);
    const navigate = useNavigate();
    const date = useMemo(() => postPrettierTime(date_posted), [date_posted]);
    
    return (
        <div className={`user_details top flex items-center gap-2 p-2 px-4 ${showingComment ? 'lg:hidden' : ''}`}>
            <button onClick={() => navigate(-1)} className="flex-items-center justify-center">
                <KeyboardArrowLeft />
            </button>
            <Link to={`/profile/${user_id}`} className="user-profile flex-1 flex items-center gap-[10px]">
                <img className="h-[40px] aspect-square rounded-full" src={`${APIURL}/image/profile_pics/${profile_pic}`} alt={name} />
                <div className="flex flex-col">
                    <span className="text-sm font-bold">{ name }</span>
                    <span className="text-xs">{ date }</span>
                </div>
            </Link>
            <IconButton className="more h-[35px]">
                <MoreHoriz />
            </IconButton>
        </div>
    )
}

export default UserDetails
