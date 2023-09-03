import "./share.scss";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { profilePic } from "../../assets/images";
import { PlaceOutlined, PermMediaOutlined, EmojiEmotionsOutlined } from "@mui/icons-material";
import { APIURL } from "../../assets/data";

const Share = () => {
  const [{ post_desc }, setPost] = useState({ post_desc: '' });

  const { user } = useContext(AuthContext);
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange : React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setPost( prev => ({...prev, [e.target.name]: e.target.value}) )
  }

  const handleSubmit : React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    
    const fetchOptions = {
      method: "POST",
      body: JSON.stringify({user_id: user.id, post_desc}),
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      }
    }

    console.log(user.id, post_desc)

    const response = await fetch(APIURL + '/post/create', fetchOptions);

    if(response.status !== 200) {
      alert('something went wrong');
      return;
    }

    const res = await response.json();
      alert(res.message);
  }

  return (
    <div className="share rounded-[20px] mt-4 mb-[20px]">
      <form onSubmit={handleSubmit} ref={formRef} className="container p-[10px]">
        <div className="top flex items-center gap-[10px]">
          <img 
            className="rounded-full h-[40px] aspect-square"
            src={user.profilePic || profilePic}
            alt=""
          />
          <input 
            className="w-full border-none outline-none p-[20px] bg-transparent rounded-[30px]"
            value={post_desc}
            onChange={handleChange}
            name="post_desc"
            type="text" 
            placeholder={`What's on your mind ${user.name}?`} 
          />
        </div>
        <hr className="mt-[20px] mb-[10px] border-none h-[.5px]" />
        <div className="bottom flex items-center justify-between">
          <div className="left flex items-center gap-[5px]">
            <input className="hidden" type="file" id="file" />
            <div className="item flex items-center justify-center gap-[10px] cursor-pointer">
              <label htmlFor="file">
                <button type="button" className="flex items-center justify-center gap-[5px] h-[40px] px-[15px] rounded-[20px]">
                  <PermMediaOutlined />
                  <span className="text-[14px]">Add Image / Video</span>
                </button>
              </label>
            </div>
            <div className="item flex items-center justify-center gap-[10px] cursor-pointer">
              <button type="button" className="flex items-center justify-center gap-[5px] h-[40px] px-[15px] rounded-[20px]">
                <PlaceOutlined />
                <span className="text-[14px]">Add Location</span>
              </button>
            </div>
            <div className="item flex items-center justify-center gap-[10px] cursor-pointer">
              <button type="button" className="flex items-center justify-center gap-[5px] h-[40px] px-[15px] rounded-[20px]">
                <EmojiEmotionsOutlined />
                <span className="text-[14px]">Feeling</span>
              </button>
            </div>
          </div>
          <div className="right">
            <button className="border-none py-[8px] px-[15px] text-white rounded-[8px]">Share</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Share;
