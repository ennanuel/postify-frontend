import { useContext } from 'react';
import { stories } from "../../assets/data/stories"
import { AddAPhoto } from '@mui/icons-material';
import { AuthContext } from "../../context/authContext"
import './stories.scss'

const Stories = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="stories-container">
      <div className="stories">
        <div className="story add-story">
          <img src={ user.profilePic } alt={ user.name } />
          <button><AddAPhoto /></button>
          <span>Add Story</span>
        </div>
        {
          stories.map( (story) => (
            <div className="story" key={story.id}>
              <img src={ story.img } alt="Story" />
              <div className="user-profile"></div>
              <span>{ story.name }</span>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Stories

