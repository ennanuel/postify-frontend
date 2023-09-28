import { useState, useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FavoriteOutlined, KeyboardArrowDown, MessageOutlined, Videocam } from '@mui/icons-material'
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

const ProfileVideos = () => {
  const { id } = useParams();

  const { name } = useContext(ProfileContext)

  const [videos, setVideos] = useState<PostType[]>([]);

  const fetchVideos = async () => {
    const response = await fetch(`${APIURL}/user/posts/${id}?type=photo`, fetchOptions)
    if (response.status !== 200) return alert('something went wrong')
    const res = await response.json();
    setVideos(res)
  }

  useEffect(() => { fetchVideos() }, [])

  return (
    <div className="profile-photos">
      <div className="title-filter">
        <h3 className="title">Videos of { name }</h3>
        <button className="text-sm">
          <span>Sort Videos</span>
          <KeyboardArrowDown />
        </button>
      </div>
      <ul className="photos">
        {
          videos.map(({ id, file, file_count, like_count, comment_count }) => (
            <li key={id}>
              <Link to={`/post/${id}`} className="photo">
                <p className="type"><Videocam />{file_count}</p>
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

export default ProfileVideos
