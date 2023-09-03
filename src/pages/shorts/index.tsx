import { Favorite, KeyboardArrowDown, KeyboardArrowUp, MessageRounded, Share, VolumeMute, SendRounded, AddRounded } from '@mui/icons-material'
import './shorts.scss';

const Shorts = () => {
  return (
    <div className="shorts">
      <div className="left">
        <button className="close btn">
          <AddRounded />
        </button>
        <div className="navigate-shorts">
          <button className="btn"><KeyboardArrowUp /></button>
          <button className="btn"><KeyboardArrowDown /></button>
        </div>
        <div className="video"></div>
        <button className="btn mute">
          <VolumeMute />
        </button>
      </div>
      <div className="right">
        <div className="info">
          <div className="user">
            <img src="" alt="" />
            <div className="user-info">
              <p className="name">Emmanuel Ezema</p>
              <p className="date">20 August, 2023</p>
            </div>
            <button>Follow</button>
          </div>
          <p className="desc">Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam amet velit quidem itaque? Illo laudantium ducimus adipisci ab, repellendus omnis est! Eius, commodi illo. Libero suscipit nihil a non dolor.</p>
        </div>
        <div className="reactions">
          <button className="reaction">
            <Favorite />
            <span>22.4K</span>
          </button>
          <button className="reaction">
            <MessageRounded />
            <span>25K</span>
          </button>
          <button>
            <Share />
            <span>302</span>
          </button>
        </div>
        <div className="short-comments">
          <h3>Comments (25K)</h3>
          <ul className="container">
            <li className="comment">
              <img src="" alt="" />
              <div className="info">
                <p className="name">Emmanuel Ezema</p>
                <p className="time">2 hrs ago</p>
                <p className="message">Yesterday I woke to see that I have spent my whole life being a bitch ass nigga!</p>
                <div className="reactions">
                  <button className="reaction">
                    <span>22</span>
                    <Favorite />
                  </button>
                  <button className="reaction">
                    <span>30</span>
                    <MessageRounded />
                  </button>
                  <button className="reply">
                    Reply
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div className="leave-comment">
          <img src="" alt="" />
          <input type="text" placeholder="Leave a comment" />
          <button><SendRounded /></button>
        </div>
      </div>
    </div>
  )
}

export default Shorts
