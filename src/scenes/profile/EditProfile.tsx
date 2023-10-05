import { useContext, useEffect, useMemo, useState } from 'react';
import { Check, EditRounded, Add } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/authContext';
import { APIURL } from '../../assets/data';
import { fetchOptions } from '../../assets/data/data';
import './editprofile.scss';

interface WorkType { company: string; role: string; }; 
interface EducationType { school: string; degree: string; start: string; end: string; };

type EditValueTypes = {
    name: string;
    username: string;
    profile_pic: File | undefined;
    cover: File | undefined;
    bio: string;
    email: string;
    phone: string;
    address: string;
    country: string;
    work: WorkType;
    education: EducationType;
    hobbie: string;
    relationship: boolean;
}

const EditProfile = () => {
    const { user } = useContext(AuthContext)
    const months = useMemo(() => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], [])
    const [{ name, username, profile_pic, cover, bio, email, phone, address, country, work, education, hobbie, relationship }, setValues] =
        useState<EditValueTypes>({
            name: '',
            username: '',
            profile_pic: undefined,
            cover: undefined,
            bio: '',
            email: '',
            phone: '',
            address: '',
            country: '',
            work: { company: '', role: '' },
            education: { school: '', degree: '', start: '', end: '' },
            hobbie: '',
            relationship: false
        })
    const [{ profile_img, cover_img }, setImgs] = useState({ profile_img: '', cover_img: '' });
    const [{ hobbies, schools }, setInterests] = useState<{ hobbies: string[], schools: EducationType[] }>({ hobbies: [], schools: [] })

    const handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        setValues(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        if (!e.target.files) return;
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => setImgs(prev => ({ ...prev, [e.target.id]: reader.result }))
        setValues(prev => ({ ...prev, [e.target.name]: file }));
    }

    const handleChangeOthers: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setValues(prev => {
            const key = e.target.name as 'education' | 'work';
            if (!prev[key]) return prev;
            return {
                ...prev,
                [key]: { ...prev[key], [e.target.id]: e.target.value }
            }
        })
    }

    const addInterest: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        if (!e.target) return;
        const target = e.target as HTMLButtonElement
        setValues(prev => ({ ...prev, [target.id]: target.id === 'education' ? { school: '', degree: '', start: '', end: '' } : '' }))
        setInterests(prev => { 
            const key = target.name as keyof typeof prev
            if (key === 'hobbies' && !hobbies.includes(hobbie) && hobbies) {
                return { ...prev, hobbies: [...hobbies, hobbie] }
            } else if (key === 'schools' && !schools.some(elem => elem.school !== education.school) && education.school ) {
                return { ...prev, schools: [...schools, education] }
            } else return prev;
        });
    }

    const removeInterest: React.MouseEventHandler<HTMLButtonElement> = (e) => {
        if (!e.target) return;
        const target = e.target as HTMLButtonElement;
        setInterests(prev => {
            const key = target.name as keyof typeof prev;
            const values = key === 'hobbies' ? hobbies : schools;
            const filteredValue = values.filter((elem, i) => i !== Number(target.value) || 0)
            console.log(values[Number(target.value)], target.value)
            return { ...prev, [key]: filteredValue }
        })
    }

    async function getUserValues() { 
        const response = await fetch(`${APIURL}/user/edit/${user.id}`, fetchOptions);
        const res = await response.json();
        if (response.status !== 200) return alert(res.message);
        const { schools, hobbies, profile_pic, cover, ...rest } = res;
        setValues( prev => ({ ...prev, ...rest }) );
        setInterests({ schools, hobbies });
        setImgs({ profile_img: `${APIURL}/image/profile_pics/${profile_pic}`, cover_img: `${APIURL}/image/covers/${cover}` })
    }

    const handleSubmit : React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault()
        const requestBody = { user_id: user.id, name, username, profile_pic, cover, bio, email, phone, address, country };
        const formData = new FormData();
        const headers = new Headers();
        for(let [key, value] of Object.entries(requestBody)) {
            if (!value || value?.length < 1 && key !== 'website') {
                return alert(`'${key}' field cannot be empty`)
            } else {
                formData.append(key, value);
            }
        }
        formData.append('work_string', JSON.stringify(work));
        formData.append('relationship_string', JSON.stringify(relationship));
        formData.append('hobbies_string', JSON.stringify(hobbies));
        formData.append('education_string', JSON.stringify(schools));
        headers.append('Access-Control-Allow-Origin', APIURL)
            
        const options = { ...fetchOptions, method: "PUT", body: formData, headers }

        const response = await fetch(`${APIURL}/user/edit`, options);
        const res = await response.json()
        return alert(res.message)
    }

    useEffect(() => {
        getUserValues();
    }, [])

    return (
        <div className="edit-profile min-h-[100vh] lg:px-[13%]">
            <label htmlFor="cover_img" className="relative w-full h-[150px] md:h-[300px] block">
                <img src={cover_img} alt="" className="w-full h-full rounded-b-lg" />
                <span className="edit_img absolute bottom-5 right-5 flex items-center justify-center h-[50px] aspect-square rounded-full">
                    <EditRounded fontSize="large" />
                </span>
            </label>
            <div className='p-4 flex flex-col items-center justify-center gap-4 mb-4'>
                <label htmlFor="profile_img" className="w-[120px] mt-[-100px] aspect-square relative block">
                    <img src={profile_img} alt="" className="profile_img border-[6px] w-full aspect-square rounded-full" />
                    <span className="edit_img absolute top-1 right-1 flex items-center justify-center h-[30px] aspect-square rounded-full bgedit_img ">
                        <EditRounded fontSize="small" />
                    </span>
                </label>
                <h3 className="font-bold text-2xl mt-6">Edit Profile</h3>
            </div>
            <form className="flex flex-col gap-6 md:mx-[5%] px-4" onSubmit={handleSubmit}>
                <div className="grid gris-cols-1 md:grid-cols-2 grid-rows-[repeat(8,40px)] md:grid-rows-[repeat(4,40px)] gap-4">
                    <input id="profile_img" onChange={handleFileChange} name="profile_pic" className="hidden" type="file" accept="image/jpg,image/jpeg,image/png" />
                    <input id="cover_img" onChange={handleFileChange} name="cover" className="hidden" type="file" accept="image/jpg,image/jpeg,image/png" />
                    <input name="name" value={name} onChange={handleChange} className="rounded-md bg-white/5 px-3" type="text" placeholder="Emmanuel Ezema" />
                    <input name="username" value={username} onChange={handleChange} className="rounded-md bg-white/5 px-3" type="text" placeholder="ennanuel" />
                    <input name="email" value={email} onChange={handleChange} className="rounded-md bg-white/5 px-3" type="email" placeholder="Email" />
                    <textarea name="bio" id="bio" value={bio} onChange={handleChange} placeholder="Bio" className="row-span-2 p-3 bg-white/5 rounded-md"></textarea>
                    <input name="phone" value={phone} onChange={handleChange} className="rounded-md bg-white/5 px-3" type="tel" placeholder="Phone Number" />
                    <input name="address" value={address} onChange={handleChange} className="bg-white/5 px-2 rounded-md" type="text" placeholder="Address" />
                    <input name="country" value={country} onChange={handleChange} className="bg-white/5 px-2 rounded-md" type="text" placeholder="Nationality" />
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="work" className="text-sm">Employment</label>
                    <div className="grid grid-cols-2 gap-4 h-[40px]">
                        <input id="company" name="work" onChange={handleChangeOthers} value={work.company} className="flex-1 bg-white/5 rounded-md h-full px-3" type="text" placeholder="Company" />
                        <input id="role" name="work" onChange={handleChangeOthers} value={work.role} className="flex-1 bg-white/5 rounded-md h-full px-3" type="text" placeholder="Role" />
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                        <div className="flex flex-col gap-2 col-span-2">
                            <label htmlFor="schools" className="text-sm">Education</label>
                            <div className="grid grid-cols-2 gap-2 h-[40px]">
                                <input id="school" name="education" value={education.school} onChange={handleChangeOthers} type="text" className="h-full px-2 bg-white/5 rounded-md" placeholder="School" />
                                <input id="degree" name="education" value={education.degree} onChange={handleChangeOthers} type="text" className="h-full px-2 bg-white/5 rounded-md" placeholder="Degree" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="start" className='text-sm'>From</label>
                            <input id="start" name="education" value={education.start} onChange={handleChangeOthers} className="h-[40px] rounded-md bg-white/5 px-2" type="date" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label htmlFor="end" className='text-sm'>To</label>
                            <input id="end" name="education" value={education.end} onChange={handleChangeOthers} className="h-[40px] rounded-md bg-white/5 px-2" type="date" />
                        </div>
                        <button id="education" name="schools" onClick={addInterest} type="button" className="flex items-center justify-center h-[40px] aspect-square rounded-full bg-white text-black-900">
                            <span className="flex items-center justify-center pointer-events-none"><Add /></span>
                        </button>
                    </div>
                    <ul className={`flex flex-col gap-2 ${schools.length < 1 && 'hidden'}`}>
                        {
                            schools.map(({ school, degree, start, end }, i) => {
                                const startDate = new Date(start);
                                const endDate = new Date(end);
                                return (
                                    <li
                                        key={i}
                                        className="flex items-center justify-between gap-1 pl-3 pr-1 py-1 min-h-[40px] text-sm bg-white/5 border border-white/5 rounded-sm hover:bg-white/5"
                                    >
                                        <p>
                                            Studied <span className='font-bold'>{degree}</span> at <span className="font-bold">{school}</span>
                                            {start && <span className="font-bold">{` (${months[startDate.getMonth()]} ${startDate.getDay()}, ${startDate.getFullYear()}`}</span>}
                                            {end && <span className="font-bold">{` - ${months[endDate.getMonth()]} ${endDate.getDay()}, ${endDate.getFullYear()})`}</span>}.
                                        </p>
                                        <button type="button" className='flex items-center justify-center rotate-45' name="schools" value={i} onClick={removeInterest}>
                                            <span className="flex items-center justify-center pointer-events-none"><Add /></span>
                                        </button>
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="hobbie" className="text-sm">Hobbies</label>
                    <div className="flex gap-2 items-center h-[40px]">
                        <input id="hobbie" name="hobbie" value={hobbie} onChange={handleChange} type="text" placeholder="Skiing" className="h-full px-2 rounded-md bg-white/5" />
                        <button id="hobbie" name="hobbies" type="button" onClick={addInterest} className="flex items-center justify-center h-full aspect-square rounded-full bg-white text-black-900">
                            <span className="flex items-center justify-center pointer-events-none"><Add /></span>
                        </button>
                    </div>
                    <ul className={`flex gap-2 flex-wrap ${hobbies.length < 1 && 'hidden'}`}>
                        {
                            hobbies.map((hobbie, i) => (
                                <li
                                    key={i}
                                    className="flex items-center justify-center gap-1 pl-3 pr-1 h-[40px] text-sm border border-white/10 rounded-md hover:bg-white/5"
                                >
                                    <span>{hobbie}</span>
                                    <button type="button" className='flex items-center justify-center rotate-45' name="hobbies" value={i} onClick={removeInterest}>
                                        <span className="flex items-center justify-center pointer-events-none"><Add /></span>
                                    </button>
                                </li>
                            ))
                        }
                    </ul>
                </div>
                <div className="flex flex-col gap-2">
                    <label htmlFor="not_single" className="text-sm">In a Relationship</label>
                    <div className="flex gap-2 h-[36px]">
                        <label htmlFor="not_single" className="flex items-center justify-center h-full w-[90px] gap-1 rounded-[18px] bg-white/5">
                            <input onClick={ () => setValues(prev => ({...prev, relationship: true})) } value='true' className="hidden" id="not_single" name="relationship" type="radio" />
                            <span>Yes</span>
                        </label>
                        <label htmlFor="single" className="flex items-center justify-center h-full w-[80px] gap-1 rounded-[18px] bg-white/5">
                            <input onClick={ () => setValues(prev => ({...prev, relationship: false})) } value='false' className="hidden" id="single" name="relationship" type="radio" />
                            <span>No</span>
                        </label>
                    </div>
                </div>
                <div className="flex p-4 justify-end gap-4">
                    <Link to="-1" className="flex items-center justify-center h-[40px] rounded-[20px] pl-3 pr-5 gap-1 bg-white/5">
                        <span className="flex items-center justify-center rotate-45">
                            <Add />
                        </span>
                        <span>Cancel</span>
                    </Link>
                    <button className="flex items-center justify-center h-[40px] rounded-[20px] pl-3 pr-5 gap-1 bg-white/5">
                        <Check />
                        <span>Save</span>
                    </button>
                </div>
            </form>
        </div>
    )
}

export default EditProfile
