import { Button } from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import Navbar from "./navbar";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ref, onValue, get } from "firebase/database";
import { rtdb } from "../firebase";

export default function PublicProfile() {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const params = useParams();
  const targetUserRef = ref(rtdb, "users/" + params.id);
  const [targetUserData, setTargetUserData] = useState(null);

  useEffect(() => {
    onValue(targetUserRef, (snapshot) => {
      const snapshotVal = snapshot.val();
      setTargetUserData(snapshotVal.userDisplayName);
      console.log(snapshotVal);
    });
  }, []);

  return (
    <div>
      <h2>{params.id}</h2>
      <h2>{targetUserData}</h2>
    </div>
  );
}
