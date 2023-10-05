import { useState, useContext, useEffect } from 'react'; 
import { Link, useParams } from 'react-router-dom';
import { FavoriteOutlined, KeyboardArrowDown, MessageOutlined, PhotoOutlined } from '@mui/icons-material';
import { ProfileContext } from '../../pages/profile';
import { APIURL } from '../../assets/data';
import { fetchOptions } from '../../assets/data/data';

type PostType = {
  id: string;
  file: string;
  file_count: string;
  like_count: string;
  comment_count: string;
}

const ProfilePhotos = () => {
  const { id } = useParams();

  const { name } = useContext(ProfileContext)

  const [photos, setPhotos] = useState<PostType[]>([]);

  const fetchPhotos = async () => {
    const response = await fetch(`${APIURL}/user/posts/${id}?type=photo`, fetchOptions)
    if (response.status !== 200) return alert('something went wrong')
    const res = await response.json();
    setPhotos(res)
  }

  useEffect(() => { fetchPhotos() }, [])

  return (
    <div className="profile-photos px-4">
      <div className="flex items-center justify-between text-white mt-4">
        <h3 className="text-xl font-bold ">Photos of { name }</h3>
        <button className="text-sm flex items-center justify-center gap-1 rounded-md bg-white/5 pr-1 pl-2 py-1">
          <span>Sort</span>
          <KeyboardArrowDown />
        </button>
      </div>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
        {
          photos.map(({ id, file, file_count, like_count, comment_count }) => (
            <li key={id}>
              <Link to={`/post/${id}`} className="photo">
                <p className="type"><PhotoOutlined />{file_count}</p>
                <img src={file} alt="" />
                <div className="overlay">
                  <div className="reaction">
                    <FavoriteOutlined />
                    <span>{like_count}</span>
                  </div>
                  <div className="reaction">
                    <MessageOutlined />
                    <span>{comment_count}</span>
                  </div>
                </div>
              </Link>
            </li>
          ))
        }
      </ul>
    </div>
  )
}

export default ProfilePhotos
