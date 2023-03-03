import "../styles/nav.css";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { Button, ChakraProvider, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import React, { useEffect, useState } from "react";
import { rtdb } from "../firebase";
import { ref, onValue } from "firebase/database";
import { useTranslation } from "react-i18next";

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
        <ChakraProvider>
          <div className="welcome-pg">
            <Text fontSize="5xl">{t("Welcome to LingoShare!")}</Text>
            <Button
              className="btn"
              height={"50px"}
              marginTop={"50px"}
              onClick={() => handleClick("signup")}
              rightIcon={<ArrowForwardIcon />}
              variant="outline"
            >
              {t("Sign Up")}
            </Button>
            <Button
              className="btn"
              height={"50px"}
              onClick={() => handleClick("login")}
              rightIcon={<ArrowForwardIcon />}
              variant="outline"
            >
              {t("Login")}
            </Button>
          </div>
        </ChakraProvider>
      ) : (
        <></>
      )}
    </div>
  );
}
