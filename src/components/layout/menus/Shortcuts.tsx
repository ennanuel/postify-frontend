import { Add, GroupsRounded, PeopleRounded, Search, Settings, TvRounded } from '@mui/icons-material';
import { Link } from 'react-router-dom'

const Shortcuts = ({ close }: { close: () => void }) => {
    return (
        <div className="menu fixed top-0 right-0 lg:top-[70px] lg:right-3 flex flex-col items-stretch justify-start w-full h-full lg:h-auto lg:w-[300px] bg-black-900 z-[999] rounded-lg shadow-lg shadow-black-900/40">
            <div className="flex items-center justify-between gap-4 p-4 pb-0">
                <h3 className="font-bold">Menu</h3>
                <button onClick={close} className="flex items-center justify-center rotate-45">
                    <Add />
                </button>
            </div>
            <div className="lg:hidden flex items-center gap-1 h-[40px] rounded-[20px] bg-white/5 pl-2 m-4 mb-0">
                <label htmlFor="search_postify" className='flex items-center justify-center'><Search /></label>
                <input type="text" id="search_postify" className="h-full pr-4" placeholder="Search Postify" />
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
                <Link to="/friends/all" className="p-3 h-fit flex flex-col items-center justify-center gap-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300">
                    <div className="flex items-center justify-center w-[50px] h-[50px] rounded-full bg-white/10">
                        <PeopleRounded />
                    </div>
                    <p className="text-sm font-semibold truncate">Friends</p>
                </Link>
                <Link to="/groups/feed" className="p-3 h-fit flex flex-col items-center justify-center gap-2 rounded-lg bg-red-600/20 hover:bg-red-600/40 text-red-400">
                    <div className="flex items-center justify-center w-[50px] h-[50px] rounded-full bg-white/10">
                        <GroupsRounded />
                    </div>
                    <p className="text-sm font-semibold truncate">Groups</p>
                </Link>
                <Link to="/channels/feed" className="p-3 h-fit flex flex-col items-center justify-center gap-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-400">
                    <div className="flex items-center justify-center w-[50px] h-[50px] rounded-full bg-white/10">
                        <TvRounded />
                    </div>
                    <p className="text-sm font-semibold truncate">Channels</p>
                </Link>
                <Link to="/settings" className="p-3 h-fit flex flex-col items-center justify-center gap-2 rounded-lg bg-white/10 hover:bg-white/30 text-white">
                    <div className="flex items-center justify-center w-[50px] h-[50px] rounded-full bg-white/10">
                        <Settings />
                    </div>
                    <p className="text-sm font-semibold truncate">Settings</p>
                </Link>
            </div>
        </div>
    )
}

export default Shortcuts
