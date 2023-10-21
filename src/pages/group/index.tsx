import { useState, useEffect, createContext, useContext } from 'react';
import { Outlet, useParams } from "react-router-dom";
import DetailsHeader from './DetailHeader';
import { AuthContext } from '../../context/authContext';
import './group.scss';
import { GroupType } from '../../types/group.types';
import { getGroupInfo } from '../../utils/group';

type GroupContextType = {
    group: GroupType;
    refreshPost: boolean;
    refreshDet: boolean;
}

export const GroupContext = createContext<GroupContextType>({ group: {} as GroupType, refreshPost: false, refreshDet: false });

const Group = () => {
    const { user, socket, getIds } = useContext(AuthContext)
    const { id } = useParams()

    const [groupInfo, setGroupInfo] = useState<GroupType>({} as GroupType);
    const [refreshPost, setRefreshPost] = useState<boolean>(false)
    const [refreshDet, setRefreshDet] = useState<boolean>(false)

    useEffect(() => {
        getGroupInfo({ group_id: id, user_id: user.id })
            .then(res => setGroupInfo(res))
            .catch(error => alert(error));
    }, [refreshDet])

    useEffect(() => {
        socket.removeAllListeners('post-event');
        socket.removeAllListeners('group-event');

        socket.on('group-event', ({ group_id, user_id }) => {
            if (group_id === id) setRefreshDet(!refreshDet);
            if (user_id === user.id) getIds('group');
        })
        socket.on('post-event', ({ group_id }) => {
            if (group_id === id) setRefreshPost(!refreshPost);
        })
    }, [socket, refreshPost, refreshDet, id])

    return (
        <div className="group w-full min-h-[100vh]">
            <GroupContext.Provider value={{ group: groupInfo, refreshDet, refreshPost }}>
                <DetailsHeader />
                <div className="lg:px-[13%]">
                    <Outlet />
                </div>
            </GroupContext.Provider>
        </div>
    )
}

export default Group;