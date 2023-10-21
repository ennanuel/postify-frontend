import { useState, useContext, useRef, useMemo } from 'react';
import { Add } from '@mui/icons-material';
import { IconButton } from '@mui/material';
import { AuthContext } from '../../context/authContext';
import { useParams } from 'react-router-dom';
import { convertToVideoTimeFormat, postContent } from '../../utils/post';
import { convertFileToBase64 } from '../../utils';

type Props = {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>
}

const CreatePost = ({ show, setShow }: Props) => {
    const { user } = useContext(AuthContext);
    const videoRef = useRef<HTMLVideoElement>(null);
    const { id } = useParams();
    const [{ post_desc, file }, setValues] = useState<{ post_desc: string; file: File | undefined; }>({ post_desc: '', file: undefined });
    const [video, setVideo] = useState({ name: '', src: '', duration: 0 });
    const [error, setError] = useState('');
    const videoDuration = useMemo(() => convertToVideoTimeFormat(video.duration), [video]);

    const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        setValues(prev => ({ ...prev, post_desc: e.target.value }));
        setError('');
    };
    const handleLoadedData = () => setVideo(prev => ({ ...prev, duration: videoRef.current?.duration || 0 }))
    const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
        try {
            if (!e.target.files) return;
            const file = e.target.files[0];
            const fileName = file.name;
            const fileSrc = await convertFileToBase64(file);
            setValues(prev => ({ ...prev, file: file }));
            setVideo({ name: fileName, src: fileSrc + '#t', duration: 0 });
            setError('');
        } catch (error) {
            setError(String(error));
        }
    };
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        try {
            const user_id = user.id;
            const channel_id = id;
            const post_bg = 'none';
            const post_type = 'video';
            const files = file ? [file] : [];
            await postContent({ user_id, channel_id, post_desc, post_bg, post_type, files });
            setValues({ post_desc: '', file: undefined });
            setVideo({ src: '', name: '', duration: 0 });
            setError('');
        } catch (error) {
            setError(String(error));
        }
    };

    return (
        <div
            className={`backdrop-blur-md bg-black-900/60 z-[999] fixed top-0 left-0 w-[100vw] h-[100vh] flex items-center justify-center transition-opacity ${show ? '' : 'opacity-0 pointer-events-none p-2 md:p-8'}`}>
            <form onSubmit={handleSubmit} className={`relative w-full max-w-[400px] bg-black-600 border border-white/20 p-4 rounded-md flex flex-col gap-3 transition-[transform,opacity] origin-bottom ${ !show && 'scale-y-50 opacity-0'}`}>
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
                <div style={{ maxHeight: error ? '32px' : '0'}} className="flex items-center px-1 gap-2 bg-red-400/20 rounded-md overflow-hidden transition-[max-height]">
                    <hr className="w-1 my-1 h-[25px] bg-red-600 rounded-md border-none outline-none" />
                    <p className="flex-1 text-sm">{error}</p>
                    <button type="button" onClick={() => setError('')} className="flex items-center justify-center rotate-45 text-red-400">
                        <Add fontSize="small" />
                    </button>
                </div>
                <textarea value={post_desc} onChange={handleChange} name="post_desc" placeholder="Description" className="h-[80px] p-2 rounded-md bg-white/10 w-full text-sm" />
                <input type="file" id="files" onChange={handleFileChange} name="files" className="hidden" accept="video/mp4" />
                <label htmlFor="files" className="block cursor-pointer">
                    {
                        !video.src ?
                            <span className="w-fit max-w-[200px] p-1 pl-3 text-sm h-[36px] rounded-[18px] flex items-center jusity-center bg-white/10 cursor-pointer">
                                <span className="w-full truncate mr-2">Add Video</span>
                                <span className="flex items-center justify-center p-1 w-fit aspect-square rounded-full bg-black-900">
                                    <Add />
                                </span>
                            </span> :
                            <div className="w-full grid grid-cols-[60px,1fr] grid-rows-2 p-2 gap-x-2 gap-y-1 rounded-lg hover:bg-green-400/20">
                                <video
                                    ref={videoRef}
                                    src={video.src}
                                    onLoadedData={handleLoadedData}
                                    className="row-span-2 aspect-square rounded-md object-cover"
                                />
                                <p className="truncate flex-1 font-semibold">{video.name}</p>
                                <p className="font-bold text-sm text-right px-2 max-w-fit bg-green-400/20 text-green-300 flex items-center justify-center rounded-sm">{videoDuration}</p>
                            </div>
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
