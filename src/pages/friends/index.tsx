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
        socket.on('friend-event', ({ users }: { users: string[] }) => {
            if (!users.includes(user.id)) return
            setRefresh(!refresh)
            getIds('friend');
        })
    }, [socket, refresh])

    return (
        <friendContext.Provider value={{ refresh }}>
            <div className='friends-page'>
                <Leftbar />
                <div className="right flex-[3] p-[20px] pt-[10px]">
                    <Outlet />
                </div>
            </div>
        </friendContext.Provider>
    )
}

export default Friends
