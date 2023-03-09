import React, { useEffect } from "react";
import {
  Card,
  CardBody,
  ChakraProvider,
  Heading,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import "../../styles/card.css";
import { rtdb } from "../../firebase";
import { ref, get } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../contexts/AuthContext";
import Navbar from "../navbar";
import { useTranslation } from "react-i18next";
import CallNotification from "../callNotification";
import Icon from "@adeira/icons";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, checkStatus } = UserAuth();
  const languageRef = ref(rtdb, `users/${user.uid}/language`);
  const { t, i18n } = useTranslation();

  const handleClick = (path) => {
    navigate("/" + path);
  };

  useEffect(() => {
    checkStatus(user);
    get(languageRef).then((snapshot) => {
      if (snapshot.exists()) {
        i18n.changeLanguage(snapshot.val());
      } else {
        console.log("No data available");
      }
    });
  }, []);

  const CardItem = ({ text, iconName, onClick }) => {
    return (
      <Card className="card" size={"lg"} bgColor={"gray.200"} onClick={onClick}>
        <CardBody>
          <Icon name={iconName} width={"90px"} height={"90px"} />
          <Stack mt="6" spacing="3">
            <Heading size="sm">{text}</Heading>
          </Stack>
        </CardBody>
      </Card>
    );
  };

  return (
    <div>
      <CallNotification />
      <Navbar currPage={"/dashboard"} />
      <ChakraProvider>
        <div className="dash">
          <SimpleGrid columns={2} spacing={10}>
            <CardItem
              text={t("Call a Friend")}
              iconName={"video"}
              onClick={() => handleClick("callfriend")}
            />
            <CardItem
              text={t("Meet New Friends")}
              iconName={"users"}
              onClick={() => handleClick("meetnewfriends")}
            />
            <CardItem text={t("Your Profile")} iconName={"user_male"} />
            <CardItem
              text={t("How to Use this App")}
              iconName={"info_circle"}
            />
          </SimpleGrid>
        </div>
      </ChakraProvider>
    </div>
  );
}
