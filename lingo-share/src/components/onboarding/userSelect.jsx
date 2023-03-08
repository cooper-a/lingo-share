import { Button, ChakraProvider, Text } from "@chakra-ui/react";
import { rtdb } from "../../firebase";
import { set, ref } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../contexts/AuthContext";
import Navbar from "../navbar";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function UserSelect() {
  const { user } = UserAuth();
  const [data, setData] = useState({
    isOnboarded: false,
    userDisplayName: user.displayName,
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const navigateOnboarding = () => {
    navigate("/languageproficiency");
  };

  const handleSelection = (type) => {
    let userType = "";
    let newData = { ...data };
    if (type === "native") {
      userType = "native";
    } else {
      userType = "learner";
    }
    newData["userType"] = userType;
    console.log(newData);
    const userTypeRef = ref(rtdb, "users/" + user.uid);
    set(userTypeRef, newData);
    navigateOnboarding();
  };

  useEffect(() => {
    // create the default fields for the user
    let newData = {};
    newData["userType"] = null;
    newData["proficiency"] = null;
    newData["isOnboarded"] = false;
    const userRef = ref(rtdb, "users/" + user.uid);
    set(userRef, newData);
  }, []);

  return (
    <div>
      <Navbar currPage={"/userselect"} />
      <ChakraProvider>
        <div className="field-pg">
          <Text fontSize="4xl">{t("You are...")}</Text>
          <Button
            variant="outline"
            className="selection-btn"
            height={"50px"}
            onClick={() => handleSelection("native")}
            marginTop={"50px"}
          >
            {t("A native Mandarin speaker")}
          </Button>
          <Button
            className="selection-btn"
            variant="outline"
            height={"50px"}
            onClick={() => handleSelection("learner")}
          >
            {t("Learning to speak Mandarin")}
          </Button>
        </div>
      </ChakraProvider>
    </div>
  );
}
