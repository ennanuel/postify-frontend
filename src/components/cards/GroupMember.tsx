import { useMemo } from 'react';
import { APIURL } from '../../assets/data';
import { MemberProps } from '../../types/group.types';
import { Link } from 'react-router-dom';

const GroupMember = ({ id, profile_pic, name, is_owner, is_group_owner, is_invited, is_user, removeInvite, removeMember }: MemberProps) => {
    const canRemove = useMemo(() => is_group_owner && !is_owner, []);

    return (
        <div>
            <img src={`${APIURL}/image/profile_pics/${profile_pic}`} alt="" />
            <div className="bottom-info">
                <p className="member-info">
                <span className="role">{ is_owner ? 'Admin' : 'Member' }</span>
                <span>{ is_user ? 'You' : name }</span>
                </p>
                <Link to={`/profile/${id}`}>View Profile</Link>
                {
                    is_invited ?
                        <button onClick={removeInvite}>Remove Invite</button> :
                        canRemove &&
                        <button onClick={() => (canRemove && removeMember) && removeMember()}>Remove</button>
                }
            </div>
        </div>
    )
}

export default GroupMember
