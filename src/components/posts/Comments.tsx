import { useContext } from 'react';
import { comments } from '../../assets/data/comments'
import { AuthContext } from '../../context/authContext'

const Comments = () => {
    const { user } = useContext(AuthContext)

    return (
        <div className="comments">
            <div className="write">
                <img src={user.profile_pic} alt={user.name} />
                <input type="text" placeholder="Write a comment" />
                <button>Send</button>
            </div>

            {
                comments.map( ({id, message }) => (
                    <div className="comment" key={id}>
                        <img src="" alt=""  />
                        <div className="info">
                            <span>Emmanuel Ezema</span>
                            <p>{ message }</p>
                        </div>
                        <span className="date">1 hour ago</span>
                    </div>
                ))
            }
        </div>
    )
}

export default Comments
