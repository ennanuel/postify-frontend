import { Add, EditOutlined } from '@mui/icons-material'
import { useState, useEffect, useContext } from 'react'
import { APIURL } from '../../assets/data'
import { AuthContext } from '../../context/authContext';

type FormValTypes = {
  name: string;
  desc: string;
  tags: string[];
  invites: string[];
}

type UserType = {
  id: string;
  name: string;
  profile_pic: string;
}

const CreateGroup = () => {
  const { user } = useContext(AuthContext)

  const [tag, setTag] = useState('')
  const [{ name, desc, tags, invites }, setValues] = useState<FormValTypes>({ name: '', desc: '', tags: [], invites: [] })
  const [friends, setFriends] = useState<UserType[]>([])
  
  useEffect(() => {
    const fetchFriends = async () => {
      const response = await fetch(`${APIURL}/friend/${user.id}`)
  
      if(response.status != 200) return alert('something went wrong')
  
      const res = await response.json()
      setFriends(res)
    }
    fetchFriends()

  }, [])

  const handleChange : React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValues( prev => ({...prev, [e.target.name]: e.target.value }))
  }

  const handleInvites = (user_id: string, exists : boolean) => {
    setValues( prev => {
      if(exists) return {...prev, invites: prev.invites.filter( item => item !== user_id )}
      return { ...prev, invites: [...prev.invites, user_id] }
    })
  }

  const addTag = () => {
    setValues( prev => {
      if(tag.length < 1 || prev.tags.includes(tag)) return prev
      setTag('')
      return {...prev, tags: [...prev.tags, tag]}
    })
  }

  const removeTag = (tagName: string) => {
    setValues( prev => ({...prev, tags: prev.tags.filter( item => item != tagName )}))
  }

  const handleSubmit : React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    const requestBody = { user_id: user.id, group_name: name, group_desc: desc, tags, invites };

    for(let [key, value] of Object.entries(requestBody)) {
      if(value.length < 1 && key !== 'invites' && key !== 'tags') return alert(`'${key.toUpperCase()}' field cannot be empty`)
    }

    const fetchOptions = {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json; charset=UTF-8"
      }
    }

    const response = await fetch(`${APIURL}/group/create`, fetchOptions);
    if(response.status !== 200) return alert('something went wrong')
    const res = await response.json()
    return alert(res.message)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative w-full h-[50vh]">
        <div className="absolute bottom-5 left-5">
          <img className="h-[120px] aspect-square rounded-full bg-white/5" src="" alt="" />
          <button type="button" className="absolute top-1 right-1 flex items-center justify-center h-[30px] aspect-square rounded-full bg-[#3f7fff] shadow-lg">
            <EditOutlined sx={{ fontSize: '1.2rem' }} />
          </button>
        </div>
        <img className="h-[50vh] w-full rounded-lg" src="" alt="" />
        <button type="button" className="absolute bottom-5 right-5 flex items-center justify-center h-[50px] aspect-square rounded-full bg-[#3f7fff] shadow-lg">
          <EditOutlined />
        </button>
      </div>
      <div className="flex flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-3xl font-bold truncate max-w-full">
            <span>{name || 'New Group'}</span> 
            <span className="font-normal text-xl"> ({invites.length} Invites)</span>
          </h2>
          <button className="py-2 px-4 rounded-md bg-[#152648] text-[#83abfb] font-semibold">Create Group</button>
        </div>
        <div className="flex gap-4 mt-4">
          <div className="flex-[2] flex flex-col gap-4">
            <input 
              className="w-full p-2 border rounded-lg" 
              value={name} 
              onChange={handleChange} 
              name="name" 
              type="text" 
              placeholder="Group Name" 
            />
            <input 
              className="w-full p-2 border rounded-lg" 
              value={desc}
              onChange={handleChange}
              name="desc"
              type="text" 
              placeholder="About Group" 
            />
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <input 
                  className="w-full p-2 border rounded-lg" 
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
                    <button type="button" key={i} onClick={() => removeTag(item)} className="h-[30px] rounded-[15px] text-sm flex justify-center items-center gap-1 bg-white text-black-900 pl-2 pr-1">
                      <span>{item}</span>
                      <span className="rotate-45 flex items-center justify-center"><Add /></span>
                    </button>
                  ))
                }
              </div>
            </div>
          </div>
          <ul className="flex-1 flex flex-col gap-2 px-2">
            {
              friends?.map( (user, i) => {
                const exists = invites.includes(user.id);

                return (
                  <li key={i} className={`w-full flex gap-2 p-1 rounded-lg ${exists ? 'bg-white/10' : 'bg-white/5'} items-center`}>
                    <img className="h-[40px] aspect-square rounded-md bg-white/30" src={user.profile_pic} alt="" />
                    <p className="flex-1 text-sm">{user.name}</p>
                    <button type="button" 
                      onClick={() => handleInvites(user.id, exists)} 
                      className={`h-[35px] aspect-square rounded-full ${exists ? 'bg-black-900 rotate-45 text-white' : 'bg-[#3f7fff]'}`}
                    >
                      <Add />
                    </button>
                  </li>
              )})
            }
          </ul>
        </div>
      </div>
    </form>
  )
}

export default CreateGroup
