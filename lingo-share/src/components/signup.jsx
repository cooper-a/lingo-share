import React from "react";
import { Button, ChakraProvider, Text } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import PasswordInput from "./passwordinput";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import "../styles/homepage.css";
import Navbar from "./navbar";
import CustomInput from "./lingoshare-components/input";
import PrimaryButton from "./lingoshare-components/primarybutton";
import { updateProfile, getAuth } from "firebase/auth";
import { useTranslation } from "react-i18next";

export default function Signup() {
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState(null);
  const [firstNameError, setFirstNameError] = useState(null);
  const [lastNameError, setLastNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [pwrdError, setPwrdError] = useState(null);
  const auth = getAuth();
  const { createUser } = UserAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clearErrors = () => {
      setFirstNameError(null);
      setLastNameError(null);
      setEmailError(null);
      setPwrdError(null);
    };

    try {
      clearErrors();
      if (firstName === "") {
        setFirstNameError(t("First name missing"));
        return;
      }
      setFirstNameError(null);
      if (lastName === "") {
        setLastNameError(t("Last name missing"));
        return;
      }
      setLastNameError(null);
      await createUser(email, password);
      await updateProfile(auth.currentUser, {
        displayName: firstName + " " + lastName,
      });
      console.log("successfully added user");
      navigate("/userselect");
    } catch (e) {
      if (!e.message.includes("auth/")) {
        console.log(e.message);
        return;
      }
      let errorType = e.message.split("(")[1].split(")")[0];
      console.log(errorType);
      let errorMsg = e.message.split(":")[1].split("(")[0];
      if (errorType === "auth/weak-password") setPwrdError(errorMsg);
      else if (errorType === "auth/email-already-in-use")
        setEmailError(t("Email is already in use"));
      else if (errorType === "auth/invalid-email")
        setEmailError(t("Please enter a valid email"));
      console.log(e.message);
    }
  };

  const handleChange = (event) => {
    setPassword(event.target.value);
  };

  return (
    <div>
      <Navbar currPage={"/signup"} />
      <ChakraProvider>
        <div className="field-pg">
          <Text fontSize="5xl">{t("Sign Up")}</Text>
          <div className="first-last-name" style={{ marginTop: "50px" }}>
            <div className="grid-child">
              <CustomInput
                isInvalid={firstNameError !== null}
                error={firstNameError}
                width={"175px"}
                height={"50px"}
                placeholder={t("First Name")}
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="grid-child">
              <CustomInput
                isInvalid={lastNameError !== null}
                error={lastNameError}
                width={"175px"}
                height={"50px"}
                placeholder={t("Last Name")}
                type="text"
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <CustomInput
            isInvalid={emailError !== null}
            error={emailError}
            onChange={(e) => setEmail(e.target.value)}
            width={"350px"}
            placeholder={t("Email")}
            height={"50px"}
          />
          <PasswordInput
            isInvalid={pwrdError !== null}
            error={pwrdError}
            onChange={handleChange}
            placeholder={t("pasword...")}
            width={"350px"}
          />
          <PrimaryButton
            marginTop={"15px"}
            width={"200px"}
            onClick={handleSubmit}
            rightIcon={<ArrowForwardIcon />}
            className="btn"
            text={t("Sign Up")}
          />
        </div>
      </ChakraProvider>
    </div>
  );
}
