import { ChatRounded, EditRounded, KeyboardArrowLeft, PersonRounded } from '@mui/icons-material';
import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { APIURL } from '../../assets/data';
import { custom_group_bgs } from '../../assets/data/data';
import { fetchCustomGroupInfo, fetchFriends } from '../../utils/friend';
import { CustomFriendGroupInt, FriendType } from '../../types/friend.types';

const CustomListSingle = () => {
  const { id } = useParams();

  const [{ group_name, color }, setGroupInfo] = useState<CustomFriendGroupInt>({ group_name: '', color: 'purple' })
  const [friends, setFriends] = useState<FriendType[]>([]);
  const { from, via, to } = useMemo(() => custom_group_bgs[color] || {}, [color]);

  useEffect(() => {
    fetchCustomGroupInfo(id || '')
      .then(res => setGroupInfo(res as CustomFriendGroupInt))
      .catch(error => alert(error));
    fetchFriends(id || '', 'custom')
      .then(res => setFriends(res as FriendType[]))
      .catch(error => alert(error));
  }, [id])

  return (
    <section className="">
      <article className="flex items-center justify-between gap-4 mt-4 md:px-4">
        <div className="flex items-center gap-2 md:gap-4">
          <Link to="/friends/custom" className="flex lg:hidden items-center justify-center">
            <KeyboardArrowLeft />
          </Link>
          <div className="flex flex-col gap-1">
            <h2 className="font-bold text-3xl">{ group_name }</h2>
            <hr className={`block h-2 rounded-md bg-gradient-to-r ${from} ${via} ${to} border-none outline-none`} />
          </div>
        </div>
        <Link to={`/friends/custom/edit/${id}`} className="h-[40px] w-[40px] rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center">
          <EditRounded />
        </Link>
      </article>

      <article className="grid grid-cols-1 md:grid-cols-2 mt-6">
        {
          friends.map( ({id, name, profile_pic, active}) => (
            <div key={id} className="flex items-center gap-2 p-2 border border-transparent bg-white/5 rounded-[35px] transition-[background-color] hover:bg-transparent hover:border-white/5 shadow shadow-black-900">
              <img className="w-[40px] md:w-[50px] aspect-square rounded-full shadow shadow-black-900/50" src={`${APIURL}/image/profile_pics/${profile_pic}`} alt="" />
              <div className="flex flex-1 flex-col">
                <p className="">{name}</p>
                <p className="text-xs font-semibold text-blue-300 flex items-center gap-1">
                  <span className="w-0 h-0 border-2 border-blue-300 aspect-square rounded-full bg-gray-400"></span>
                  <span>Active</span>
                </p>
              </div>
              <Link
                to={`/profile/${id}`}
                className="w-[40px] flex items-center justify-center md:w-[50px] transition-[background-color] bg-green-500 hover:bg-green-700/20 hover:text-green-400 aspect-square rounded-full shadow shadow-black-900/50">
                <PersonRounded />
              </Link>
              <button className="w-[40px] md:w-[50px] transition-[background-color] bg-blue-500 hover:bg-blue-700/20 hover:text-blue-300 aspect-square rounded-full shadow shadow-black-900/50">
                <ChatRounded />
              </button>
            </div>
          ))
        }
      </article>
    </section>
  )
}

export default CustomListSingle
