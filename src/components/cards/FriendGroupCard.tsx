import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { custom_group_bgs } from '../../assets/data/data';
import { CustomFriendGroupType } from '../../types/friend.types';
import { APIURL } from '../../assets/data';

const FriendGroupCard = ({ id, group_name, friends_count, friend_names, friend_pics, color }: CustomFriendGroupType) => {
  const { from, via, to } = useMemo(() => custom_group_bgs[color] || {}, [color]);

  return (
    <Link
      to={`/friends/custom/${id}`}
      key={id}
      className={`group bg-gradient-to-br rounded-lg ${from} ${via} ${to} block shadow-lg shadow-black-900/50 overflow-hidden`}
    >
      <div className="scale-x-[.99] scale-y-[.97] md:scale-100 group-hover:scale-x-[.99] group-hover:scale-y-[.97] transition-transform relative flex flex-col p-2 bg-[rgba(15,15,15,1)] rounded-md h-full">
        <div className="flex-1 flex flex-row-reverse items-center justify-end origin-top-left group-hover:lg:scale-[1.3] transition-transform">
          {
            friend_pics?.map((pic, i) => (
              <div className={`w-[50px] p-[1px] bg-gradient-to-tr rounded-lg shadow shadow-black-900/50 ${from} ${via} ${to}`}>
                <img
                  key={i}
                  className={`w-full aspect-square rounded-lg ${i !== 0 && 'ml-[-10px]'}`} src={`${APIURL}/image/profile_pics/${pic}`}
                />
              </div>
            ))
          }
        </div>
        <div className="overflow-hidden">
          <div className="group-hover:translate-y-[10px] transition-transform flex flex-col w-fit overflow-hidden">
            <p className="font-bold text-xl mt-2">{group_name}</p>
            <div className={`bg-gradient-to-r ${from} ${via} ${to} h-1 rounded-md`}></div>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {friend_names?.join(', ')}
          {friends_count > 5 ? `and ${friends_count - 5} Others` : ''}
        </p>
      </div>
    </Link>
  )
}

export default FriendGroupCard
