import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import { MoreHoriz, KeyboardArrowLeft } from '@mui/icons-material';
import { APIURL } from '../../assets/data';

type DetailProps = {
    profile_pic: string;
    name: string;
    date_posted: string;
    comment: string|null;
}

const UserDetails = ({ comment, profile_pic, name, date_posted }: DetailProps) => {
    const navigate = useNavigate();
    const date = useMemo(() => {
        let time: string;
        const currDate = new Date();
        const newDate = new Date(date_posted);
        const timePassed = currDate.getTime() - newDate.getTime();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        time = `${months[newDate.getMonth()]} ${newDate.getDay()}`;

        if (timePassed < 1000 * 60 * 60) time = Math.floor(timePassed / (1000 * 60)) + ' mins ago';
        if (timePassed < 1000 * 60 * 60 * 24 && timePassed > 1000 * 60 * 60) time = Math.floor(timePassed / (1000 * 60 * 60)) + 'hrs ago';
        if (timePassed < 1000 * 60 * 60 * 48 && timePassed > 1000 * 60 * 60 * 24) time = 'Yesterday';
        if (timePassed >= 1000 * 60 * 60 * 48 && newDate.getFullYear() > currDate.getFullYear()) time = `${months[newDate.getMonth()]} ${newDate.getDay()}, ${newDate.getFullYear()}`;

        return time;
    }, [date_posted])
    
    if (comment) return;
    return (
        <div className="user_details top flex items-center gap-2 p-2 px-4">
            <button onClick={() => navigate(-1)} className="flex-items-center justify-center">
                <KeyboardArrowLeft />
            </button>
            <div className="user-profile flex-1 flex items-center gap-[10px]">
                <img className="h-[40px] aspect-square rounded-full" src={`${APIURL}/image/profile_pics/${profile_pic}`} alt={name} />
                <div className="flex flex-col">
                    <span className="text-sm font-bold">{ name }</span>
                    <span className="text-xs">{ date }</span>
                </div>
            </div>
            <IconButton className="more h-[35px]">
                <MoreHoriz />
            </IconButton>
        </div>
    )
}

export default UserDetails
