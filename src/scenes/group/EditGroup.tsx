import { Add, CheckRounded, DeleteForever, EditOutlined } from '@mui/icons-material'
import { useState, useEffect, useContext } from 'react'
import { APIURL } from '../../assets/data'
import { AuthContext } from '../../context/authContext';
import { fetchOptions } from '../../assets/data/data';
import { useNavigate, useParams } from 'react-router-dom';

type FormValTypes = {
    name: string;
    group_desc: string;
    tags: string[];
    prev_pic: string;
    prev_cover: string;
    profile_pic: File|undefined;
    cover: File|undefined;
}

const EditGroup = () => {
    const { user } = useContext(AuthContext);   
    const { id } = useParams();
    const navigate = useNavigate();

    const [tag, setTag] = useState('')
    const [{ group_profile, group_cover }, setImages] = useState({ group_profile: '', group_cover: '' })
    const [{ name, group_desc, tags, prev_pic, prev_cover, profile_pic, cover }, setValues] = useState<FormValTypes>({ name: '', group_desc: '', tags: [], prev_pic: '', prev_cover: '', profile_pic: undefined, cover: undefined })

    const handleChange : React.ChangeEventHandler<HTMLInputElement|HTMLTextAreaElement> = (e) => {
        setValues( prev => ({...prev, [e.target.name]: e.target.value }))
    }

    const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
        setImages( prev => ({ ...prev, [e.target.id]: reader.result}) )
        }
        setValues( prev => ({ ...prev, [e.target.name]: file }) )
    }

    const addTag = () => {
        setValues( prev => {
            if (tag.length < 1 || prev.tags.includes(tag)) return prev;
            setTag('');
            return { ...prev, tags: [...prev.tags, tag] };
        })
    }

    const removeTag = (tagName: string) => {
        setValues( prev => ({...prev, tags: prev.tags.filter( item => item != tagName )}))
    }

    const handleSubmit : React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        const requestBody = { user_id: user.id, group_id: id ||'', name, group_desc, prev_pic, prev_cover, profile_pic, cover };
        const formData = new FormData();
        const headers = new Headers();

        for(let [key, value] of Object.entries(requestBody)) {
        if ((!value || value?.length < 1) && /(group_desc|name|user_id|group_id)/.test(key)) {
            return alert(`'${key.toUpperCase()}' field cannot be empty`)
        } else if(value) {
            formData.append(key, value);
        }
        }
        tags.forEach( tag => formData.append('tags[]', tag) )
        headers.append('Access-Control-Allow-Origin', APIURL)
            
        const options = { ...fetchOptions, method: "PUT", body: formData, headers }

        const response = await fetch(`${APIURL}/group/edit`, options);
        const res = await response.json()
        return alert(res.message)
    }

    async function deleteGroup() {
        const options = { ...fetchOptions, method: "DELETE", body: JSON.stringify({ user_id: user.id, group_id: id }) };
        const response = await fetch(`${APIURL}/group/delete`, options);
        const { message } = await response.json();
        alert(message);
        if(response.status === 200) navigate('/groups/list')
    }

    async function getGroupInfo() { 
        const response = await fetch(`${APIURL}/group/info/${id}?user_id=${user.id}&type=full`, fetchOptions);
        const { message, name, group_desc, picture, cover, tags, owner } = await response.json();
        if (response.status !== 200) return alert(message);
        if(!owner) return navigate(-1)
        setValues(prev => ({ ...prev, name, group_desc, prev_pic: picture, prev_cover: cover, tags }));
        setImages({ group_profile: `${APIURL}/image/profile_pics/${picture}`, group_cover: `${APIURL}/image/covers/${cover}` })
    }
        
    useEffect(() => { getGroupInfo() }, [])

    return (
        <form onSubmit={handleSubmit} className="w-full">
        <div className="relative w-full h-[50vh]">
            <label htmlFor="group_profile" className="block absolute bottom-5 left-5 cursor-pointer">
            <img className="h-[120px] aspect-square rounded-full bg-white/5 shadow-lg shadow-black-900/50" src={group_profile} alt="" />
            <span className="absolute top-1 right-1 flex items-center justify-center h-[30px] aspect-square rounded-full bg-[#3f7fff] shadow-lg shadow-black-900/50">
                <EditOutlined sx={{ fontSize: '1.2rem' }} />
            </span>
            </label>
            <label htmlFor="group_cover" className="block h-[50vh] w-full rounded-lg">
            <img className="h-full w-full rounded-lg" src={group_cover} alt="" />
            <span className="absolute bottom-5 right-5 flex items-center justify-center h-[50px] aspect-square rounded-full bg-[#3f7fff] shadow shadow-black-900/60">
                <EditOutlined />
            </span>
            </label>
        </div>
            <div className="flex flex-col gap-4 p-5">
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-3xl font-bold truncate max-w-full">Edit Group</h2>
                    <div className="flex items-center gap-2">
                        <button className="pl-2 pr-4 h-[40px] rounded-[20px] flex items-center justify-center bg-[#2c2c2c] text-gray-200 font-semibold">
                            <span className="flex items-center justify-center rotate-45"><Add /></span>
                            <span>Cancel</span>
                        </button>
                        <button className="pl-2 pr-4 h-[40px] rounded-[20px] flex items-center justify-center bg-[#152648] text-[#83abfb] font-semibold">
                            <CheckRounded />
                            <span>Save</span>
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input 
                        className="w-full px-4 border border-white/20 bg-white/5 rounded-[20px] h-[40px]" 
                        value={name} 
                        onChange={handleChange} 
                        name="name" 
                        type="text"  
                        placeholder="Group Name" 
                    />
                    <input
                        type="file"
                        name="profile_pic"
                        id="group_profile"
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/jpg,image/jpeg,image/png" 
                    />
                    <textarea 
                        className="cols-span-1 row-span-2 w-full px-4 py-2 border border-white/20 bg-white/5 rounded-[20px]" 
                        value={group_desc}
                        onChange={handleChange}
                        name="group_desc"
                        placeholder="About Group" 
                    />
                    <input
                        type="file"
                        name="cover"
                        id="group_cover"
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/jpg,image/jpeg,image/png"
                    />
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-4">
                            <input 
                                className="w-full px-4 border border-white/20 bg-white/5 rounded-[20px] h-[40px]" 
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                                type="text" 
                                placeholder="Tag Name" 
                            />
                            <button type="button" onClick={addTag} className="h-[40px] aspect-square rounded-full bg-white text-black-900 flex items-center justify-center"><Add/></button>
                        </div>
                        <div className="flex items-center gap-2">
                            {
                                tags.map( (item, i) => (
                                    <button type="button" key={i} onClick={() => removeTag(item)} className="h-[30px] rounded-[15px] text-sm flex justify-center items-center bg-white text-black-900 pl-3 pr-1">
                                    <span>{item}</span>
                                    <span className="rotate-45 flex items-center justify-center"><Add /></span>
                                    </button>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
            <button type="button" onClick={deleteGroup} className="mx-6 mb-4 pl-2 pr-4 h-[40px] rounded-md flex items-center justify-center gap-2 bg-red-600/10 text-red-400 font-semibold border border-transparent hover:border-red-400/50">
                <DeleteForever />
                <span>Delete Group</span>
            </button>
        </form>
    )
}

export default EditGroup
