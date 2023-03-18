import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../contexts/AuthContext";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Navbar from "../navbar";
import LandingWelcome from "./landingwelcome";
import DescriptionPage from "./descriptionpage";
import ActionPage from "./actionpage";

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = UserAuth();
  const [curDisplay, setCurDisplay] = useState("");

  const { t } = useTranslation();

  const handleNavigation = (path) => {
    navigate("/" + path);
  };

  const handleStepChange = (step) => {
    setCurDisplay(step);
  };

  const pages = {
    showDescription: (
      <div>
        <Navbar currPage={"/landingpage"} />
        <DescriptionPage t={t} handleStepChange={handleStepChange} />
      </div>
    ),
    showAction: (
      <div>
        <Navbar currPage={"/landingpage"} />
        <ActionPage t={t} handleStepChange={handleStepChange} />
      </div>
    ),
    showWelcome: (
      <div>
        <Navbar currPage={"/landingpage"} />
        <LandingWelcome t={t} handleNavigation={handleNavigation} />
      </div>
    ),
  };

  useEffect(() => {
    setCurDisplay("showDescription");
  }, [user, navigate]);

  return <div>{pages[curDisplay]}</div>;
}
