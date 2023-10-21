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
            <div className="channels grid grid-cols-1 grid-rows-[auto,1fr] lg:grid-rows-1 lg:grid-cols-[300px,1fr] min-h-[100vh]">
                <Leftbar />
                <section className="grid grid-cols-1 lg:grid-cols-[1fr,300px]">
                    <Outlet />
                </section>
            </div>
        </ChannelContext.Provider>
    )
}

export default Channels
