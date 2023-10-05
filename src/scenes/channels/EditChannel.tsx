import { Add, CheckRounded, DeleteForever, Edit } from "@mui/icons-material"
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useContext, useEffect, useState } from "react"
import { AuthContext } from "../../context/authContext"
import { APIURL } from '../../assets/data'
import { fetchOptions } from "../../assets/data/data"

type ChannelProps = {
    name: string;
    channel_desc: string;
    website: string;
    tags: string[];
    prev_pic: string;
    prev_cover: string;
    profile_pic: File|undefined;
    cover: File|undefined;
}

const EditChannel = () => {
    const { user } = useContext(AuthContext);

    const navigate = useNavigate();
    const { id } = useParams();

    const [tagName, setTagName] = useState('');
    const [{ channel_profile_pic, channel_cover }, setSrc] = useState({ channel_profile_pic: '', channel_cover: '' })
    const [{ name, channel_desc, website, tags, prev_pic, prev_cover, profile_pic, cover }, setValues] = useState<ChannelProps>({
        name: '', channel_desc: '', website: '', tags: [], prev_pic: '', prev_cover: '', profile_pic: undefined, cover: undefined
    })

    const handleChange : React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = async (event) => {
        setValues( (prev) => ({...prev, [event.target.name]: event.target.value }))
    }

    const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        if (!event.target.files) return;
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setSrc(prev => ({ ...prev, [event.target.id]: reader.result }))
        }
        setValues(prev => ({ ...prev, [event.target.name]: file }))
    }

    const addTag = () => {
        if (tagName.length < 1 || tags.includes(tagName)) return;
        setTagName('')
        setValues(prev => ({ ...prev, tagName: '', tags: [...prev.tags, tagName] }))
    }

    const removeTag = ( tag : string ) => {
        setValues( prev => ({...prev, tags: prev.tags.filter( (tag1) => tag1 !== tag )}) )
    }

    async function fetchInfo() {
        const response = await fetch(`${APIURL}/channel/info/${id}?user_id=${user.id}`, fetchOptions);
        const { message, name, picture, cover, channel_desc, tags, website } = await response.json();
        if (response.status !== 200) return alert(message);
        setValues(prev => ({ ...prev, prev_pic: picture, prev_cover: cover, name, channel_desc, tags, website }));
        setSrc({ channel_profile_pic: `${APIURL}/image/profile_pics/${picture}`, channel_cover: `${APIURL}/image/covers/${cover}` });
    }

    const handleSubmit : React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        const requestBody = { channel_id: id || '', user_id: user.id, name, channel_desc, website, prev_cover, prev_pic, profile_pic, cover };
        const formData = new FormData();
        const headers = new Headers();

        for(let [key, value] of Object.entries(requestBody)) {
            const pardon = /[website|profile_pic|cover|prev_cover|prev_profile]/;
            if ((!value || value?.length < 1) && !pardon.test(key)) {
                console.log(pardon.test(key), key)
                return alert(`'${key.toUpperCase()}' field cannot be empty`);
            } else if(value) {
                formData.append(key, value);
            }
        }
        tags.forEach( tag => formData.append('tags', tag) )
        headers.append('Access-Control-Allow-Origin', APIURL)
        
        const options = { ...fetchOptions, method: "PUT", body: formData, headers }

        const response = await fetch(`${APIURL}/channel/edit`, options);
        const res = await response.json()
        return alert(res.message)
    }

    async function deleteChannel() {
        const options = { ...fetchOptions, method: "DELETE", body: JSON.stringify({ user_id: user.id, channel_id: id }) };
        const response = await fetch(`${APIURL}/channel/delete`, options);
        const { message } = await response.json();
        alert(message);
        if(response.status === 200) navigate('/groups/list')
    }

    useEffect(() => { fetchInfo() }, [])

    return (
        <div>
            <div className="relative h-[250px] bg-gradient-to-br from-gray-500/20 to-black-900/50 flex items-end justify-between">
                <label htmlFor="channel_cover" className="absolute block w-full h-full top-0 left-0 cursor-pointer">
                    <img className="w-full h-full" src={channel_cover} alt="cover_image" />
                </label>
                <label htmlFor="channel_profile_pic" className="block m-4 relative w-[120px] aspect-square cursor-pointer">
                    <img src={channel_profile_pic} alt="channel_picture" className="w-full h-full rounded-md bg-white/5 shadow-lg shadow-black-900/50" />
                    <span className="absolute top-[-5px] right-[-5px] w-[30px] aspect-square rounded-full bg-white text-black-900 flex items-center justify-center shadow shadow-black-900/50">
                        <Edit fontSize="small" />
                    </span>
                </label>
                <span className="absolute bottom-4 right-4 w-[60px] aspect-square rounded-full bg-white text-black-900 flex items-center justify-center shadow-black-900 pointer-events-none">
                    <Edit fontSize="large" />
                </span>
                <input id="channel_profile_pic" name="profile_pic" onChange={handleFileChange} accept="image/jpg,image/jpeg,image/png" type="file" className="hidden" />
                <input id="channel_cover" name="cover" onChange={handleFileChange} accept="image/jpg,image/jpeg,image/png" type="file" className="hidden" />
            </div>
            <div className="flex flex-col lg:flex-row gap-4 p-6 lg:items-center">
                <h2 className="text-2xl font-bold flex-1">Edit Channel</h2>
                <div className="flex gap-4">
                    <Link to={`channels/info/${id}`} className="h-[34px] rounded-[17px] bg-white text-black-900 font-bold pr-3 pl-1 flex items-center justify-center">
                        <span className="flex items-center justify-center rotate-45"><Add /></span>
                        <span>Cancel</span>
                    </Link>
                    <button className="h-[34px] rounded-[17px] bg-white/10 text-white font-bold pr-3 pl-1 flex items-center justify-center">
                        <CheckRounded />
                        <span>Save</span>
                    </button>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 p-4 gap-4">
                <input onChange={handleChange} value={name} name="name" className="h-[46px] rounded-md px-3 bg-white/5" type="text" placeholder="Channel name" />
                <textarea onChange={handleChange} value={channel_desc} name="channel_desc" className="rounded-md row-span-2 bg-white/5 p-3" placeholder="Channel description"></textarea>
                <input onChange={handleChange} value={website} name="website" className="h-[46px] rounded-md px-3 bg-white/5" type="text" placeholder="Website" />
                <div className="flex items-center gap-2">
                    <input value={tagName} name="tagName" onChange={(e) => setTagName(e.target.value)} className="h-[46px] rounded-md px-3 bg-white/5 flex-1" type="text" placeholder="Add Tag" />
                    <button type="button" onClick={addTag} className="flex items-center justify-center bg-white text-black-900 w-[40px] aspect-square rounded-full"><Add /></button>
                </div>
                    <div className="flex items-center gap-2">
                        {
                            tags.map( (tag, i) => (
                                <button
                                    key={i}
                                    className="h-[30px] rounded-md bg-white px-2 text-black-900 text-sm flex items-center justify-center"
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                >
                                    <span className="rotate-45 ml-[-3px] flex items-center justify-center">
                                        <Add fontSize="small" />
                                    </span>
                                    <span>{tag}</span>
                                </button>
                            ))
                        }
                    </div>
            </form>
            <button
                type="button"
                onClick={deleteChannel}
                className="h-[40px] m-4 rounded-md bg-red-600/20 text-red-400 font-bold pr-3 pl-1 flex items-center justify-center border border-transparent hover:border-red-600/50"
            >
                <DeleteForever />
                <span>Delete Channel</span>
            </button>
        </div>
    )
}

export default EditChannel
