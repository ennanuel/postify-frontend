import { Add } from '@mui/icons-material'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/authContext';
import { Link } from 'react-router-dom';
import { fetchCustomFriendGroups } from '../../utils/friend';
import { CustomFriendGroupType } from '../../types/friend.types';
import { FriendGroupCard } from '../../components/cards';

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
            <div className="flex items-center justify-between gap-4 mt-4">
                <h3 className="text-3xl font-bold">Friend Groups</h3>
                <Link to="/friends/custom/create" className="create-btn flex items-center justify-center text-sm pl-1 pr-3 h-[34px] lg:h-[40px] rounded-md gap-1">
                    <Add />
                    <span>Create</span>
                </Link>
            </div>

            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {
                    customGroups.map( (customGroup) => (
                        <li key={customGroup.id}>
                            <FriendGroupCard {...customGroup} />
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default CustomList
