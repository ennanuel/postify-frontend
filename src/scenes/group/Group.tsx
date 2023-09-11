import { CalendarToday, PeopleAltRounded, PermMediaOutlined, Person } from '@mui/icons-material'
import { Posts } from '../../components'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/authContext'
import { useParams } from 'react-router-dom'
import { APIURL } from '../../assets/data'
import { GroupContext } from '../../pages/group'

type PostType = {
  id: string;
  name: string
  user_id: number;
  profile_pic: string;
  post_desc: string;
  post_likes: number;
  post_comments: number;
  shares: number;
  liked_post: boolean;
  last_updated: string;
  date_posted: string;
}

type GroupType = {
  group_desc: string;
  creator: string;
  members: number;
  tags: string[];
  photos: string[];
  dateCreated: string;
}

const Group = () => {
  const { id } = useParams()
  
  const { user, socket } = useContext(AuthContext)
  const { refreshPost: refresh } = useContext(GroupContext)

  const [{ group_desc, creator, members, tags, photos }, setGroupInfo] = useState<GroupType>({} as GroupType)
  const [posts, setPosts] = useState<PostType[]>([])
  const [{ post_desc }, setValues] = useState({ post_desc: '' })

  const createPost : React.FormEventHandler<HTMLFormElement> = async (e) => { 
    e.preventDefault();
    const values = {user_id: user.id, group_id: id, post_desc}
    
    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      }
    }

    for (let [key, value] of Object.entries(values)) {
      if(!value || value.length < 1) return alert(`${key} cannot be left empty`)
    }

    const response = await fetch(APIURL + '/post/create?type=group', fetchOptions);

    if(response.status !== 200) {
      alert('something went wrong');
      return;
    }

    const res = await response.json();
    socket.emit('post-action', ({ user_id: user.id, group_id: id }))
    alert(res.message);
  }

  const fetchGroupInfo = async () => {
    const response = await fetch(`${APIURL}/group/info/${id}?user_id=${user.id}&type=full`)
    if (response.status !== 200) return alert('something went wrong')
    const res = await response.json();
    setGroupInfo(res);
  }

  const fetchGroupPosts = async () => {
    const response = await fetch(`${APIURL}/group/posts/${id}`)

    if(response.status !== 200) return alert('something went wrong')
    const res = await response.json();

    setPosts(res);
  }
  
  useEffect(() => {
    fetchGroupInfo();
    fetchGroupPosts();
  }, [id])

  useEffect(() => alert('someone posted something'), [refresh])

  return (
    <div className='group-det'>
      <div className="right-side">
        <div className="menu">
          <h3>Info</h3>
          <p>{group_desc}</p>
          <ul className="details">
            <li>
              <Person /> 
              <span>Created by </span>
              <span>{ creator }</span>
            </li>
            <li>
              <CalendarToday /> 
              <span>Created on</span> 
              <span>30th January, 2002</span>
            </li>
            <li>
              <PeopleAltRounded /> 
              <span>{members} Members</span>
            </li>
          </ul>
          <ul className="categories">
            {
              tags?.map((tag, i) => <li key={i}>{tag}</li>)
            }
          </ul>
        </div>
        <div className="menu">
          <div className="menu-top">
            <h3>Photos</h3>
            <p>See all</p>
          </div>
          <ul className="photos">
            {
              photos?.map((photo, i) => <li key={i}><img src={photo} alt="" /></li>)
            }
          </ul>
        </div>
      </div>
      
      <div className="left-side">
        <form onSubmit={createPost} className="create-post">
          <div className="posts-top">
            <img src="" alt="" />
            <input
              value={post_desc}
              onChange={(e) => setValues(prev => ({ ...prev, post_desc: e.target.value }))}
              type="text"
              placeholder="Write Something"
            />
          </div>
          <div className="bottom">
            <button className="add" type="button">
              <PermMediaOutlined />
              <span>Add Photo / Video</span>
            </button>
            <button>Post</button>
          </div>
        </form>
        <Posts posts={posts} />
      </div>

    </div>
  )
}

export default Group
