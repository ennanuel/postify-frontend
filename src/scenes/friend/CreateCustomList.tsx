import { useContext, useEffect, useState } from 'react';
import { Add, Search, CheckRounded, KeyboardArrowLeft } from '@mui/icons-material'
import APIURL, { custom_group_bgs } from '../../assets/data/data';
import { createOrEditCustomFriendGroups, fetchFriends } from '../../utils/friend';
import { AuthContext } from '../../context/authContext';
import { FriendType } from '../../types/friend.types';
import { useNavigate, Link } from 'react-router-dom';

type ValueType = { group_name: string; users: string[]; color: 'purple' | 'blue' | 'red' | 'white' | 'black' }

const CreateCustomList = () => {
    const { user } = useContext(AuthContext)
    const [{ group_name, users, color }, setValues] = useState<ValueType>({ group_name: '', users: [], color: 'purple' })
    const [friends, setFriends] = useState<FriendType[]>([]);
    const navigate = useNavigate();

    const addUser = (id: string) => {
        if (users.includes(id)) return;
        setValues(prev => ({ ...prev, users: [...prev.users, id] }));
    }
    const removeUser = (id: string) => {
        setValues(prev => ({ ...prev, users: prev.users.filter(user_id => user_id !== id) }));
    }
    const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        createOrEditCustomFriendGroups({ user_id: user.id, group_name, users, color })
            .then(() => navigate('/friends/custom'))
            .catch(error => alert(error));
    }

    useEffect(() => { 
        fetchFriends(user.id)
            .then(res => setFriends(res as FriendType[]))
            .catch(error => alert(error));
    })

    return (
        <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between gap-4 flex-wrap mt-4">
                <div className="flex items-center gap-2">
                    <Link to="/friends/custom" className="flex lg:hidden items-center justify-center"><KeyboardArrowLeft /></Link>
                    <h2 className="font-bold text-3xl">New Friend Group</h2>
                </div>
                    <button className="h-[40px] rounded-[20px] bg-white/5 hover:bg-white/10 px-4 font-bold">Create</button>
                </div>
                <div className="flex items-center justify-between flex-wrap gap-4 mt-6">
                    <input
                        value={group_name}
                        onChange={handleChange}
                        type="text"
                        name="group_name"
                        placeholder='Name'
                        className='w-full max-w-[400px] px-3 h-[40px] rounded-[20px] bg-white/5 shadow shadow-black-900/40'
                    />
                    <ul className="flex items-center gap-2">
                        {
                            Object.entries(custom_group_bgs).map(([value, { from, via, to }]) => (
                                <li key={value} className={`relative bg-gradient-to-br ${from} ${via} ${to} ${value === color ? 'scale-100' : 'scale-90'} w-[40px] aspect-square rounded-full transition-transform active:scale-75`}>
                                    {
                                        value === color &&
                                        <div className="absolute top-0 left-0 h-full w-full rounded-full pointer-events-none bg-black-900/50 flex items-center justify-center"><CheckRounded /></div>
                                    }
                                    <input
                                        type="radio"
                                        name="color"
                                        className="w-full h-full opacity-0 block"
                                        value={value}
                                        checked={value === color}
                                        onChange={handleChange}
                                    />
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className="flex items-center justify-between gap-4 mt-6 flex-wrap">
                    <h3 className="text-xl font-bold text-gray-300">Friends (<span className="text-white">{users.length}</span>)</h3>
                    <div className="pl-3 flex items-center w-full max-w-[300px] rounded-[20px] bg-white/5 shadow shadow-black-900/50">
                        <Search />
                        <input type="text" placeholder='Search Friends' className='px-2 h-[40px] border-none outline-none' />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 mt-4">
                    {
                        friends.map(({ id, name, profile_pic }) => (
                            <div className={`flex items-center gap-4 rounded-[28px] ${users.includes(id) ? 'bg-white/10' : 'bg-white/5'} p-1`}>
                                <img className="w-[50px] aspect-square rounded-full shadow shadow-black-900/50" src={`${APIURL}/image/profile_pics/${profile_pic}`} alt="" />
                                <p className="flex-1">{name}</p>
                                <button
                                    type="button"
                                    onClick={() => users.includes(id) ? removeUser(id) : addUser(id)}
                                    className={`w-[50px] h-[50px] rounded-full  rounded-full transition-transform ${users.includes(id) ? 'bg-red-600 rotate-45' : 'bg-white/10'} active:scale-90`}
                                ><Add /></button>
                            </div>
                        ))
                    }
                </div>
        </form>
    )
}

export default CreateCustomList
