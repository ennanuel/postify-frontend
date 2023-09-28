import { useContext } from 'react'
import './settings.scss'
import { AuthContext } from '../../context/authContext'
import { ChevronRight, DarkMode, DeleteForever, Logout, Person } from '@mui/icons-material';

const Settings = () => {
    const { user } = useContext(AuthContext);

    return (
        <section className="settings min-h-[calc(100vh_-_60px)] px-[15%] py-8">
            <h2 className='text-3xl font-bold'>Settings</h2>
            <div className="mt-6 p-6 pt-4 flex flex-col gap-2 bg-black-900/30 rounded-lg">
                <h3 className='text-xl font-bold mb-2'>Profile</h3>
                <div className="h-[50px] flex items-center justify-between gap-4 px-3 bg-white/5 rounded-md transition-[background-color] hover:bg-white/10">
                    <img src={user.profile_pic} alt="" className="w-[35px] aspect-square rounded-full" />
                    <p className="flex-1">Edit Profile</p>
                    <ChevronRight />
                </div>
                <div className="h-[50px] flex items-center justify-between gap-4 px-3 bg-white/5 rounded-md transition-[background-color] hover:bg-white/10">
                    <span className="h-[36px] w-[36px] rounded-full bg-white/10 flex items-center justify-center">
                        <Person />
                    </span>
                    <p className="flex-1">Active Status</p>
                    <div className="h-[30px] w-[56px] rounded-[15px] bg-white/5 border-2 border-white/50">
                        <div className="h-full aspect-square rounded-full bg-white/50 float-right translate-x-[-100%]"></div>
                    </div>
                </div>
            </div>
            <div className="mt-6 p-5 pt-4 flex flex-col gap-2 bg-black-900/30 rounded-lg">
                <h3 className='text-xl font-bold mb-2'>Theme</h3>
                <div className="h-[50px] flex items-center justify-between gap-4 px-3 bg-white/5 rounded-md transition-[background-color] hover:bg-white/10">
                    <span className="h-[36px] w-[36px] rounded-full bg-white/10 flex items-center justify-center">
                        <DarkMode />
                    </span>
                    <p className="flex-1">Dark Mode</p>
                    <div className="h-[30px] w-[56px] rounded-[15px] bg-white/5 border-2 border-white/50">
                        <div className="h-full aspect-square rounded-full bg-white/50 float-right translate-x-[-100%]"></div>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex items-center justify-between gap-4">
                <button className="h-[35px] px-2 pr-3 flex items-center justify-center gap-1 rounded-md text-sm text-red-400 font-bold bg-red-600/20 border border-transparent">
                    <DeleteForever />
                    <span>Delete Account</span>
                </button>
                <button className="h-[35px] px-2 pr-3 flex items-center justify-center gap-1 rounded-md text-sm font-semibold bg-white/5 border border-transparent">
                    <Logout />
                    <span>Logout</span>
                </button>
            </div>
        </section>
    )
}

export default Settings
