import { useState, useContext } from 'react';
import { Add } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { AuthContext } from '../../context/authContext';
import { APIURL } from '../../assets/data'
import { fetchOptions } from '../../assets/data/data';
import { useParams } from 'react-router-dom';

type Props = {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>
}

const CreatePost = ({ show, setShow }: Props) => {
    const { user, socket } = useContext(AuthContext);
    const { id } = useParams()
    const [{ post_desc, files }, setValues] = useState<{ post_desc: string; files: File }>({ post_desc: '', files: {} as File })

    const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        setValues(prev => ({...prev, post_desc: e.target.value}))
    }

    const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return;
        const file = e.target.files[0]
        setValues(prev => ({ ...prev, files: file }))
    }
    
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        const requestBody = {
            user_id: user.id,
            channel_id: id || '',
            post_desc,
            post_bg: 'none',
            post_type: 'video',
            type: 'channel',
            files
        };
        const formData = new FormData();
        const headers = new Headers();
        for(let [key, value] of Object.entries(requestBody)) {
            if (!value && key !== 'files') return alert(`'${key}' field cannot be empty`)
            formData.append(key, value)
        }
        headers.append('Access-Control-Allow-Origin', APIURL)
        const options = { ...fetchOptions, method: "POST", body: formData, headers }

        const response = await fetch(`${APIURL}/post/create`, options);
        const res = await response.json()
        alert(res.message)
        
        if(response.status === 200) socket.emit('post-action', { channel_id: id })
    }

    return (
        <div
            className={`backdrop-blur-md bg-black-900/60 z-[999] fixed top-0 left-0 w-[100vw] h-[100vh] flex items-center justify-center transition-opacity duration-500 ${show ? '' : 'opacity-0 pointer-events-none p-8'}`}>
            <form onSubmit={handleSubmit} className={`relative w-full max-w-[400px] bg-black-600 border border-white/20 p-4 rounded-md flex flex-col gap-3 transition-[transform,opacity] origin-bottom ${ !show && 'scale-75 opacity-0'}`}>
                <IconButton
                    onClick={() => setShow(false)}
                    sx={{
                        transform: 'rotate(45deg)',
                        height: '36px',
                        width: '36px',
                        color: 'white',
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        '&:hover': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        }
                    }}
                >
                    <Add />
                </IconButton>
                <h2 className="text-lg font-bold">Post Video</h2>
                <textarea value={post_desc} onChange={handleChange} name="post_desc" placeholder="Description" className="h-[80px] p-2 rounded-md bg-white/10 w-full text-sm" />
                <label htmlFor="files" className="w-fit max-w-[200px] p-1 pl-3 text-sm h-[36px] rounded-[18px] flex items-center jusity-center bg-white/10 cursor-pointer">
                    <input type="file" id="files" onChange={handleFileChange} name="files" className="hidden" accept="video/mp4" />
                    <span className="w-full truncate mr-2">{files?.name || 'Add Video'}</span>
                    {
                        !files?.name &&
                        <span className="flex items-center justify-center p-1 w-fit aspect-square rounded-full bg-black-900">
                            <Add />
                        </span>
                    }
                </label>
                <IconButton
                    type="submit"
                    sx={{
                        backgroundColor: 'rgb(200, 200, 200)',
                        border: '1px solid white',
                        borderRadius: '5px',
                        fontSize: '14px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '5px',
                        '&:hover': {
                            backgroundColor: 'transparent',
                            color: 'white'
                        }
                    }}
                >
                    <span>Post Video</span>
                </IconButton>
            </form>
        </div>
    )
}

export default CreatePost
