import { useMemo } from 'react'
import { GroupCardProp } from '../../types/group.types';
import { Link, useNavigate } from 'react-router-dom';
import { APIURL } from '../../assets/data';

const GroupCard = ({ id, name, picture, members, is_member, invite, rejectInvite, joinGroup }: GroupCardProp) => {
  const navigate = useNavigate();
  const viewGroup = useMemo(() => function () { navigate(`/group/info/${id}`) }, [id]);

  return (
    <div onClick={viewGroup}>
      <div className="info flex items-end gap-2">
        <img className="h-[70px] aspect-square rounded-[8px] " src={`${APIURL}/image/profile_pics/${picture}`} alt="" />
        <div className="details flex flex-col">
          <h3 className="text-lg font-bold">{name}</h3>
          <p className="text-xs">{`${members} ${members === 1 ? 'member' : 'members'}`}</p>
        </div>
      </div>
      <div className="actions flex items-center h-[40px] gap-2 mt-2">
        {
          invite ?
            <>
              <button
                onClick={() => joinGroup && joinGroup()}
                className="flex-1 flex items-center justify-center h-full rounded-[8px] p-2"
              >Accept</button>
              <button
                onClick={() => rejectInvite && rejectInvite()}
                className="flex-1 flex items-center justify-center h-full rounded-[8px] p-2"
              >Reject</button>
            </> :
            <Link to={`/group/info/${id}`} className="flex-1 flex items-center justify-center h-full rounded-md p-2">View</Link>
        }
        {
          !is_member &&
            <button
              onClick={() => joinGroup && joinGroup()}
              className="flex-1 flex items-center justify-center h-full rounded-md p-2"
            >Join</button>
        }
      </div>
    </div>
  )
}

export default GroupCard
