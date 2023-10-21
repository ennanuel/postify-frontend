import { useState, useEffect, useContext } from 'react';
import { KeyboardArrowDown } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { GroupContext } from '../../pages/group';
import { fetchGroupPosts } from '../../utils/group';
import { AuthContext } from '../../context/authContext';
import { PostType } from '../../types/post.types';
import { MediaCard } from '../../components/cards';

const GroupPhotos = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext)
  const { refreshPost: refresh } = useContext(GroupContext)
  const [photos, setPhotos] = useState<PostType[]>([]);
  
  useEffect(() => {
    fetchGroupPosts({ group_or_user_id: id, user_id: user.id, postType: 'photo' })
      .then(res => setPhotos(res))
      .catch(error => alert(error));
  }, [refresh])

  return (
    <div className="group-photos p-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl">Photos</h3>
        <button className="h-[35px] pl-3 pr-2 text-sm font-semibold text-black-900 flex items-center justify-center gap-1 rounded-[17.5px] bg-gray-200">
          <span>Filter Photos</span>
          <KeyboardArrowDown />
        </button>
      </div>
      <ul className="photos grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
        {
          photos.map( post => (
            <li key={post.id} className="photo">
              <MediaCard {...post} />
            </li>
          ))
        }
        </ul>
    </div>
  )
}

export default GroupPhotos
