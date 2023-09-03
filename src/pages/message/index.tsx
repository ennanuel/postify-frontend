import { EmojiEmotionsOutlined, InfoOutlined, MoreHoriz, Search, SendRounded, PhotoOutlined } from '@mui/icons-material'
import './message.scss'

const index = () => {
    return (
        <section className="message">
            <article className="left">
                <div className="top">
                    <h2>Messages</h2>
                    <button><Search /></button>
                </div>
                <ul className="active-contacts">
                    <li><img src="" alt="" /></li>
                    <li><img src="" alt="" /></li>
                    <li><img src="" alt="" /></li>
                    <li><img src="" alt="" /></li>
                    <li><img src="" alt="" /></li>
                </ul>
                <ul className="contacts">
                    <li className="contact">
                        <img src="" alt="" />
                        <div className="info">
                            <p className="name">Emmanuel Ezema</p>
                            <div className="last-msg">This is a message concerning...</div>
                        </div>
                    </li>
                    <li className="contact">
                        <img src="" alt="" />
                        <div className="info">
                            <p className="name">Emmanuel Ezema</p>
                            <div className="last-msg">This is a message concerning...</div>
                        </div>
                    </li>
                    <li className="contact">
                        <img src="" alt="" />
                        <div className="info">
                            <p className="name">Emmanuel Ezema</p>
                            <div className="last-msg">This is a message concerning...</div>
                        </div>
                    </li>
                    <li className="contact">
                        <img src="" alt="" />
                        <div className="info">
                            <p className="name">Emmanuel Ezema</p>
                            <div className="last-msg">This is a message concerning...</div>
                        </div>
                    </li>
                </ul>
            </article>
            <article className="right">
                <div className="top">
                    <img src="" alt="" />
                    <div className="profile-info">
                        <div className="name">Emmanuel Ezema</div>
                        <div className="active-status">Active</div>
                    </div>
                    <button><InfoOutlined /></button>
                    <button><MoreHoriz /></button>
                </div>
                <div className="middle">
                    <div className="profile-info">
                        <img src="" alt="" />
                        <p className="name">Emmanuel Ezema</p>
                        <p className="username">body_killer</p>
                        <button>View profile</button>
                    </div>
                    <div className="timeframe">
                        <p className="day">02 August, 2022</p>
                        <ul className="messages">
                            <li className="msg sent">
                                <p>How far na gee</p>
                                <p className="time">22:00</p>
                            </li>
                            <li className="msg received">
                                <p>Who you dey call gee? You better know who tf you're talking to bitch</p>
                                <p className="time">12:00</p>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="bottom">
                    <button><EmojiEmotionsOutlined /></button>
                    <input type="text" placeholder="Message..." />
                    <button><PhotoOutlined /></button>
                    <button className="send"><SendRounded /></button>
                </div>
            </article>
        </section>
    )
}

export default index
