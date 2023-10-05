import { Add, MoreHoriz } from '@mui/icons-material'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/authContext';
import { Link } from 'react-router-dom';
import { fetchCustomFriendGroups } from '../../utils/friend';
import { CustomFriendGroupType } from '../../types/friend.types';
import { APIURL } from '../../assets/data';
import { custom_group_bgs } from '../../assets/data/data';

const CustomList = () => {
    const { user } = useContext(AuthContext)
    const [customGroups, setCustomGroups] = useState<CustomFriendGroupType[]>([]);

    useEffect(() => { 
        fetchCustomFriendGroups(user.id)
            .then((res) => setCustomGroups(res as CustomFriendGroupType[]))
            .catch(error => alert(error))
     }, [] );

    return (
        <div className="menu">
            <div className="menu-title">
                <h3>Custom List</h3>
                <Link to="/friends/custom/create" className="create-btn flex items-center justify-center text-sm pl-1 pr-3 h-[34px] lg:h-[40px] rounded-md gap-1">
                    <Add />
                    <span>Create</span>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {
                    customGroups.map(({ id, group_name, friends_count, friend_names, friend_pics, color }) => {
                        const { from, via, to } = custom_group_bgs[color] || {}
                        return (
                            <Link
                                to={`/friends/custom/${id}`}
                                key={id}
                                className={`group bg-gradient-to-br rounded-lg ${from} ${via} ${to} shadow shadow-black-900/50 overflow-clip`}
                            >
                                <div className="group-hover:scale-x-[.99] group-hover:scale-y-[.97] transition-transform relative flex flex-col p-2 bg-[rgba(15,15,15,1)] rounded-md h-full">
                                    <div className="flex-1 flex flex-row-reverse items-center justify-end origin-top-left group-hover:scale-[1.3] transition-transform">
                                        {
                                            friend_pics?.map((pic, i) => (
                                                <div className={`w-[50px] p-[1px] bg-gradient-to-tr rounded-lg shadow shadow-black-900/50 ${from} ${via} ${to}`}>
                                                    <img
                                                        key={i}
                                                        className={`w-full aspect-square rounded-lg ${i !== 0 && 'ml-[-10px]'}`} src={`${APIURL}/image/profile_pics/${pic}`}
                                                    />
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className="overflow-hidden">
                                        <div className="group-hover:translate-y-[10px] transition-transform flex flex-col w-fit overflow-hidden">
                                            <p className="font-bold text-xl mt-2">{group_name}</p>
                                            <div className={`bg-gradient-to-r ${from} ${via} ${to} h-1 rounded-md`}></div>
                                        </div>
                                    </div>
                                    <button className='flex items-center justify-center h-[30px] rounded-lg aspect-square absolute top-2 right-2 bg-white/5'>
                                        <MoreHoriz />
                                    </button>
                                    <p className="text-xs text-gray-400 mt-1">
                                        {friend_names?.join(', ')}
                                        {friends_count > 5 ? `and ${friends_count - 5} Others` : ''}
                                    </p>
                                </div>
                            </Link>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default CustomList
