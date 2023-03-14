import "./App.css";
import Home from "./components/home";
import Login from "./components/login";
import Account from "./components/account";
import CallFriend from "./components/callfriend";
import VideoChat from "./components/video/videochat";
import ProtectedRoute from "./components/protectedRoute";
import Signup from "./components/signup";
import UserSelect from "./components/onboarding/userSelect";
import WelcomePage from "./components/onboarding/welcomePage";
import NotFound from "./components/notfound";
import PromptSidebar from "./components/video/promptSidebar";
import React from "react";
import { AuthContextProvider } from "./contexts/AuthContext";
import { BrowserRouter as Router } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./components/dashboard/dashboard";
import LanguageProficiency from "./components/onboarding/languageProficiency";
import MeetNewFriends from "./components/meetnewfriends";
import ProfilePage from "./components/profilepage";
import YourFriends from "./components/yourfriends";
import BlockedPeople from "./components/blockedpeople";

function App() {
  return (
    <ChakraProvider>
      <AuthContextProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/prompt" element={<PromptSidebar />} />
              <Route
                path="/userselect"
                element={
                  <ProtectedRoute>
                    <UserSelect />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/languageproficiency"
                element={
                  <ProtectedRoute>
                    <LanguageProficiency />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/welcomepage"
                element={
                  <ProtectedRoute>
                    <WelcomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/callfriend"
                element={
                  <ProtectedRoute>
                    <CallFriend />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/callroom"
                element={
                  <ProtectedRoute>
                    <VideoChat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/meetnewfriends"
                element={
                  <ProtectedRoute>
                    <MeetNewFriends />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile/:id"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/yourfriends"
                element={
                  <ProtectedRoute>
                    <YourFriends />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/blockedpeople"
                element={
                  <ProtectedRoute>
                    <BlockedPeople />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </Router>
      </AuthContextProvider>
    </ChakraProvider>
  );
}

export default App;
