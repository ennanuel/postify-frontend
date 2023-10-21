import { Route, Routes } from 'react-router-dom';
import { Friends as FriendsLayout } from '../../pages';
import CustomList from "./CustomList";
import CustomListSingle from "./CustomListSingle";
import FriendRequests from "./FriendRequests";
import Friends from "./Friends";
import FriendsList from "./FriendsList";
import FriendSuggestions from "./FriendSuggestions";
import SentRequests from "./SentRequests";
import CreateCustomList from "./CreateCustomList";
import EditCustomList from "./EditCustomList";
import SearchFriends from './SearchFriends';

const FriendScenes = () => {
    return (
        <Routes>
            <Route element={<FriendsLayout />}>
                <Route path="all" element={<FriendsList />} />
                <Route path="requests" element={<FriendRequests />} />
                <Route path="sent" element={<SentRequests />} />
                <Route path="suggestions" element={<FriendSuggestions />} />
                <Route path="list" element={<Friends />} />
                <Route path="custom" element={<CustomList />} />
                <Route path="custom/:id" element={<CustomListSingle />} />
                <Route path="custom/create/" element={<CreateCustomList />} />
                <Route path="custom/edit/:id" element={<EditCustomList />} />
                <Route path="search/:query" element={<SearchFriends />} />
            </Route>
        </Routes>
    )
}

export default FriendScenes
