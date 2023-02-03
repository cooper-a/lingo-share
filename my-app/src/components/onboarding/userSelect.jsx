import { Button, ChakraProvider, Text } from "@chakra-ui/react";
import { rtdb } from "../../firebase";
import { set, ref } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../contexts/AuthContext";
import Navbar from "../navbar";
import React, { useState } from "react";

export default function UserSelect() {
  const { user } = UserAuth();
  const [data, setData] = useState({ isOnboarded: false });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  return (
    <div>
      <Navbar />
      <ChakraProvider>
        <div className="field-pg">
          <Text fontSize="4xl">You are...</Text>
          <Button
            variant="outline"
            className="selection-btn"
            height={"50px"}
            onClick={() => handleSelection("native")}
            marginTop={"50px"}
          >
            A native Mandarin speaker
          </Button>
          <Button
            className="selection-btn"
            variant="outline"
            height={"50px"}
            onClick={() => handleSelection("learner")}
          >
            Learning to speak Mandarin
          </Button>
        </div>
      </ChakraProvider>
    </div>
  );
}
