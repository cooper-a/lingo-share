import "../styles/nav.css";
import { Button, ChakraProvider, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import React, { useEffect, useState } from "react";
import { rtdb } from "../firebase";
import { ref, onValue } from "firebase/database";
import { useTranslation } from "react-i18next";
import PrimaryButton from "./lingoshare-components/primarybutton";
import SecondaryButton from "./lingoshare-components/secondarybutton";
import Navbar from "./navbar";

export default function Home() {
  const navigate = useNavigate();
  const { user } = UserAuth();
  const [showLogin, setShowLogin] = useState(false);
  const { t } = useTranslation();

  const handleClick = (path) => {
    navigate("/" + path);
  };

  useEffect(() => {
    if (user && Object.keys(user).length !== 0) {
      const user_documents = ref(rtdb, "users/" + user.uid);
      onValue(user_documents, (snapshot) => {
        const snapshotVal = snapshot.val();
        const { isOnboarded } = snapshotVal;
        if (!isOnboarded) {
          // navigate to the onboarding if user created but not onboarded
          // could occur when user was onboarding then exited midway
          navigate("/userselect");
          return;
        } else {
          // otherwise go to the dashboard as usual
          navigate("/dashboard");
        }
      });
    } else if (user === null) {
      // user not logged in
      setShowLogin(true);
    }
  }, [user, navigate, showLogin]);

  return (
    <div>
      {showLogin ? (
        <div>
          <Navbar currPage={"/home"} />
          <ChakraProvider>
            <div className="welcome-pg">
              <Text fontSize="5xl">{t("Welcome to LingoShare!")}</Text>
              <Text fontSize="xl">
                {t("Log in or create an account below")}
              </Text>
              <Stack
                direction={"row"}
                spacing={4}
                align={"center"}
                marginTop={"50px"}
              >
                <PrimaryButton
                  className="btn"
                  height={"50px"}
                  width={"220px"}
                  onClick={() => handleClick("login")}
                  text={t("Log In")}
                />
                <SecondaryButton
                  className="btn"
                  height={"50px"}
                  width={"220px"}
                  marginRight={"10px"}
                  onClick={() => handleClick("signup")}
                  text={t("Create an Account")}
                />
              </Stack>
            </div>
          </ChakraProvider>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
