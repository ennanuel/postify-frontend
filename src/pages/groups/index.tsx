import { Outlet } from 'react-router-dom';
import Leftbar from './Leftbar';
import './groups.scss';

const Groups = () => {
  return (
    <div className='groups flex items-start justify-between'>
      <Leftbar />
      <div className="right">
        <Outlet />
      </div>
    </div>
  )
}

export default Groups
