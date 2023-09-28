import { Add, EditRounded, Logout, Person } from '@mui/icons-material';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../../context/authContext';

const Profile = ({ close }: { close: () => void }) => {
    const { user } = useContext(AuthContext);

    return (
        <div className="menu fixed top-[70px] right-3 flex flex-col w-[300px] bg-black-900 z-[999] rounded-lg shadow-lg shadow-black-900/40">
            <div className="flex items-center justify-between gap-4 p-4 pb-2">
                <h3 className="font-bold">Profile</h3>
                <button onClick={close} className="flex items-center justify-center rotate-45">
                    <Add />
                </button>
            </div>
            <div className="flex-1 flex flex-col mb-2">
                <Link to={`/profile/${user.id}`} className="flex items-center gap-4 px-3 py-2 hover:bg-white/5">
                    <div className="flex items-center justify-center h-[36px] w-[36px] rounded-full bg-white/10">
                        <Person />
                    </div>
                    <p className="flex-1 text-sm">View Profile</p>
                </Link>
                <Link to={`/edit_profile/${user.id}`} className="flex items-center gap-4 px-3 py-2 hover:bg-white/5">
                    <div className="flex items-center justify-center h-[36px] w-[36px] rounded-full bg-white/10">
                        <EditRounded />
                    </div>
                    <p className="flex-1 text-sm">Edit Profile</p>
                </Link>
                <button className="flex items-center gap-4 px-3 py-2 hover:bg-white/5">
                    <span className="flex items-center justify-center h-[36px] w-[36px] rounded-full bg-white/10">
                        <Logout />
                    </span>
                    <span className="flex-1 text-sm text-start">Logout</span>
                </button>
            </div>
        </div>  
    )
}

export default Profile
