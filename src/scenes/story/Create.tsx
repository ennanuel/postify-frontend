import { useContext, useState } from 'react'
import { AddRounded, CheckRounded, PermMediaRounded, Add } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { APIURL } from '../../assets/data'
import { fetchOptions } from '../../assets/data/data'
import { AuthContext } from '../../context/authContext'
import { post_bgs } from '../../assets/data/data'

type PropTypes = {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

type StoryValues = {
    story_desc: string;
    story_bg: 'none' | 'red' | 'blue' | 'black' | 'white';
    story_type: 'text' | 'photo' | 'video';
    files: File[]
}

const CreateStory = ({ show, setShow } : PropTypes) => {
    const { user, socket } = useContext(AuthContext);
    const [fileName, setFileName] = useState('');
    const [{ story_desc, story_bg, story_type, files }, setStory] = useState<StoryValues>({ story_desc: '', story_bg: 'none', story_type: 'text', files: [] });

    if (!show) return;

    const handleChange : React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setStory( prev => ({...prev, [e.target.name]: e.target.value}) )
    }

    const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        setStory(prev => ({ ...prev, files: [file], story_type: /image/i.test(file.type) ? 'photo' : 'video' }));
        setFileName(file.name);
    }

    const removeFile = () => {
        setStory(prev => ({ ...prev, files: [], story_type: 'text' }));
        setFileName('');
    }

    const handleSubmit : React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        const values = { user_id: user.id, story_desc, story_bg, story_type }
        const body = new FormData()
        const headers = new Headers();
        for (let [key, value] of Object.entries(values)) {
            if (!value && key !== 'file') {
                return alert(`${key} cannot be empty`);
            }
            body.append(key, value)
        }
        files.forEach(file => body.append('files', file));
        headers.append('Access-Control-Allow-Origin', APIURL);
        const options = { ...fetchOptions, method: "POST", body, headers }

        const response = await fetch(APIURL + '/story/create', options);
        if (response.status !== 200) return alert('something went wrong')
        const res = await response.json();
        
        alert(`Successful: ${res.message}`);
        socket.emit('story-action', { user_id: user.id })
    }
    
    return (
        <div className="fixed z-[9999] top-0 left-0 w-[100vw] h-[100vh] backdrop-blur-lg bg-black-900/50 flex items-center justify-center">
            <form onSubmit={handleSubmit} className="relative p-[20px] text-white bg-black-900 border border-white/10 rounded-md w-[500px] flex flex-col gap-[15px] items-stretch">
                <button type="button" onClick={() => setShow(false)} className="absolute top-2 right-2 flex items-center justify-center h-[40px] w-[40px] rounded-md bg-red-600/20 text-red-300 hover:bg-red-600/50">
                    <span className="flex items-center justify-center rotate-45">
                        <AddRounded fontSize="large" />
                    </span>
                </button>
                <h3 className="text-lg font-bold mb-2">Post Story</h3>
                <div className="flex item-stretch h-[45px] gap-2">
                    <img src="" alt="" className="w-[45px] h-full bg-white/10 rounded-full" />
                    <input
                        name='story_desc'
                        className="flex-1 px-4 rounded-[23px] h-full border border-white/20 outline-none"
                        type="text"
                        placeholder="What do you want to talk about?"
                        value={story_desc}
                        onChange={handleChange}
                        required={true}
                    />
                </div>

                <IconButton sx={{
                    display: fileName ? 'none' : 'block',
                    height: '40px',
                    transition: 'min-height 0.3s ease',
                    borderRadius: '20px',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: 'white',
                    fontSize: '1rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                    <label htmlFor="files" className="flex items-center justify-center gap-2">
                        <PermMediaRounded /><span>Add Image / Video</span>
                    </label>
                    <input id="files" name="files" onChange={handleFileChange} type="file"  className="hidden" accept="image/jpg,image/jpeg,image/png,video/mp4" />
                </IconButton>
                <div className="relative">
                    <div className={`absolute top-0 left-0 w-full h-full flex items-center origin-bottom-right transition-[opacity,transform] ${!fileName && 'scale-50 opacity-0 pointer-events-none'}`}>
                        <button type="button" onClick={removeFile} className="truncate text-sm flex items-center justify-center gap-1 rounded-[20px] bg-white/5 border border-white/10 h-[40px] pl-3 pr-1">
                            {fileName}
                            <span className="flex items-center justify-center rotate-45"><Add /></span>
                        </button>
                    </div>
                    <ul className={`bg flex items-stretch gap-[10px] text-sm font-bold origin-top-left transition-[opacity,transform] ${fileName && 'scale-50 opacity-0 pointer-events-none'}`}>
                        {
                            Object.entries(post_bgs).map(([key, { from, via, to }]) => (
                                <li key={key} className={`relative w-[50px] aspect-square rounded-full bg-gradient-to-br ${from} ${via} ${to} flex items-center justify-center overflow-hidden hover:scale-100 active:scale-75 hover:opacity-100 transition-transform ${story_bg === key ? 'scale-100' : 'scale-90'}`}>
                                    { story_bg === key && <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex items-center justify-center bg-black-50"><CheckRounded /></div>}
                                    <input type="radio" value={key} onChange={handleChange} name="story_bg" className="w-full h-full opacity-0" />
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <IconButton sx={{
                    height: '40px',
                    borderRadius: '5px',
                    backgroundColor: 'rgba(0, 76, 255, 0.2)',
                    color: 'rgb(104, 139, 220)',
                    fontSize: '1rem',
                    border: '1px solid rgba(0, 76, 255, 0.4)'
                }} type="submit" className="bg-white text-">Post Story</IconButton>
            </form>
        </div>
    )
}

export default CreateStory
