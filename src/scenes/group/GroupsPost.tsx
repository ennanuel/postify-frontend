import { useState, useEffect, useContext } from 'react'
import { Posts } from '../../components'
import { AuthContext } from '../../context/authContext';
import { APIURL } from '../../assets/data';

type PostType = {
  id: string;
  name: string;
  user_id: number;
  profile_pic: string;
  post_desc: string;
  post_likes?: number;
  post_comments?: number;
  shares?: number;
  liked_post: boolean;
  last_updated: string;
  date_posted: string;
}

type GroupType = {
  id: string;
  name: string;
  cover: string;
}

const GroupsPost = () => {
  const { user } = useContext(AuthContext)
  const [posts, setPosts] = useState<PostType[]>([])
  const [groups, setGroups] = useState<GroupType[]>([])
  const [groupFilters, setGroupFilters] = useState<string[]>([])

  const joinGroup = async (group_id: string) => {
    const requestBody = { user_id: user.id, group_id }
    const fetchOptions = {
      method: "PUT",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      }
    }

    const response = await fetch(`${APIURL}/group/join`, fetchOptions);
    if (response.status !== 200) return alert('something went wrong');
    setGroupFilters(prev => [...prev, group_id])
    alert('Joined group!')
  }

  const fetchGroups = async () => {
    const response = await fetch(`${APIURL}/group/${user.id}`)

    if(response.status !== 200) return alert('something went wrong')
    const res = await response.json();

    setGroups(res);
  }

  const fetchGroupPosts = async () => {
    const response = await fetch(`${APIURL}/group/feed/${user.id}`)

    if(response.status !== 200) return alert('something went wrong')
    const res = await response.json();
    console.log(res);

    setPosts(res);
  }

  useEffect(() => {
    fetchGroups();
    fetchGroupPosts();
  }, [])

  return (
    <>
      <div className="content px-4">
        <h3 className="text-lg font-bold mx-4 mb-4">Recent Activity</h3>
        <Posts posts={posts} />
      </div>
      <div className="right-bar flex-1 m-[20px] p-[10px] rounded-[10px]">
        <h3 className="p-[10px] font-bold">Suggested Groups</h3>
        <ul className='groups-list flex flex-col gap-[6px]'>
          {
            groups.filter( group => !groupFilters.includes(group.id) ).map( ({id, name, cover}) => (
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
    </>
  )
}

export default GroupsPost
