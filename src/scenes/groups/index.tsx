import { Route, Routes } from 'react-router-dom';
import { Groups as GroupsLayout } from '../../pages';
import GroupsPost from './GroupsPost';
import GroupsList from './GroupsList';
import CreateGroup from './CreateGroup';
import EditGroup from './EditGroup';
import GroupsDiscover from './GroupsDiscover';
import GroupInvites from './GroupInvites';
import SearchGroup from './SearchGroup';

const GroupsScenes = () => {
    return (
        <Routes>
            <Route element={<GroupsLayout />}>
                <Route path="posts" element={<GroupsPost />} />
                <Route path="list" element={<GroupsList />} />
                <Route path="create" element={<CreateGroup />} />
                <Route path="edit_group/:id" element={<EditGroup />} />
                <Route path="discover" element={<GroupsDiscover />} />
                <Route path="invites" element={<GroupInvites />} />
                <Route path="search/:query" element={<SearchGroup />} />
            </Route>
        </Routes>
    )
}

export default GroupsScenes
