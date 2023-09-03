import { useState, useContext, useRef } from 'react';
import { Add } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { AuthContext } from '../../context/authContext';
import { APIURL } from '../../assets/data'
import { useParams } from 'react-router-dom';

type Props = {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>
}

const CreatePost = ({ show, setShow }: Props) => {
    const { user } = useContext(AuthContext);
    const { id } = useParams()
    const [{ post_desc, files }, setValues] = useState({ post_desc: '', files: [] })

    const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        setValues(prev => ({...prev, [e.target.name]: e.target.value}))
    }
    
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        const requestBody = { user_id: user.id, channel_id: id, post_desc, files };

        for(let [key, value] of Object.entries(requestBody)) {
            if(!value && key !== 'files') return alert(`'${key}' field cannot be empty`)
        }

        const fetchOptions = {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        }

        const response = await fetch(`${APIURL}/channel/post`, fetchOptions);
        if(response.status !== 200) return alert('something went wrong')
        const res = await response.json()
        return alert(res.message)
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
                <label htmlFor="video" className="w-fit p-1 pl-3 text-sm h-[36px] rounded-[18px] flex items-center jusity-center gap-2 bg-white/10">
                <input type="file" id="video" className="hidden" />
                    <span>Add Video</span>
                    <span className="flex items-center justify-center p-1 w-fit aspect-square rounded-full bg-black-900">
                        <Add />
                    </span>
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
