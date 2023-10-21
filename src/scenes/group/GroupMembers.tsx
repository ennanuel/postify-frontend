import { useState, useContext, useEffect, useMemo } from 'react';
import { Search } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../../context/authContext'
import { GroupContext } from '../../pages/group'
import { addOrRemoveMember, fetchGroupMembers } from '../../utils/group';
import { UserType } from '../../types/user.types';
import GroupMember from '../../components/cards/GroupMember'

const GroupMembers = () => {
  const { user } = useContext(AuthContext)
  const { refreshDet: refresh } = useContext(GroupContext);

  const { id } = useParams();
  const [groupMembers, setGroupMembers] = useState<UserType[]>([]);
  const [filter, setFilter] = useState('');
  const filterRegExp = useMemo(() => new RegExp(filter.split(' ').join('|'), 'i'), [filter]);

  const removeUser = async (user_id: string) => {
    addOrRemoveMember({ user_id, group_id: id || '', actionType: 'remove' });
  }

  useEffect(() => {
    fetchGroupMembers({ group_id: id, user_id: user.id })
      .then(res => setGroupMembers(res))
      .catch(error => alert(error));
  }, [refresh])
  
  return (
    <div className="group-members-page p-4">
      <h3 className="font-bold text-xl mb-4">Group Members</h3>
      <div className="search">
          <Search />
        <input
          type="text"
          className="shadow shadow-black-900/50"
          placeholder="Search group members"
          onChange={(e) => setFilter(e.target.value)} />
      </div>
      <ul className="container grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-4">
        {
          groupMembers
            .filter(groupMember => filterRegExp.test(groupMember.name))
            .map((groupMember) => (
            <li key={groupMember.id} className="group-member">
              <GroupMember removeInvite={() => removeUser(groupMember.id)} {...groupMember} />
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default GroupMembers
