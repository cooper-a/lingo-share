import { Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../contexts/AuthContext";
import Navbar from "./navbar";
import React from "react";
import { useTranslation } from "react-i18next";

export default function Account() {
  const { user, logout } = UserAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = async () => {
    try {
      await logout();
      navigate("/");
      console.log("logged out");
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <div>
      <Navbar />
      <h1>{t("Account")}</h1>
      <h2>
        {t("User Email")}: {user && user.email}
      </h2>
      <Button onClick={handleClick} colorScheme="blue">
        {t("Logout")}
      </Button>
    </div>
  );
}
