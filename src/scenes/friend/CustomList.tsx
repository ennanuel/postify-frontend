import { MoreHoriz, PostAdd } from '@mui/icons-material'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/authContext';
import { APIURL } from '../../assets/data';
import { Link } from 'react-router-dom';
import { fetchOptions } from '../../assets/data/data';

type CustomGroupType = {
    id: string;
    group_name: string;
    friends_count: number;
    friend_pics: string[];
    friend_names: string[];
}

const CustomList = () => {
    const { user } = useContext(AuthContext)
    const [customGroups, setCustomGroups] = useState<CustomGroupType[]>([]);

    const getCustomGoups = async () => {
        const response = await fetch(`${APIURL}/friend/groups/${user.id}`, fetchOptions)

        if(response.status !== 200) return alert('something went wrong')

        const res = await response.json();
        setCustomGroups(res)
    }

    useEffect( () => { getCustomGoups() }, [] );

    return (
        <div className="menu">
            <div className="menu-title">
                <h3>Custom List</h3>
                <button className="create-btn text-sm">
                    <PostAdd />
                    <span>Create</span>
                </button>
            </div>

            <div className="custom-lists container">
                {
                    customGroups.map( ({ id, group_name, friends_count, friend_names, friend_pics }) => (
                        <Link to={`/friends/custom/${id}`} key={id} className="custom-list">
                            <div className="img-name">
                                <img src="" alt="" className='profile-pic' />
                                <p className="name">{ group_name }</p>
                                <button><MoreHoriz /></button>
                            </div>
                            <div className="info">
                                <div className="friends-list">
                                    { 
                                        friend_pics?.map( pic => (
                                            <img className="friend-list" src={pic} alt="" />
                                        ))
                                    }
                                </div>
                                <p className="members text-xs">
                                    { friend_names?.join(', ') }
                                    { friends_count > 5 ? `and ${ friends_count - 5 } Others` : ''}
                                </p>
                            </div>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default CustomList
