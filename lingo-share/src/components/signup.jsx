import React from "react";
import { Button, ChakraProvider, Text } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import PasswordInput from "./passwordinput";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import "../styles/homepage.css";
import Navbar from "./navbar";
import Input from "./lingoshare-components/input";

export default function Signup() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [pwrdError, setPwrdError] = useState(null);
  const { createUser } = UserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createUser(email, password);
      console.log("successfully added user");
      navigate("/userselect");
    } catch (e) {
      let errorType = e.message.split("(")[1].split(")")[0];
      console.log(errorType);
      let errorMsg = e.message.split(":")[1].split("(")[0];
      if (errorType === "auth/weak-password") {
        setEmailError(null);
        setPwrdError(errorMsg);
      } else if (errorType === "auth/email-already-in-use") {
        setPwrdError(null);
        setEmailError("Email is already in use");
      } else if (errorType === "auth/invalid-email") {
        setPwrdError(null);
        setEmailError("Please enter a valid email");
      }
      console.log(e.message);
    }
  };

  const handleChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <div>
      <Navbar />
      <ChakraProvider>
        <div className="field-pg">
          <Text fontSize="5xl">Sign Up</Text>
          <Input
            isInvalid={emailError !== null}
            error={emailError}
            onChange={(e) => setEmail(e.target.value)}
            width={"300px"}
            placeholder="Email..."
            height={"50px"}
            marginTop={"50px"}
          />
          <PasswordInput
            isInvalid={pwrdError !== null}
            error={pwrdError}
            onChange={handleChange}
            placeholder="password..."
          />
          <Button
            variant="outline"
            onClick={handleSubmit}
            rightIcon={<ArrowForwardIcon />}
            marginTop={"15px"}
            className="btn"
          >
            Sign Up
          </Button>
        </div>
      </ChakraProvider>
    </div>
  );
}
