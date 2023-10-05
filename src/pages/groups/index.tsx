import { useState, useContext, createContext, useEffect } from 'react'
import { Outlet } from 'react-router-dom';
import Leftbar from './Leftbar';
import './groups.scss';
import { AuthContext } from '../../context/authContext';

export const groupContext = createContext({ refresh: false })

const Groups = () => {
  const { user, socket } = useContext(AuthContext)
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => { 
    socket.removeAllListeners('group-event');
    socket.on('group-event', ({ user_id }) => {
      if(user_id === user.id) setRefresh( !refresh )
    })
  }, [socket, refresh])

  return (
    <groupContext.Provider value={{ refresh }}>
      <div className='groups min-h-[calc(100vh-60px)] grid grid-cols-1 grid-rows-[auto,1fr] lg:grid-rows-1 lg:grid-cols-[300px,1fr]'>
        <Leftbar />
        <div className="right mt-4">
          <Outlet />
        </div>
      </div>
    </groupContext.Provider>
  )
}

export default Groups
