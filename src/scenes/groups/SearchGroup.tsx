import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'
import { fetchSearchValues } from '../../utils';
import { AuthContext } from '../../context/authContext';
import { GroupCard } from '../../components/cards';
import { GroupType } from '../../types/group.types';
import { addOrRemoveMember, inviteOrRejectInvite } from '../../utils/group';

const SearchGroup = () => {
    const { user } = useContext(AuthContext)
    const { query } = useParams();
    const [groups, setGroups] = useState<GroupType[]>([]);
    
    function handleJoin(group_id: string) { addOrRemoveMember({ user_id: user.id, group_id, actionType: 'add' }) };
    function handleReject(group_id: string) { inviteOrRejectInvite({ user_id: user.id, group_id, actionType: 'remove' }) };

    useEffect(() => { 
        if (!query) return;
        fetchSearchValues({ user_id: user.id, query, filter: 'group' })
            .then(res => setGroups(res.group))
            .catch(error => alert(error));
    }, [query])

    return (
        <section className="p-4">
            <h2 className='text-2xl font-bold'>Search Result</h2>
            <ul className='mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                {
                    groups.map((group, i) => (
                        <li key={i}>
                            <GroupCard
                                joinGroup={() => handleJoin(group.id)}
                                rejectInvite={() => handleReject(group.id)}
                                {...group}
                            />
                        </li>
                    ))
                }
            </ul>
        </section>
    )
}

export default SearchGroup
