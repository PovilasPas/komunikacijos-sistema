import { Routes, Route } from "react-router-dom"
import HomeView from "./Views/HomeView"
import RegisterView from "./Views/RegisterView"
import LoginView from "./Views/LoginView"
import ChannelView from "./Views/ChannelView"
import AuthRoute from "./Components/AuthRoute"
import GuestRoute from "./Components/GuestRoute"
import NotFoundView from "./Views/NotFoundView"

export const Content = ({showSidebar, handleSidebarToggle}) => {
    return (
        <Routes>
            <Route path="/Login" element={<GuestRoute redirect="/" />}>
                <Route path="/Login" element={<LoginView />}/>
            </Route>
            <Route path="/Register" element={<GuestRoute redirect="/"/>}>
                <Route path="/Register" element={<RegisterView />}/>
            </Route>
            <Route path="/" element={<AuthRoute redirect="/Login" />}>
                <Route path="/" element={<HomeView />}/>
            </Route>
            <Route path="/channels/:channel" element={<AuthRoute redirect="/Login"/>}>
                <Route path="/channels/:channel" element={<ChannelView showSidebar={showSidebar} handleSidebarToggle={handleSidebarToggle} />}/>
            </Route>
            <Route path="/404" element={<NotFoundView />}/>
            <Route path="*" element={<NotFoundView />} />
        </Routes>
    )
}