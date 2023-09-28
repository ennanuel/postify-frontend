import "./share.scss";
import { useContext, useRef, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { profile_pic } from "../../assets/images";
import { PermMediaOutlined, EmojiEmotionsOutlined, AddRounded, VideoCameraBack, CheckOutlined } from "@mui/icons-material";
import { APIURL } from "../../assets/data";
import { fetchOptions, post_bgs } from "../../assets/data/data";
import { useLocation, useParams } from "react-router-dom";

type FormDataType = {
  post_desc: string;
  files: File[];
  post_type: 'text' | 'photo' | 'video';
  post_bg: string;
}

const Share = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const [{ post_type, post_bg, post_desc, files }, setPost] = useState<FormDataType>({ post_type: 'text', post_bg: 'none', post_desc: '', files: [] });
  const [images, setImages] = useState<{ id: string, src: string }[]>([])

  const { user, socket } = useContext(AuthContext);
  const formRef = useRef<HTMLFormElement>(null);
  const imagesRef = useRef<HTMLUListElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPost( prev => ({...prev, [e.target.name]: e.target.value}) )
  }

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      const file = e.target.files[0]
      const reader = new FileReader()
      const post_type = /video/i.test(file.type) ? 'video' : 'photo'

      if (file.size > 1024*1024*3) {
        return alert('file size too big!')
      }

      reader.readAsDataURL(file)
      reader.onload = () => {
          setImages( prev => [...prev, { id: file.name, src: String(reader.result || '') }] )
      };
      setPost(prev => ({ ...prev, files: [...prev.files, file], post_type }))
    }
  }

  const removeImage = (id: string) => {
    setPost(prev => ({
      ...prev,
      files: prev.files.filter(file => file.name !== id),
      post_type: prev.files.length === 1 ? 'text' : 'photo'
    }))
    setImages( prev => prev.filter( image => image.id !== id ))
  }

  const handleSubmit : React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    const headers = new Headers();
    headers.append('Access-Control-Allow-Origin', APIURL)
    
    formData.append('user_id', user.id);
    formData.append('post_type', post_type);
    formData.append('post_desc', post_desc);
    formData.append('post_bg', post_bg);
    files.forEach(file => {
      formData.append('files', file)
    });

    if (/group/i.test(pathname)) {
      formData.append('type', 'group')
      formData.append('group_id', id || '');
    } else if (/channel/i.test(pathname)) {
      formData.append('type', 'channel')
      formData.append('channel_id', id || '');
    }

    const options : RequestInit = { ...fetchOptions, headers, method: 'POST', body: formData }
    const response = await fetch(APIURL + '/post/create', options);
    const { message } = await response.json()
    if(response.status !== 200) {
      alert(message);
      return;
    } else {
      setPost({ post_desc: '', post_bg: 'none', files: [], post_type: 'text' })
      setImages([])
      socket.emit('post-action', { user_id: user.id })
    }
  }

  return (
    <div className="share rounded-[20px] mb-8">
      <form onSubmit={handleSubmit} ref={formRef} className="relative container p-[10px] flex flex-col gap-2">
        <div className="top flex items-center gap-[10px]">
          <img 
            className="rounded-full h-[40px] aspect-square"
            src={user.profile_pic || profile_pic}
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
          {
            post_type !== 'video' &&
            <input onChange={handleFileChange} className="hidden" type="file" id="file_photo" name="file" accept='images/png,image/jpg,image/jpeg' />
          }
          {
            post_type !== 'photo' &&
            <input onChange={handleFileChange} className="hidden" type="file" id="file_video" name="file" accept='video/mp4' /> 
          }
        </div>
        <div
          style={{
            maxHeight: (post_type !== 'text' && images.length < 1) || (post_type === 'text' && post_desc.length < 1) ?
              '0px' :
              imagesRef?.current?.offsetHeight + 'px',
          }}
          className="relative overflow-clip transition-[max-height]"
        >
          {
            post_type === 'text' ?
              <ul ref={imagesRef} className={`flex h-[40px] gap-2 origin-top-left transition-[transform,opacity] ${post_desc.length < 1 && 'scale-50 opacity-0'}`}>
                {
                  Object.entries(post_bgs).map(([key, { from, via, to }], i) => (
                    <li key={i} className="relative h-full aspect-square rounded-full border border-transparent hover:border-white/20 transition-transform active:scale-90">
                      <span
                        className={`pointer-events-none h-full flex items-center justify-center aspect-square rounded-full bg-gradient-to-br transition-transform ${from} ${via} ${to} ${post_bg !== key && 'scale-90'}`}
                      >
                        { post_bg === key ? <CheckOutlined /> : null}
                      </span>
                      <input id={key} type="radio" name="post_bg" value={key} onChange={handleChange} className="absolute top-0 left-0 z-1 opacity-0 w-full h-full" />
                    </li>
                  ))
                }
              </ul> :
              post_type === 'photo' ?
              <ul ref={imagesRef} className="grid grid-cols-6 gap-3 px-3">
                {
                  images.map(({ id, src }) => (
                    <li
                      onClick={() => removeImage(id)}
                      className="relative border border-transparent rounded-md hover:border-red-600 p-[2px]"
                    >
                      <img key={id} className="w-full aspect-square rounded-md" src={src} />
                      <button type="button" className="absolute top-1 right-1 w-5 flex items-center justify-center rotate-45 aspect-square rounded-full bg-red-600 text-white">
                        <AddRounded fontSize="small" />
                      </button>
                    </li>
                  ))
                }{
                  images.length < 6 &&
                  <label htmlFor='file_photo' className={`aspect-square flex items-center justify-center border border-transparent rounded-md hover:border-blue-600 pointer-cursor origin-top-right transition-transform ${images.length < 1 && 'scale-50'}`}>
                    <span className="w-[40px] aspect-square rounded-full bg-white text-black-900 flex items-center justify-center">
                      <AddRounded fontSize="large" />
                    </span>
                  </label>
                }
            </ul> :
            <ul ref={imagesRef} className="grid grid-cols-6 gap-3 px-3">
                {
                  images.map(({ id, src }) => (
                    <li
                      onClick={() => removeImage(id)}
                      className="relative border border-transparent rounded-md hover:border-red-600 p-[2px]"
                    >
                      <video key={id} className="w-full aspect-square rounded-md object-cover" src={src} controls={false} autoPlay={true} />
                      <button type="button" className="absolute top-1 right-1 w-5 flex items-center justify-center rotate-45 aspect-square rounded-full bg-red-600 text-white">
                        <AddRounded fontSize="small" />
                      </button>
                    </li>
                  ))
                }{
                  images.length < 6 &&
                  <label htmlFor='file_video' className={`aspect-square flex items-center justify-center border border-transparent rounded-md hover:border-blue-600 pointer-cursor origin-top-right transition-transform ${images.length < 1 && 'scale-50'}`}>
                    <span className="w-[40px] aspect-square rounded-full bg-white text-black-900 flex items-center justify-center">
                      <AddRounded fontSize="large" />
                    </span>
                  </label>
                }
            </ul>
          }
        </div>
        <hr className="border-none h-[.5px]" />
        <div className="bottom flex items-center justify-between">
          <div className="left flex items-center gap-[5px]">
            {
              post_type !== 'video' &&
              <label htmlFor="file_photo" className="h-[40px] rounded-[20px] flex items-center justify-center gap-[5px] px-[15px] hover:bg-white/5">
                <PermMediaOutlined />
                <span className="text-[14px]">Add Image</span>
              </label>
            }
            {
              post_type !== 'photo' &&
                <label htmlFor="file_video" className="h-[40px] rounded-[20px] flex items-center justify-center gap-[5px] px-[15px] hover:bg-white/5">
                  <VideoCameraBack />
                  <span className="text-[14px]">Add Video</span>
                </label>
            }
            <button type="button" className="h-[40px] rounded-[20px] flex items-center justify-center gap-[5px] px-[15px] hover:bg-white/5">
              <EmojiEmotionsOutlined />
              <span className="text-[14px]">Feeling</span>
            </button>
          </div>
          <div className="right">
            <button className="border-none h-[40px] px-[15px] text-white rounded-[20px] flex items-center justify-center">Share</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Share;
