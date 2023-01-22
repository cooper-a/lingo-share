import "./App.css";
import Home from "./components/home";
import Login from "./components/login";
import Account from "./components/account";
import Crud from "./components/crud";
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { BrowserRouter as Router } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Signup from "./components/signup";
import { AuthContextProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/protectedRoute";

function App() {
  return (
    <ChakraProvider>
      <AuthContextProvider>
        <Router>
          <div className="App">
            <h1>LingoShare</h1>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
              <Route path="/crud" element={<ProtectedRoute><Crud /></ProtectedRoute>} />
            </Routes>
          </div>
        </Router>
      </AuthContextProvider>
    </ChakraProvider>
  );
}

export default App;
