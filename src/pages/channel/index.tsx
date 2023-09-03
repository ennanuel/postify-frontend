import { Outlet } from 'react-router-dom'
import Leftbar from './Leftbar'
import './channel.scss';

const Channels = () => {
    return (
        <div className="channels flex min-h-[100vh]">
            <Leftbar />
            <div className="flex-[6]">
                <Outlet />
            </div>
        </div>
    )
}

export default Channels
