import { Route, Routes } from 'react-router-dom';
import { Channels as ChannelsLayout } from '../../pages';
import ChannelDetails from "./ChannelDetails";
import ChannelExplore from "./ChannelExplore";
import ChannelFeed from "./ChannelFeed";
import ChannelsAll from "./ChannelsAll";
import CreateChannel from "./CreateChannel";
import EditChannel from "./EditChannel";
import SearchChannel from './SearchChannel';

const ChannelScenes = () => {
    return (
        <Routes>
            <Route element={<ChannelsLayout />}>
                <Route path="feed" element={<ChannelFeed />} />
                <Route path="explore" element={<ChannelExplore />} />
                <Route path="list/:filter?" element={<ChannelsAll />} />
                <Route path="info/:id" element={<ChannelDetails />} />
                <Route path="create" element={<CreateChannel />} />
                <Route path="edit/:id" element={<EditChannel />} />
                <Route path="search/:query" element={<SearchChannel />} />
            </Route>
        </Routes>
    )
}

export default ChannelScenes
