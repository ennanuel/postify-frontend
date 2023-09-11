import { createContext, useContext, useState, useEffect } from 'react'
import { Outlet, useParams } from 'react-router-dom'
import Leftbar from './Leftbar'
import './channel.scss';
import { AuthContext } from '../../context/authContext';

export const ChannelContext = createContext({ refresh: false })

const Channels = () => {
    const { id } = useParams();

    const { user, socket } = useContext(AuthContext);

    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        socket.on('channel-event', ({ channel_id, user_id }) => {
            if( user_id === user.id || channel_id === id ) setRefresh(!refresh)
        })
     }, [refresh, socket, id])

    return (
        <ChannelContext.Provider value={{ refresh }}>
            <div className="channels flex min-h-[100vh]">
                <Leftbar />
                <div className="flex-[6]">
                    <Outlet />
                </div>
            </div>
        </ChannelContext.Provider>
    )
}

export default Channels
