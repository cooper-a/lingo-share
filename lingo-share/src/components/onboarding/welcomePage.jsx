import { Button, ChakraProvider, Text } from "@chakra-ui/react";
import { rtdb } from "../../firebase";
import { set, ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../contexts/AuthContext";
import Navbar from "../navbar";
import React, { useEffect, useState } from "react";
import "../../styles/homepage.css";
import { useTranslation } from "react-i18next";

export default function WelcomePage() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");
  const [snapshotData, setSnapshotData] = useState({});
  const { user } = UserAuth();
  const user_documents = ref(rtdb, "users/" + user.uid);
  const { t } = useTranslation();

  const navigateOnboarding = () => {
    navigate("/dashboard");
  };

  const handleSelection = () => {
    let newData = { ...snapshotData };
    newData["isOnboarded"] = true;
    const userTypeRef = ref(rtdb, "users/" + user.uid);
    set(userTypeRef, newData);
    navigateOnboarding();
  };

  useEffect(() => {
    onValue(user_documents, (snapshot) => {
      const snapshotVal = snapshot.val();
      setSnapshotData(snapshotVal);
      console.log(snapshotVal);
      const { type } = snapshotVal;
      setUserType(type);
    });
  }, []);

  return (
    <div>
      <Navbar currPage={"/welcomepage"} />
      <ChakraProvider>
        <div className="welcome-pg">
          <Text fontSize="4xl">
            {t("All done! We hope you enjoy LingoShare")}
          </Text>
          <Button
            width={"400px"}
            height={"50px"}
            marginTop={"50px"}
            variant="outline"
            onClick={() => handleSelection()}
          >
            {t("Get Started")}
          </Button>
        </div>
      </ChakraProvider>
    </div>
  );
}
