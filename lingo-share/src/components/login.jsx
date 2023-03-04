import { ChakraProvider, Button, Text } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import { useState } from "react";
import Navbar from "./navbar";
import PasswordInput from "./passwordinput";
import Input from "./lingoshare-components/input";
import React from "react";
import { useTranslation } from "react-i18next";

export default function Login() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [error, setError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [pwrdError, setPwrdError] = useState(null);
  const { login } = UserAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (e) {
      let errorType = e.message.split("(")[1].split(")")[0];
      console.log(errorType);
      if (errorType === "auth/user-not-found") {
        setEmailError(t("User not found"));
        setPwrdError(null);
      } else if (errorType === "auth/wrong-password") {
        setEmailError(null);
        setPwrdError(t("Incorrect password"));
      } else if (errorType === "auth/invalid-email") {
        setPwrdError(null);
        setEmailError(t("Please enter a valid email"));
      }
      setError(e.message);
      console.log(e.message);
    }
  };

  const handleChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <div>
      <ChakraProvider>
        <Navbar />
        <div className="field-pg">
          <Text fontSize="5xl">{t("Login")}</Text>
          <Input
            isInvalid={emailError !== null}
            error={emailError}
            height={"50px"}
            marginTop={"50px"}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("Email")}
            width={"300px"}
          />
          <PasswordInput
            isInvalid={pwrdError !== null}
            error={pwrdError}
            onChange={handleChange}
            placeholder={t("password...")}
            width={"300px"}
          />
          <Button
            marginTop={"15px"}
            variant="outline"
            onClick={handleSubmit}
            rightIcon={<ArrowForwardIcon />}
            className="btn"
          >
            {t("Log In")}
          </Button>
        </div>
      </ChakraProvider>
    </div>
  );
}
