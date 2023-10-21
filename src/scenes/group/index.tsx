import { Route, Routes } from 'react-router-dom';
import { Group as GroupLayout } from '../../pages';
import Group from "./Group";
import GroupMembers from "./GroupMembers";
import GroupInvitedMembers from "./GroupInvitedMembers";
import GroupPhotos from "./GroupPhotos";
import GroupVideos from "./GroupVideos";

const GroupScenes = () => {
    return (
        <Routes>
            <Route element={<GroupLayout />}>
                <Route path="info/:id" element={<Group />} />
                <Route path="members/:id" element={<GroupMembers />} />
                <Route path="photos/:id" element={<GroupPhotos />} />
                <Route path="videos/:id" element={<GroupVideos />} />
                <Route path="invites/:id" element={<GroupInvitedMembers />} />
            </Route>
        </Routes>
    )
}

export default GroupScenes