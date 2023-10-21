import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Search, Add, KeyboardArrowLeft } from '@mui/icons-material';
import { AuthContext } from '../../context/authContext';
import { getFriendsToInvite, inviteOrRejectInvite } from '../../utils/group';
import { APIURL } from '../../assets/data';
import { FriendType } from '../../types/friend.types';

const InviteMembers = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [friends, setFriends] = useState<FriendType[]>([]);
    const [search, setSearch] = useState('');

    function searchFilter({ name }: FriendType) {
        const rgxParam = `(${search.split(' ').join('|')})`;
        const regexp = new RegExp(rgxParam, 'i');
        return regexp.test(name);
    }

    function hideUser(index: number) {
        setFriends(prev => prev.splice(index, 1, { ...prev[index], hide: true }));
    }

    function inviteUser(user_id: string, index: number) {
        inviteOrRejectInvite({ group_id: id || '', user_id, actionType: 'add' });
        hideUser(index);
    }

    useEffect(() => { 
        getFriendsToInvite(id || '', user.id)
            .then(res => setFriends(res))
            .catch(error => alert(error));
    }, []);

    return (
        <div className="relative z-[9999999]">
            <button className='peer h-[36px] flex items-center justify-center gap-1 pl-1 pr-3 rounded-md shadow bg-white/5'>
                <KeyboardArrowLeft />
                <span>Invite</span>
            </button>
            <div className="absolute top-[-2px] right-[-2px] p-2 flex flex-col gap-2 bg-black-900 border border-white/5 opacity-0 pointer-events-none peer-focus:opacity-100 peer-focus:pointer-events-auto rounded-md shadow-lg shadow-black-900/50 hover:opacity-100 hover:pointer-events-auto">
                <h3 className='font-bold text-lg'>Invite Friends</h3>
                <div className="flex item-center gap-1">
                    <input
                        type="text"
                        placeholder="Search Friends"
                        className="px-2 h-[30px] rounded-[15px] bg-white/5"
                        onChange={(e) => setSearch(e.target.value)}
                        value={search}
                    />
                    <button className="flex items-center justify-center h-[30px] w-[30px] rounded-full bg-white/5"><Search fontSize="small" /></button>
                </div>
                <ul className="flex flex-col gap-2 mt-2 max-h-[400px] overflow-y-scroll">
                    {
                        friends
                            .filter(searchFilter)
                            .map(({ id, name, profile_pic, hide }, i) =>
                                !hide && 
                                    <li key={id} className="flex items-center gap-2 h-[40px] px-[5px] rounded-md bg-white/5">
                                        <img src={`${APIURL}/image/profile_pics/${profile_pic}`} alt="" className="w-[32px] rounded-md aspect-square" />
                                        <p className="flex-1">{name}</p>
                                        <button
                                            onClick={() => inviteUser(id, i)}
                                            className="flex items-center justify-center w-[30px] h-[30px] rounded-md bg-white/5 hover:bg-white/10"
                                        >
                                            <Add />
                                        </button>
                                    </li>
                            )
                    }
                </ul>
            </div>
        </div>
    )
}

export default InviteMembers
