import { useContext, useState, useEffect, createContext } from 'react'
import { Outlet } from 'react-router-dom';
import Leftbar from './Leftbar';
import './friends.scss';
import { AuthContext } from '../../context/authContext';

export const friendContext = createContext({ refresh: false })

const Friends = () => {
    const [refresh, setRefresh] = useState<boolean>(false)
    const { user, socket, getIds } = useContext(AuthContext)

    useEffect(() => { 
        socket.removeAllListeners('friend-event')
        
        socket.on('friend-event', ({ users }: { users: string[] }) => {
            if (!users.includes(user.id)) return
            setRefresh(!refresh)
            getIds('friend');
        })
    }, [socket, refresh])

    return (
        <friendContext.Provider value={{ refresh }}>
            <div className='friends-page grid grid-cols-1 lg:grid-cols-[300px,1fr]'>
                <Leftbar />
                <div className="right flex-[3] p-[20px] pt-[10px] min-h-[100vh]">
                    <Outlet />
                </div>
            </div>
        </friendContext.Provider>
    )
}

export default Friends
