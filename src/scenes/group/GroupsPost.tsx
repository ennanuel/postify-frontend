import { useState, useEffect, useContext } from 'react'
import { Posts } from '../../components'
import { AuthContext } from '../../context/authContext';
import { APIURL } from '../../assets/data';
import { groupContext } from '../../pages/groups';
import { fetchOptions } from '../../assets/data/data';

type PostType = {
  id: string;
  name: string
  user_id: number;
  profile_pic: string;
  post_type: string;
  post_bg: 'none' | 'blue' | 'red' | 'white' | 'black';
  files: string[];
  post_desc: string;
  post_likes: number;
  post_comments: number;
  shares: number;
  liked_post: boolean;
  last_updated: string;
  date_posted: string;
  group_name?: string;
  group_id?: string;
}

type GroupType = {
  id: string;
  name: string;
  cover: string;
}

const GroupsPost = () => {
  const { user, socket, group } = useContext(AuthContext)
  const { refresh } = useContext(groupContext)

  const [posts, setPosts] = useState<PostType[]>([])
  const [groups, setGroups] = useState<GroupType[]>([])

  const joinGroup = async (group_id: string) => {
    socket.emit('group-action', { user_id: user.id, group_id }, 'add')
  }

  const fetchGroups = async () => {
    const response = await fetch(`${APIURL}/group/${user.id}`, fetchOptions)

    if(response.status !== 200) return alert('something went wrong')
    const res = await response.json();

    setGroups(res);
  }

  const fetchGroupPosts = async () => {
    const response = await fetch(`${APIURL}/group/posts/${user.id}?type=all`, fetchOptions)

    if(response.status !== 200) return alert('something went wrong')
    const res = await response.json();

    setPosts(res);
  }

  useEffect(() => {
    fetchGroups();
    fetchGroupPosts()
  }, [])

  useEffect(() => {
    fetchGroups();
  }, [refresh])

  useEffect(() => {
    socket.removeAllListeners('post-event')
    socket.on('post-event', ({ group_id } : { group_id: string }) => {
      if (group.includes(group_id)) alert('new post from group');
    })
  }, [group])

  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr,300px]">
      <div className="content lg:px-[5%] md:px-4">
        <h3 className="text-lg font-bold mx-4 mb-4">Recent Activity</h3>
        <Posts posts={posts} />
      </div>
      <div className="right-bar hidden sticky top-[80px] md:block flex-1 p-2 rounded-[10px] h-fit mr-4">
        <h3 className="p-[10px] font-bold">Suggested Groups</h3>
        <ul className='groups-list flex flex-col gap-[6px]'>
          {
            groups.map( ({id, name, cover}) => (
              <li key={id} className="group-list p-[5px] rounded-[5px] flex items-center gap-[10px]">
                <img className="w-[50px] aspect-square rounded-md" src={cover} alt="" />
                <div className="flex-1 flex flex-col">
                  <p className="text-sm font-semibold">{ name }</p>
                  <p className="text-xs">3k members</p>
                </div>
                <button
                  className="text-sm py-[5px] px-[10px] rounded-[5px]"
                  onClick={() => joinGroup(id)}
                >Join</button>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}

export default GroupsPost
