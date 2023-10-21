import { useState, useEffect, useContext } from 'react'
import { Posts } from '../../components'
import { AuthContext } from '../../context/authContext';
import { groupContext } from '../../pages/groups';
import { PostType } from '../../types/post.types';
import { addOrRemoveMember, fetchGroupPosts, fetchGroups } from '../../utils/group';
import { GroupType } from '../../types/group.types';
import { SmallGroupCard } from '../../components/cards';

const GroupsPost = () => {
  const { user, socket, group } = useContext(AuthContext)
  const { refresh } = useContext(groupContext)

  const [posts, setPosts] = useState<PostType[]>([])
  const [groups, setGroups] = useState<GroupType[]>([])

  const accept = async (group_id: string) => { addOrRemoveMember({ user_id: user.id, group_id, actionType: 'add' })}

  useEffect(() => {
    fetchGroupPosts({ group_or_user_id: user.id, postType: 'all' })
      .then(res => setPosts(res))
      .catch(error => alert(error));
  }, [])

  useEffect(() => {
    fetchGroups({ user_id: user.id })
      .then(res => setGroups(res))
      .catch(error => alert(error));
  }, [refresh])

  useEffect(() => {
    socket.removeAllListeners('post-event')
    socket.on('post-event', ({ group_id } : { group_id: string }) => {
      if (group.includes(group_id)) alert('new post from group');
    })
  }, [group])

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr,300px]">
      <div className="lg:px-[5%] md:px-4 mt-2">
        <h3 className="text-3xl font-bold mx-4 mb-6 lg:mb-6">Recent Activity</h3>
        <Posts posts={posts} />
      </div>
      <div className="right-bar hidden sticky top-[80px] md:block flex-1 p-2 rounded-md h-fit mr-4">
        <h3 className="p-2 font-bold">Suggested Groups</h3>
        <ul className='groups-list flex flex-col gap-1'>
          {
            groups.map((group) => <SmallGroupCard key={group.id} {...group} joinGroup={() => accept(group.id)} />)
          }
        </ul>
      </div>
    </div>
  )
}

export default GroupsPost
