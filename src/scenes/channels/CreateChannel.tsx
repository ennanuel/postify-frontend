import { Add, Edit } from "@mui/icons-material"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext"
import { CreateChannelValues } from "../../types/channel.types";
import { createChannel } from "../../utils/channel";
import { convertFileToBase64 } from "../../utils";

const CreateChannel = () => {
    const { user } = useContext(AuthContext)
    const [tagName, setTagName] = useState('')
    const [{ channel_profile_pic, channel_cover }, setSrc] = useState({ channel_profile_pic: '', channel_cover: '' })
    const [{ name, channel_desc, website, tags, profile_pic, cover }, setValues] = useState<CreateChannelValues>({ name: '', channel_desc: '', website: '', tags: [], profile_pic: undefined, cover: undefined })
    const navigate = useNavigate();

    const handleChange : React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (event) => {
        setValues( (prev) => ({...prev, [event.target.name]: event.target.value }))
    }

    const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
        try {
            if (!event.target.files) return;
            const file = event.target.files[0];
            const fileSrc = convertFileToBase64(file);
            setSrc(prev => ({ ...prev, [event.target.id]: fileSrc }));
            setValues(prev => ({ ...prev, [event.target.name]: file }));
        } catch (error) {
            console.error(error);
        }
    }
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        try {
            e.preventDefault();
            await createChannel({ user_id: user.id, name, channel_desc, tags, website, profile_pic, cover });
            navigate('/channels/all');
        } catch (error) {
            console.error(error);
        }
    };
    function addTag() {
        if (tagName.length < 1 || tags.includes(tagName)) return;
        setTagName('')
        setValues(prev => ({ ...prev, tags: [...prev.tags, tagName] }))
    };
    function removeTag( tag : string ) {
        setValues( prev => ({...prev, tags: prev.tags.filter( (tag1) => tag1 !== tag )}) )
    };

    return (
        <form className="lg:col-span-2" onSubmit={handleSubmit}>
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
            <div className="flex gap-4 p-6 items-center justify-between">
                <h2 className="text-2xl font-bold">{name || 'New Channel'}</h2>
                <button className="h-[34px] rounded-md bg-white text-black-900 font-bold px-4">Create Channel</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                    <input onChange={handleChange} value={name} name="name" className="h-[46px] rounded-md px-3 bg-white/5" type="text" placeholder="Channel name" />
                <textarea onChange={handleChange} value={channel_desc} name="channel_desc" className="rounded-md row-span-2 bg-white/5 p-3" placeholder="Channel description"></textarea>
                    <input onChange={handleChange} value={website} name="website" className="h-[46px] rounded-md px-3 bg-white/5" type="text" placeholder="Website" />
                    <div className="flex gap-2">
                        <input value={tagName} name="tagName" onChange={(e) => setTagName(e.target.value)} className="h-[46px] rounded-md px-3 bg-white/5 flex-1" type="text" placeholder="Add Tag" />
                        <button type="button" onClick={addTag} className="flex items-center justify-center bg-white text-black-900 w-[40px] h-[40px] rounded-full"><Add /></button>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
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
            </div>
        </form>
    )
}

export default CreateChannel
