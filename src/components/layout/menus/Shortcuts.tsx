import { Add, GroupsRounded, PeopleRounded, Search, Settings, TvRounded } from '@mui/icons-material';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const NAVIGATIONS = [
    { to: '/friends/all', text: 'Friends', bg: 'bg-blue-400/10', hoverBg: 'bg-blue-400/20', textColor: 'text-blue-300', Icon: PeopleRounded },
    { to: '/groups/posts', text: 'Groups', bg: 'bg-purple-400/10', hoverBg: 'bg-purple-400/20', textColor: 'text-purple-300', Icon: GroupsRounded },
    { to: '/channels/feed', text: 'Channels', bg: 'bg-green-400/10', hoverBg: 'bg-green-400/20', textColor: 'text-green-300', Icon: TvRounded },
    { to: '/settings', text: 'Settings', bg: 'bg-white/5', hoverBg: 'bg-white/20', textColor: 'text-white', Icon: Settings },
]

const Shortcuts = ({ close }: { close: () => void }) => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        if (!search.replace(' ', '')) return;
        close();
        navigate(`/search/${search}`);
        setSearch('');
    }
    return (
        <div className="menu fixed top-0 right-0 lg:top-[70px] lg:right-3 flex flex-col items-stretch justify-start w-full h-full lg:h-auto lg:w-[300px] bg-black-900 z-[999] rounded-lg shadow-lg shadow-black-900/40">
            <div className="flex items-center justify-between gap-4 p-4 pb-0">
                <h3 className="font-bold text-3xl lg:text-lg">Menu</h3>
                <button onClick={close} className="flex items-center justify-center h-[40px] w-[40px] lg:w-auto lg:h-auto rounded-lg bg-white/5 lg:bg-transparent">
                    <span className="flex items-center justify-center rotate-45">
                        <Add />
                    </span>
                </button>
            </div>
            <form onSubmit={handleSubmit} className="h-[40px] pr-2 rounded-lg md:rounded-[20px] lg:hidden flex items-stretch bg-white/5 mx-4 mt-4">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 outline-none border-none px-3 "
                    type="text"
                    placeholder="Search Postify"
                />
                <button className="flex items-center justify-center aspect-square">
                    <Search />
                </button>
            </form>
            <ul className="p-4 grid grid-cols-2 gap-3">
                {
                    NAVIGATIONS.map(({ to, text, bg, hoverBg, textColor, Icon}) => (
                        <li key={to}>
                            <Link to={to} className={`p-3 h-fit flex flex-col items-center justify-center gap-2 rounded-lg ${bg} ${hoverBg} ${textColor}`}>
                                <div className="flex items-center justify-center w-[50px] h-[50px] rounded-full bg-white/10">
                                    <Icon />
                                </div>
                                <p className="text-sm font-semibold truncate">{text}</p>
                            </Link>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default Shortcuts
