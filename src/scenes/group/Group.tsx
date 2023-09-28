import { CalendarToday, PeopleAltRounded, Person } from '@mui/icons-material'
import { Posts, Share } from '../../components'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/authContext'
import { useParams } from 'react-router-dom'
import { APIURL } from '../../assets/data'
import { GroupContext } from '../../pages/group'
import { fetchOptions } from '../../assets/data/data'

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
  group_desc: string;
  creator: string;
  members: number;
  tags: string[];
  photos: string[];
  dateCreated: string;
}

const Group = () => {
  const { id } = useParams()
  
  const { user } = useContext(AuthContext)
  const { refreshPost: refresh, group: { is_member } } = useContext(GroupContext)

  const [{ group_desc, creator, members, tags, photos }, setGroupInfo] = useState<GroupType>({} as GroupType)
  const [posts, setPosts] = useState<PostType[]>([])

  const fetchGroupInfo = async () => {
    const response = await fetch(`${APIURL}/group/info/${id}?user_id=${user.id}&type=full`, fetchOptions)
    if (response.status !== 200) return alert('something went wrong')
    const res = await response.json();
    setGroupInfo(res);
  }

  const fetchGroupPosts = async () => {
    const response = await fetch(`${APIURL}/group/posts/${id}?user_id=${user.id}`, fetchOptions)

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
              photos?.map((photo, i) => <li key={i}><img src={`${APIURL}/images/${photo}`} alt="" /></li>)
            }
          </ul>
        </div>
      </div>
      
      <div className="left-side">
        {
          is_member &&
          <Share />
        }
        <Posts posts={posts} />
      </div>

    </div>
  )
}

export default Group
