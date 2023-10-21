import { useState, useEffect, useContext } from 'react';
import { FavoriteOutlined, KeyboardArrowDown, MessageOutlined, Videocam } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { GroupContext } from '../../pages/group';
import { AuthContext } from '../../context/authContext';
import { fetchGroupPosts } from '../../utils/group';
import { PostType } from '../../types/post.types';
import { MediaCard } from '../../components/cards';

const GroupVideos = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext)
  const { refreshPost: refresh } = useContext(GroupContext);
  const [videos, setVideos] = useState<PostType[]>([]);
  
  useEffect(() => {
    fetchGroupPosts({ group_or_user_id: id, user_id: user.id, postType: 'video' })
      .then(res => setVideos(res))
      .catch(error => alert(error));
  }, [refresh])

  return (
    <div className="group-photos p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl">Videos</h3>
        <button className="h-[35px] pl-3 pr-2 text-sm font-semibold text-black-900 flex items-center justify-center gap-1 rounded-[17.5px] bg-gray-200">
          <span>Filter Videos</span>
          <KeyboardArrowDown />
        </button>
      </div>
      <ul className="photos grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {
          videos.map( (post) => (
            <li key={post.id}>
              <MediaCard {...post} />
            </li>
          ))
        }
        </ul>
    </div>
  )
}

export default GroupVideos
