import { CalendarToday, PeopleAltRounded, Person } from '@mui/icons-material'
import { Posts, Share } from '../../components'
import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../context/authContext'
import { useParams } from 'react-router-dom'
import { APIURL } from '../../assets/data'
import { GroupContext } from '../../pages/group'
import { PostType } from '../../types/post.types'
import { fetchGroupPosts, getGroupInfo } from '../../utils/group'
import { GroupInfo } from '../../types/group.types';

const Group = () => {
  const { id } = useParams()
  
  const { user } = useContext(AuthContext)
  const { refreshPost: refresh, group: { is_member } } = useContext(GroupContext)

  const [{ group_desc, creator, members, tags, photos }, setGroupInfo] = useState<GroupInfo>({} as GroupInfo)
  const [posts, setPosts] = useState<PostType[]>([]);
  
  useEffect(() => {
    getGroupInfo({ group_id: id, user_id: user.id, fetchType: 'full' })
      .then(res => setGroupInfo(res))
      .catch(error => alert(error));
    fetchGroupPosts({ group_or_user_id: id, user_id: user.id })
      .then(res => setPosts(res))
      .catch(error => alert(error));
  }, [id])

  useEffect(() => alert('someone posted something'), [refresh])

  return (
    <div className='group-det grid grid-cols-1 md:grid-cols-[300px,1fr] gap-4 md:gap-0'>
      <div className="right-side p-4">
        <div className="menu">
          <h3 className="px-2 lg:px-0 font-bold">About</h3>
          <p className="text-left mt-2">{group_desc}</p>
          <ul className="details pt-2">
            <li className="flex item-start justify-start gap-2">
              <Person /> 
              <p>
                <span>Created by </span>
                <span className="font-bold">{ creator }</span>
              </p>
            </li>
            <li className="flex item-start justify-start gap-2">
              <CalendarToday /> 
              <p>                  
                <span>Created on</span> 
                <span> 30th January, 2002</span>
              </p>
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
          <div className="px-2 lg:px-0 menu-top">
            <h3 className="font-bold">Photos</h3>
            <p>See all</p>
          </div>
          <ul className="photos">
            {
              photos?.slice(0,6)?.map((photo, i) => <li key={i}><img src={`${APIURL}/image/post_images/${photo}`} alt="" /></li>)
            }
          </ul>
        </div>
      </div>
      
      <div className="left-side flex flex-col gap-4 md:p-4">
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
