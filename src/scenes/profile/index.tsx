import { Route, Routes } from "react-router-dom";
import { Profile as ProfileLayout } from "../../pages";
import ProfilePhotos from "./ProfilePhotos";
import ProfileFriends from "./ProfileFriends";
import ProfilePosts from "./ProfilePosts";
import ProfileVideos from "./ProfileVideos";

const ProfileScenes = () => {
    return (
        <Routes>
            <Route element={<ProfileLayout />}>
                <Route path=":id" element={<ProfilePosts />} />
                <Route path="photos/:id" element={<ProfilePhotos />} />
                <Route path="videos/:id" element={<ProfileVideos />} />
                <Route path="friends/:id" element={<ProfileFriends />} />
            </Route>
        </Routes>
    )
}

export default ProfileScenes
