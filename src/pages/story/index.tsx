import { AddRounded, PauseRounded, MoreHoriz, VolumeOff, SendOutlined, FavoriteBorderOutlined } from '@mui/icons-material'
import './story.scss'

const Story = () => {
  return (
    <div className="stories-page">
      <div className="top">
        <h3 className="logo">postify</h3>
        <button>
          <AddRounded />
        </button>
      </div>
      <ul className="bottom">
        <li className="story">
          <div className="user-profile">
            <img src="" alt="" />
          </div>
          <p className="name">kill_dat_crocker</p>
          <p className="time">2h</p>
        </li>
        <li className="story">
          <div className="user-profile">
            <img src="" alt="" />
          </div>
          <p className="name">kill_dat_crocker</p>
          <p className="time">2h</p>
        </li>
        <li className="main-story">
          <div className="durations">
            <div className="duration">
              <div className="length"></div>
            </div>
            <div className="duration">
              <div className="length"></div>
            </div>
          </div>
          <div className="details-action">
            <img src="" alt="" />
            <p>kill_dat_crocker <span className="time">2h</span></p>
            <button className="pause"><PauseRounded /></button>
            <button className="mute"><VolumeOff /></button>
            <button className="menu"><MoreHoriz /></button>
          </div>
          <div className="reply">
            <input type="text" placeholder="Reply to Mike's Story" />
            <button><FavoriteBorderOutlined /></button>
            <button><SendOutlined /></button>
          </div>
        </li>
        <li className="story">
          <div className="user-profile">
            <img src="" alt="" />
          </div>
          <p className="name">kill_dat_crocker</p>
          <p className="time">2h</p>
        </li>
        <li className="story">
          <div className="user-profile">
            <img src="" alt="" />
          </div>
          <p className="name">kill_dat_crocker</p>
          <p className="time">2h</p>
        </li>
      </ul>
    </div>
  )
}

export default Story
