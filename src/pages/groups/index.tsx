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
    socket.on('group-event', ({ user_id }) => {
      if(user_id === user.id) setRefresh( !refresh )
    })
  }, [socket, refresh])

  return (
    <groupContext.Provider value={{ refresh }}>
      <div className='groups flex items-start justify-between'>
        <Leftbar />
        <div className="right">
          <Outlet />
        </div>
      </div>
    </groupContext.Provider>
  )
}

export default Groups
