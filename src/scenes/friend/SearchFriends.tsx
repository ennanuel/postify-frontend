import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { FriendType } from '../../types/friend.types';
import { fetchSearchValues } from '../../utils';
import { AuthContext } from '../../context/authContext';
import { FriendCard } from '../../components/cards';

const SearchFriends = () => {
    const { user } = useContext(AuthContext)
    const { query } = useParams();
    const [friends, setFriends] = useState<FriendType[]>([]);

    useEffect(() => { 
        if (!query) return;
        fetchSearchValues({ user_id: user.id, query, filter: 'friend' })
            .then(res => setFriends(res.friend))
            .catch(error => alert(error));
    }, [query])

    return (
        <section className="">
            <h2 className='text-2xl font-bold'>Search Result</h2>
            <ul className='mt-6 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5'>
                {
                    friends.map((friend, i) => (
                        <li key={i}><FriendCard {...friend} /></li>
                    ))
                }
            </ul>
        </section>
    )
}

export default SearchFriends
