import React, { useState, useEffect } from "react";
import { UserAuth } from "../contexts/AuthContext";
import { ref, onValue, push, get } from "firebase/database";
import { rtdb } from "../firebase";
import { Button } from "@chakra-ui/react";
import VideoChat from "./video/videochat";

export default function CallNotification() {
    const [callerID, setCallerID] = useState("");
    const [isCallee, setisCallee] = useState(false);
    const [redirectToVideo, setRedirectToVideo] = useState(false);
    const { user } = UserAuth();
    const callRef = ref(rtdb, "/calls");

    const handleClick = (event) => {
        event.currentTarget.disabled = true;
        setRedirectToVideo(true);
    };

    useEffect(() => {
        onValue(callRef, (snapshot) => {
            if (snapshot.exists()) {
                snapshot.forEach((childSnapshot) => {
                    if(childSnapshot.val().callee === user.uid){
                        setisCallee(true);
                        setCallerID(childSnapshot.val().caller);
                    }
                });
            }
        });
    }, []);
    
    let render;
    if (isCallee && !redirectToVideo) {
        render = (
            <div>
                <h1>{callerID} is calling you!</h1>
                <Button
                onClick={(event) => handleClick(event)}
                direction="row"
                align="center"
                variant="outline"
                >
                    Accept
                </Button>
            </div>
        );
    }
    else if (isCallee && redirectToVideo) {
        render = (
            <div>
                <VideoChat callerID={callerID} />
            </div>
        );
    }
    return render;
}