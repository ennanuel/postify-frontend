import { useState, useEffect, useContext } from 'react';
import { FavoriteOutlined, KeyboardArrowDown, MessageOutlined, PhotoAlbum } from '@mui/icons-material'
import { APIURL } from '../../assets/data';
import { useParams } from 'react-router-dom';
import { GroupContext } from '../../pages/group';
import { fetchOptions } from '../../assets/data/data';

type PostType = {
  id: string;
  file: string;
  file_count: string;
  like_count: string;
  comment_count: string;
}

const GroupPhotos = () => {
  const { id } = useParams()

  const { refreshPost: refresh } = useContext(GroupContext)

  const [photos, setPhotos] = useState<PostType[]>([])

  const fetchVideos = async () => {
    const response = await fetch(`${APIURL}/group/posts/${id}?type=photo`, fetchOptions)
    if (response.status !== 200) return alert('something went wrong')
    const res = await response.json();
    setPhotos(res)
  }
  
  useEffect(() => {
    fetchVideos()
  }, [refresh])

  return (
    <div className="group-photos">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xl">Photos</h3>
        <button className="h-[35px] pl-3 pr-2 text-sm font-semibold text-black-900 flex items-center justify-center gap-1 rounded-[17.5px] bg-gray-200">
          <span>Filter Photos</span>
          <KeyboardArrowDown />
        </button>
      </div>
      <ul className="photos">
        {
          photos.map( ({id, file, like_count, comment_count, file_count}) => (
            <li key={id} className="photo">
              <div className="type">
                <span>{file_count}</span>
                <PhotoAlbum />
              </div>
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
            </li>
          ))
        }
        </ul>
    </div>
  )
}

export default GroupPhotos
