import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../contexts/AuthContext";
import React, { useEffect, useState } from "react";
import { rtdb } from "../../firebase";
import { ref, onValue } from "firebase/database";
import { useTranslation } from "react-i18next";
import Navbar from "../navbar";
import LandingWelcome from "./landingwelcome";
import DescriptionPage from "./descriptionpage";
import ActionPage from "./actionpage";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = UserAuth();
  const [curDisplay, setCurDisplay] = useState("");

  console.log(curDisplay);

  const { t } = useTranslation();

  const handleNavigation = (path) => {
    navigate("/" + path);
  };

  const handleStepChange = (step) => {
    setCurDisplay(step);
  };

  const pages = {
    showWelcome: (
      <div>
        <Navbar currPage={"/"} />
        <LandingWelcome t={t} handleStepChange={handleStepChange} />
      </div>
    ),
    showDescription: (
      <div>
        <Navbar currPage={"/"} />
        <DescriptionPage t={t} handleStepChange={handleStepChange} />
      </div>
    ),
    showAction: (
      <div>
        <Navbar currPage={"/"} />
        <ActionPage t={t} handleNavigation={handleNavigation} />
      </div>
    ),
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
      setCurDisplay("showWelcome");
    }
  }, [user, navigate]);

  return <div>{pages[curDisplay]}</div>;
}
