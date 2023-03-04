import { Button, ChakraProvider, Text } from "@chakra-ui/react";
import { rtdb } from "../../firebase";
import { set, ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../contexts/AuthContext";
import Navbar from "../navbar";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function LanguageProficiency() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");
  const [snapshotData, setSnapshotData] = useState({});
  const { user } = UserAuth();
  const user_documents = ref(rtdb, "users/" + user.uid);
  const { t } = useTranslation();

  const navigateOnboarding = () => {
    navigate("/welcomepage");
  };

  const handleSelection = (proficiency) => {
    let newData = { ...snapshotData };
    newData["proficiency"] = proficiency;
    console.log(newData);
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
      <Navbar />
      <ChakraProvider>
        <div className="field-pg">
          <Text fontSize="4xl">
            {t("How well can you speak")}{" "}
            {userType === "native" ? t("English") : t("Mandarin")}?
          </Text>
          <Button
            variant="outline"
            marginTop={"50px"}
            onClick={() => handleSelection("well")}
            className="selection-btn"
          >
            {t("Well")}
          </Button>
          <Button
            className="selection-btn"
            variant="outline"
            onClick={() => handleSelection("okay")}
          >
            {t("Okay")}
          </Button>
          <Button
            className="selection-btn"
            variant="outline"
            onClick={() => handleSelection("poor")}
          >
            {t("Poorly")}
          </Button>
        </div>
      </ChakraProvider>
    </div>
  );
}
