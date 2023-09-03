import { Outlet } from 'react-router-dom';
import Leftbar from './Leftbar';
import './friends.scss';

const Friends = () => {
    return (
        <div className='friends-page'>
            <Leftbar />
            <div className="right flex-[3] p-[20px] pt-[10px]">
                <Outlet />
            </div>
        </div>
    )
}

export default Friends
