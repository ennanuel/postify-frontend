import { Add, EditOutlined } from '@mui/icons-material'
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../context/authContext';
import { fetchFriends } from '../../utils/friend';
import { UserType } from '../../types/user.types';
import { CreateGroupValues } from '../../types/group.types';
import { submitGroupValues } from '../../utils/group';
import { convertFileToBase64 } from '../../utils';
import { useNavigate } from 'react-router-dom';

const CreateGroup = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [tag, setTag] = useState('')
  const [{ group_profile, group_cover }, setImages] = useState({ group_profile: '', group_cover: '' })
  const [{ name, group_desc, tags, invites, profile_pic, cover }, setValues] = useState<CreateGroupValues>({ name: '', group_desc: '', tags: [], invites: [], profile_pic: undefined, cover: undefined })
  const [friends, setFriends] = useState<UserType[]>([])

  const handleChange : React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setValues( prev => ({...prev, [e.target.name]: e.target.value }))
  }

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    try {
      if (!e.target.files) return;
      const file = e.target.files[0];
      const fileSrc = await convertFileToBase64(file)
      setImages(prev => ({ ...prev, [e.target.id]: fileSrc }));
      setValues(prev => ({ ...prev, [e.target.name]: file }));
    } catch (error) {
      console.error(error)
    }
  }

  function handleInvites(user_id: string, exists: boolean) {
    setValues(prev => {
      if (exists) return { ...prev, invites: prev.invites.filter(item => item !== user_id) }
      return { ...prev, invites: [...prev.invites, user_id] }
    })
  }
  function addTag () {
    setValues( prev => {
      if(tag.length < 1 || prev.tags.includes(tag)) return prev
      setTag('')
      return {...prev, tags: [...prev.tags, tag]}
    })
  }
  function removeTag (tagName: string) {
    setValues( prev => ({...prev, tags: prev.tags.filter( item => item != tagName )}))
  }

  const handleSubmit : React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()
    const requestBody = { user_id: user.id, name, group_desc, tags, profile_pic, cover };
    submitGroupValues(requestBody)
      .then(() => navigate(-1));
  }

  useEffect(() => { 
    fetchFriends(user.id)
      .then(res => setFriends(res))
      .catch(error => alert(error));
  }, [])

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative w-full h-[50vh]">
        <label htmlFor="group_profile" className="block absolute bottom-5 left-5 cursor-pointer">
          <img src={group_profile} alt="" className="h-[120px] aspect-square rounded-full bg-white/5 shadow-lg shadow-black-900/50" />
          <span className="absolute top-1 right-1 flex items-center justify-center h-[30px] aspect-square rounded-full bg-[#3f7fff] shadow-lg shadow-black-900/50">
            <EditOutlined sx={{ fontSize: '1.2rem' }} />
          </span>
        </label>
        <label htmlFor="group_cover" className="block h-[50vh] w-full rounded-lg">
          <img src={group_cover}   className="h-full w-full rounded-lg" />
          <span className="absolute bottom-5 right-5 flex items-center justify-center h-[50px] aspect-square rounded-full bg-[#3f7fff] shadow shadow-black-900/60">
            <EditOutlined />
          </span>
        </label>
      </div>
      <div className="flex flex-col gap-4 p-5">
        <div className="flex flex-col md:flex-row lg:items-center justify-between gap-4">
          <h2 className="text-3xl font-bold truncate max-w-full">
            <span className="truncate">{name || 'New Group'}</span> 
            <span className="font-normal text-xl"> ({invites.length} Invites)</span>
          </h2>
          <button className="py-2 px-4 rounded-md bg-[#152648] text-[#83abfb] font-semibold">Create Group</button>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mt-4">
          <div className="flex-[2] flex flex-col gap-4">
            <input 
              className="w-full p-2 bg-white/5 rounded-lg" 
              value={name} 
              onChange={handleChange} 
              name="name" 
              type="text" 
              placeholder="Group Name" 
            />
            <input 
              className="w-full p-2 bg-white/5 rounded-lg" 
              value={group_desc}
              onChange={handleChange}
              name="group_desc"
              type="text" 
              placeholder="About Group" 
            />
            <input type="file" name="profile_pic" id="group_profile" onChange={handleFileChange} className="hidden" accept="image/jpg,image/jpeg,image/png" />
            <input type="file" name="cover" id="group_cover" onChange={handleFileChange} className="hidden" accept="image/jpg,image/jpeg,image/png" />
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <input 
                  className="w-full p-2 bg-white/5 rounded-lg" 
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
          <h3 className="md:hidden font-bold text-xl">Invite</h3>
          <ul className="flex-1 flex flex-col gap-2 md:px-2">
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
