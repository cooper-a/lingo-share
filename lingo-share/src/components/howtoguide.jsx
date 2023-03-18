import React from "react";
import {
    ChakraProvider,
    Text,
} from "@chakra-ui/react";
import { useTranslation } from "react-i18next";

import CallNotification from "./callnotification";
import Navbar from "./navbar";
import "../styles/howtoguide.css";

export default function HowToGuide() {
    const { t } = useTranslation();

    return (
        <div>
            <CallNotification />
            <Navbar
                topLeftDisplay={"How to Use this App"}
                currpage={"/howtouse"}
            />
            <ChakraProvider>
                <div className="how-to-pg">
                    <Text
                        className="font"
                        fontsize="3x1">
                            {t("How to use LingoShare")}
                    </Text>
                </div>
            </ChakraProvider>
        </div>
    );
}
