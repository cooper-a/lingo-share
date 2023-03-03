import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  ChakraProvider,
  Heading,
  SimpleGrid,
} from "@chakra-ui/react";
import "../../styles/card.css";
import { rtdb } from "../../firebase";
import { set, ref, onValue } from "firebase/database";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../../contexts/AuthContext";
import Navbar from "../navbar";
import { useTranslation } from "react-i18next";
import CallNotification from "../callNotification";

export default function Dashboard() {
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [userType, setUserType] = useState("");
  const [snapshotData, setSnapshotData] = useState({});
  const { user, checkStatus } = UserAuth();
  const user_documents = ref(rtdb, "users/" + user.uid);
  const { t } = useTranslation();

  const handleClick = (path) => {
    navigate("/" + path);
  };

  useEffect(() => {
    checkStatus(user);
  }, []);

  return (
    <div>
      <CallNotification />
      <Navbar />
      <ChakraProvider>
        <div className="welcome-pg">
          <SimpleGrid columns={2} spacing={10}>
            <Card
              className="card"
              width={"300px"}
              height={"100px"}
              size={"lg"}
              onClick={() => handleClick("callfriend")}
            >
              <CardBody>
                <Heading as="h4" size="md">
                  {t("Call a Friend")}
                </Heading>
              </CardBody>
            </Card>
            <Card className="card" width={"300px"} height={"100px"} size={"lg"}>
              <CardBody>
                <Heading as="h4" size="md">
                  {t("Meet New Friends")}
                </Heading>
              </CardBody>
            </Card>
            <Card className="card" width={"300px"} height={"100px"} size={"lg"}>
              <CardBody>
                <Heading as="h4" size="md">
                  {t("Your Friends")}
                </Heading>
              </CardBody>
            </Card>
            <Card className="card" width={"300px"} height={"100px"} size={"lg"}>
              <CardBody>
                <Heading as="h4" size="md">
                  {t("Your Profile")}
                </Heading>
              </CardBody>
            </Card>
            <Card className="card" width={"300px"} height={"100px"} size={"lg"}>
              <CardBody>
                <Heading as="h4" size="md">
                  {t("Settings")}
                </Heading>
              </CardBody>
            </Card>
            <Card className="card" width={"300px"} height={"100px"} size={"lg"}>
              <CardBody>
                <Heading as="h4" size="md">
                  {t("How to Use this App")}
                </Heading>
              </CardBody>
            </Card>
          </SimpleGrid>
        </div>
      </ChakraProvider>
    </div>
  );
}
