import { Add, Edit } from "@mui/icons-material"
import { useContext, useState } from "react"
import { AuthContext } from "../../context/authContext"
import { APIURL } from '../../assets/data'


const CreateChannel = () => {
    const { user } = useContext(AuthContext)
    const [tags, setTags] = useState<string[]>([])
    const [{ name, channel_desc, website, tagName }, setValues] = useState({ name: '', channel_desc: '', website: '', tagName: '' })

    const handleChange : React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = async (event) => {
        setValues( (prev) => ({...prev, [event.target.name]: event.target.value }))
    }

    const addTag = () => {
        if (tagName.length < 1 || tags.includes(tagName)) return;
        setTags( prev => ([...prev, tagName]) )
        setValues(prev => ({ ...prev, tagName: '' }))
    }

    const removeTag = ( tag : string ) => {
        setTags( prev => prev.filter( (tag1) => tag1 !== tag ) )
    }

    const handleSubmit : React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        const requestBody = { user_id: user.id, name, channel_desc, website, tags };

        for(let [key, value] of Object.entries(requestBody)) {
        if(value.length < 1 && key !== 'website' && key !== 'tags') return alert(`'${key.toUpperCase()}' field cannot be empty`)
        }

        const fetchOptions = {
            method: "POST",
            body: JSON.stringify(requestBody),
            headers: {
                "Content-Type": "application/json; charset=UTF-8"
            }
        }

        const response = await fetch(`${APIURL}/channel/create`, fetchOptions);
        if(response.status !== 200) return alert('something went wrong')
        const res = await response.json()
        return alert(res.message)
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="relative h-[250px] bg-gradient-to-br from-gray-500/20 to-black-900/50 flex items-end justify-between">
                <img className="absolute w-full h-full top-0 left-0" src="" alt="" />
                <div className="flex relative w-[120px]">
                    <img src="" alt="" className="w-full m-4 aspect-square rounded-md bg-white/5" />
                    <button type="button" className="absolute top-0 right-0 w-[30px] aspect-square rounded-full bg-white text-black-900">
                        <Edit fontSize="small" />
                    </button>
                </div>
                <button type="button" className="absolute bottom-4 right-4 w-[60px] aspect-square rounded-full bg-white text-black-900 flex-items-center justify-center">
                    <Edit fontSize="large" />
                </button>
            </div>
            <div className="flex gap-4 p-6 items-center justify-between">
                <h2 className="text-2xl font-bold">{name || 'New Channel'}</h2>
                <button className="h-[34px] rounded-md bg-white text-black-900 font-bold px-4">Create Group</button>
            </div>
            <div className="grid grid-cols-2">
                <div className="flex flex-col gap-4 px-3">
                    <input onChange={handleChange} value={name} name="name" className="h-[46px] rounded-md px-3 bg-white/5" type="text" placeholder="Channel name" />
                    <input onChange={handleChange} value={website} name="website" className="h-[46px] rounded-md px-3 bg-white/5" type="text" placeholder="Website" />
                    <div className="flex items-center gap-2">
                        <input value={tagName} name="tagName" onChange={handleChange} className="h-[46px] rounded-md px-3 bg-white/5 flex-1" type="text" placeholder="Add Tag" />
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
                </div>
                <textarea onChange={handleChange} value={channel_desc} name="channel_desc" className="rounded-md bg-white/5 p-3 mx-3" placeholder="Channel description"></textarea>
            </div>
        </form>
    )
}

export default CreateChannel
