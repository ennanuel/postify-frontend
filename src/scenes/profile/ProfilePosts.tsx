import { useState, useContext, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { WorkRounded, SchoolRounded, HouseRounded, PlaceRounded, Favorite, FilterList } from "@mui/icons-material";
import { Posts } from "../../components";
import { ProfileContext } from '../../pages/profile';
import { APIURL } from '../../assets/data';
import { AuthContext } from '../../context/authContext';
import { fetchOptions } from '../../assets/data/data';

type UserType = {
  bio: string;
  education: { school: string; degree: string; start: string; end: string }[];
  address: string;
  hobbies: string[];
  relationship: boolean;
  country: string;
  work: { company: string; role: string; };
  friend_ids: string[];
  friend_pics: string[];
  friend_names: string[];
  friend_mutuals: number[];
  friend_count: number;
  photos: string[];
}

const ProfilePosts = () => {
  const [{
    bio,
    education,
    address,
    hobbies,
    relationship,
    country,
    work,
    friend_ids,
    friend_pics,
    friend_mutuals,
    friend_names,
    friend_count,
    photos
  }, setUser] = useState<UserType>({} as UserType)

  const { user: { id: user_id } } = useContext(AuthContext)
  const { mutual_friends, is_user } = useContext(ProfileContext);

  const { id } = useParams()

  const [posts, setPosts] = useState([]);

  const getUserInfo = async () => { 
    const response = await fetch(`${APIURL}/user/full/${id}?other_user=${user_id}`, fetchOptions)
    if (response.status !== 200) return alert('something went wrong');
    const res = await response.json();
    setUser(res)
  }

  const getUserPosts = async () => {
    const response = await fetch(`${APIURL}/user/posts/${id}?other_user=${user_id}`, fetchOptions)
    if (response.status !== 200) return alert('something went wrong');
    const res = await response.json();
    setPosts(res);
  }

  useEffect(() => {
    getUserInfo();
    getUserPosts();
  }, [])

  return (
    <div className="profile-content">
      <div className="left">
        <div className="menu">
          <h3 className="title">Intro</h3>
          <p className="intro-text text-left">{bio}</p>
          <ul className="profile-details">
            <li>
              <WorkRounded />
              <span>{`${work?.role} at ${work?.company}`}</span>
            </li>
            <li className="flex flex-col gap-1">
              {
                education?.map(({ school, degree, start, end }, i) => (
                  <p key={i}><span className='flex items-center justify-center mr-1 float-left'><SchoolRounded /></span> Studied <span className="bold">{degree}</span> at <span className="bold">{school}</span>, from <span className="bold">{start}</span> to <span className="bold">{end}</span>.</p>
                ))
              }
            </li>
            <li>
              <HouseRounded />
              <span>Lives in <span className="bold">{ address }</span></span>
            </li>
            <li>
              <PlaceRounded />
              <span>From <span className="bold">{ country }</span></span>
            </li>
            <li>
              <Favorite />
              <span>{ relationship ? 'In a relationship' : 'Single' }</span>
            </li>
            <p className='font-bold text-lg'>Hobbies</p>
            <ul className="hobbies flex flex-wrap">
              {
                hobbies?.map((hobbie, i) => <li key={i}>{hobbie}</li>)
              }
            </ul>
          </ul>
        </div>

        <div className="menu">
          <div className="menu-top">
            <h3 className="title">Photos</h3>
            <Link to={`/profile/photos/${id}`} className="">Show all photos</Link>
          </div>
          <ul className="photos">
            {
              photos?.map((photo, i) => <li key={i} className="photo"><img src={photo} /></li>)
            }
          </ul>
        </div>

        <div className="menu">
          <div className="menu-top">
            <h3 className="title">Friends</h3>
            <Link to={`/profile/friends/${id}`} className="">Show all friends</Link>
          </div>
          <p className="friend-count">{friend_count} ({mutual_friends} Mutual)</p>
          <ul className="friends">
            {
              friend_ids?.map((id, i) => (
                <li key={id} className="friend">
                  <img src={friend_pics[i]} alt="" />
                  <p className="text-xs">{friend_mutuals[i]} Mutual Friends</p>
                  <p className="text-sm">{friend_names[i]}</p>
                </li>
              ))
            }
          </ul>
        </div>
      </div>

      <div className="right">
        <div className="menu">
          <div className="menu-top">
            <h3 className="title">Posts</h3>
            <button className="filter">
              <FilterList />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <Posts posts={posts} />
      </div>
    </div>
  )
}

export default ProfilePosts
