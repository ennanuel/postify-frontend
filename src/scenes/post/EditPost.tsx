import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { APIURL } from '../../assets/data';
import './editpost.scss';
import { fetchOptions, post_bgs } from '../../assets/data/data';
import { Add, Check, CheckRounded, DeleteForever, PermMediaRounded, VideocamRounded, KeyboardArrowLeft } from '@mui/icons-material';

type EditType = {
  post_desc: string;
  post_bg: 'none' | 'blue' | 'red' | 'black' | 'white';
  post_type: 'text' | 'photo' | 'video';
  group_id: string|null;
  channel_id: string|null;
  files: string[];
  to_delete: string[];
  editFiles: File[];
}

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  const [media, setMedia] = useState<{ id: string; name: string; src: string; old: boolean }[]>([]);
  const [{ post_desc, post_bg, post_type, files, editFiles, group_id, channel_id, to_delete }, setPostValues] = useState<EditType>({
    post_desc: '',
    post_bg: 'none',
    post_type: 'text',
    files: [],
    editFiles: [],
    group_id: null,
    channel_id: null,
    to_delete: []
  });

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setPostValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => setMedia(prev => [
      ...prev, {
        id: Date.now() + file.name,
        name: file.name,
        src: String(reader.result || ''),
        old: false
      }]
    );
    setPostValues(prev => ({
      ...prev,
      post_type: /video/.test(file.type) ? 'video' : 'photo',
      editFiles: [...prev.editFiles, file]
    }));
  }

  const removeImage = ({ name, id, old }: { name: string; id: string; old: boolean }) => {
    if (old && !to_delete.includes(name)) {
      setPostValues(prev => ({
        ...prev,
        post_type: media.length <= 1 ? 'text' : prev.post_type,
        to_delete: [...prev.to_delete, name]
      }))
    } else {
      setPostValues(prev => ({
        ...prev,
        post_type: media.length <= 1 ? 'text' : prev.post_type,
        editFiles: prev.editFiles.filter((file) => file.name !== name)
      }));
    }
    setMedia(prev => prev.filter(file => file.id !== id));
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault(); 
    const formData = new FormData();
    const headers = new Headers();
    const requestBody = { post_id: id || '', user_id: user.id, post_type, post_desc, post_bg };
    for (let [key, value] of Object.entries(requestBody)) {
      if (!value || value?.length <= 0) return alert(`${key} cannot be empty`);
      formData.append(key, value);
    }
    headers.append('Access-Control-Allow-Origin', APIURL)
    if (group_id) formData.append('group_id', group_id);
    if (channel_id) formData.append('channel_id', channel_id);
    editFiles.forEach(file => formData.append('files', file));
    files.forEach(file => formData.append('post_files[]', file));
    to_delete.forEach(file => formData.append('to_delete[]', file));

    const options : RequestInit = { ...fetchOptions, headers, method: 'PUT', body: formData }
    const response = await fetch(APIURL + '/post/edit', options);
    const { message } = await response.json()
    alert(message);
  };

  async function deletePost() {
    const requestBody = { user_id: user.id, post_id: id || '' }
    const options: RequestInit = { ...fetchOptions, method: 'DELETE', body: JSON.stringify(requestBody) }
    const response = await fetch(APIURL + '/post/delete', options);
    const { message } = await response.json();
    alert(message);
    if (response.status === 200) {
      navigate(-1);
    }
  }

  async function fetchDetails() {
    const response = await fetch(`${APIURL}/post/${id}?user_id=${user.id}`, fetchOptions);
    const res = await response.json();
    if (response.status !== 200) return alert(res.message);
    const media = res.files.map(
      (file: string) => ({
        id: file,
        name: file,
        old: true,
        src: `${APIURL}/${res.post_type === 'video' ? 'video/post_videos' : 'image/post_images'}/${file}`
      })
    )
    setMedia(media);
    setPostValues({...res, editFiles: [], to_delete: []})
  }

  useEffect(() => { fetchDetails() }, [])

  return (
    <section className="edit-post h-[100vh] fixed top-0 left-0 z-[9999] lg:relative lg:h-[calc(100vh_-_60px)] grid grid-cols-1 grid-rows-[auto,1fr] lg:grid-rows-1 lg:grid-cols-2 gap-4 lg:gap-[10%] p-4 lg:p-6">
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className="flex items-center gap-2 lg:hidden">
          <button type="button" onClick={() => navigate(-1)} className="float-left flex items-center justify-center"><KeyboardArrowLeft /></button>
          <h3 className="font-bold text-2xl">
            Edit Post
          </h3>
        </div>
        <input
          name="post_desc"
          id="post_desc"
          value={post_desc}
          onChange={handleChange}
          type="text"
          className="h-[60px] rounded-lg px-3 bg-white/5 border border-white/10 focus:bg-transparent"
          placeholder="post description"
        />
        <div className="flex items-center gap-2 flex-wrap">
          <ul className={`flex-1 flex items-center gap-2 ${post_type !== 'text' && 'hidden'}`}>
            {
              Object.entries(post_bgs).map(([value, { from, via, to }]) => (
                <li key={value} className={`relative overflow-clip h-[50px] aspect-square rounded-full bg-gradient-to-br ${from} ${via} ${to} transition-transform active:scale-75 ${value === post_bg ? 'scale-100' : 'scale-90'}`}>
                  {
                    value === post_bg &&
                    <div className="absolute top-0 left-0 w-full h-full bg-black-900/50 pointer-events-none flex items-center justify-center">
                      <CheckRounded />
                    </div>
                  }
                  <input type="radio" name="post_bg" id={value} value={value} onChange={handleChange} className="w-full h-full opacity-0" />
                </li>
              ))
            }
          </ul>
          <label htmlFor="photo" className={`h-[40px] rounded-md px-3 flex gap-2 items-center justify-center bg-white/5 hover:bg-white/10 ${post_type === 'video' && 'hidden'}`}>
              <PermMediaRounded />
              <span>Add Image</span>
          </label>
          <label htmlFor="video" className={`h-[40px] rounded-md px-3 flex gap-2 items-center justify-center bg-white/5 hover:bg-white/10 ${post_type === 'photo' && 'hidden'}`}>
              <VideocamRounded />
              <span>Add Video</span>
          </label>
        </div>
        <input
          id="photo"
          className="hidden"
          onChange={handleFileChange}
          type="file"
          accept="image/jpg,image/jpeg,image/png"
        />
        <input
          id="video"
          type="file"
          onChange={handleFileChange}
          className='hidden'
          accept="video/mp4"
        />
        <ul className="grid grid-cols-5 flex-1">
          {
            media.length > 0 && media.map(({ name, id, old, src }, i) => (
              <li key={i} onClick={() => removeImage({name, id, old})} className='p-1 relative rounded-md border border-transparent hover:border-red-500 w-full aspect-square'>
                {
                  post_type === 'photo' ?
                    <img src={src} className="w-full h-full rounded-md object-cover" /> :
                    <video src={src+'#t'} className='w-full h-full rounded-md object-cover'></video>
                }
                <button type="button" className="absolute top-2 right-2 flex items-center justify-center w-[20px] h-[20px] rounded-full bg-red-600 rotate-45"><Add /></button>
              </li>
            ))
          }
        </ul>
        <div className="flex items-center justify-between gap-3">
          <button type="button" onClick={deletePost} className="flex items-center justify-center gap-1 h-[44px] w-[44px] rounded-[22px] bg-red-500/20 text-red-400 scale-90 transition-transform hover:scale-100 active:scale-75">
            <DeleteForever />
          </button>
          <div className="flex-1 flex items-center gap-2 justify-end">
            <button className="flex items-center justify-center gap-1 h-[40px] rounded-[20px] bg-white/5 pl-2 px-3">
              <Check />
              <span>Save</span>
            </button>
            <button type="button" className="flex items-center justify-center gap-1 h-[40px] rounded-[20px] bg-white/5 pl-2 px-3">
              <span className="flex items-center justify-center rotate-45"><Add /></span>
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </form>
      <div className="flex justify-center items-center">
      <article className="p-3 rounded-md bg-white/5 shadow-lg shadow-black-900/50 flex flex-col gap-2 w-full h-full max-w-[500px]">
        <div className="flex gap-2 items-center">
          <img src="" alt="" className="w-[50px] aspect-square rounded-full boder border-white/5" />
          <div className="flex flex-col gap-2">
            <div className="w-[150px] h-[15px] rounded-md bg-white/5"></div>
            <div className="w-[80px] h-[15px] rounded-md bg-white/5"></div>
          </div>
          <div className="p-2"></div>
        </div>
        {
          post_type === 'text' ?
            <p className={`flex-1 text-3xl text-center font-bold flex items-center justify-center bg-gradient-to-br rounded-md p-4 ${post_bgs[post_bg] && post_bgs[post_bg].from} ${post_bgs[post_bg] && post_bgs[post_bg].via} ${post_bgs[post_bg] && post_bgs[post_bg].to}`}>
              {post_desc}
            </p> :
            <div className="flex-1 flex flex-col gap-3">
              <p className='w-full truncate'>{post_desc}</p>
              <ul className="flex-1 grid grid-cols-2 grid-rows-3 gap-4">
                {
                  media.map(({ src }, i) => (
                    <li className={`w-full h-full relative overflow-clip ${media.length === 1 && i === 0 ? 'col-span-2 row-span-3' : (media.length > 1 && i === 0) || media.length === 2 ? 'col-span-1 row-span-3' : media.length === 3 && i === 1  ? 'col-span-1 row-span-2' : '' }`}>
                      {
                        post_type === 'photo' ?
                          <img key={i} src={src} alt="" className="absolute top-0 left-0 rounded-md w-full h-full object-cover" /> :
                          <video key={i} className='absolute top-0 left-0 w-full h-full object-cover rounded-md' src={src} autoPlay={true} controls={false} />
                      }
                    </li>
                  ))
                }
              </ul>
            </div>
        }
        <div className="flex h-[35px] items-center gap-2">
          <button className='h-full w-[70px] rounded-[18px] bg-white/5'></button>
          <button className='h-full w-[70px] rounded-[18px] bg-white/5'></button>
          <button className='h-full w-[70px] rounded-[18px] bg-white/5'></button>
        </div>
      </article>
      </div>
    </section>
  )
}

export default EditPost
