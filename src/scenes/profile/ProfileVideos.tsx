import { useState, useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FavoriteOutlined, KeyboardArrowDown, MessageOutlined, PermMedia, Videocam } from '@mui/icons-material'
import { ProfileContext } from '../../pages/profile';
import { APIURL } from '../../assets/data';
import { fetchOptions } from '../../assets/data/data';

type PostType = {
  id: string;
  file: string;
  post_type: 'text' | 'photo' | 'video';
  file_count: string;
  like_count: string;
  comment_count: string;
}

const ProfileVideos = () => {
  const { id } = useParams();

  const { name } = useContext(ProfileContext)

  const [videos, setVideos] = useState<PostType[]>([]);

  const fetchVideos = async () => {
    const response = await fetch(`${APIURL}/user/posts/${id}?type=video`, fetchOptions)
    if (response.status !== 200) return alert('something went wrong')
    const res = await response.json();
    setVideos(res)
  }

  useEffect(() => { fetchVideos() }, [])

  return (
    <div className="profile-photos px-4">
      <div className="flex items-center justify-between text-white mt-4">
        <h3 className="text-xl font-bold ">Videos of { name }</h3>
        <button className="text-sm flex items-center justify-center gap-1 rounded-md bg-white/5 pr-1 pl-2 py-1">
          <span>Sort</span>
          <KeyboardArrowDown />
        </button>
      </div>
      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4">
        {
          videos.map(({ id, file, file_count, like_count, post_type, comment_count }) => (
            <li key={id}>
              <Link to={`/post/${id}`} className="w-full aspect-square relative overflow-clip rounded-lg flex items-center justify-center gap-4 text-white bg-white/5">
                <p className="absolute top-0 right-0 p-2 flex items-center justify-center gap-1"><PermMedia />{file_count}</p>
                {
                  post_type === 'photo' ?
                    <img src={`${APIURL}/image/post_images/${file}`} alt="" /> :
                    <video src={`${APIURL}/video/post_videos${file}#t`} />
                }
                <div className="absolute top-0 left-0 w-full h-full bg-black-900/50 flex gap-4 items-center justify-center">
                  <div className="flex flex-col gap-1">
                    <FavoriteOutlined />
                    <span>{like_count}</span>
                  </div>
                  <div className="flex flex-col gap-1">
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
