import React, { useEffect, useState } from "react";
import { UserAuth } from "../../contexts/AuthContext";
import { rtdb } from "../../firebase";
import { ref, get, set, onValue } from "firebase/database";
import Sidebar from "./sidebar";
import "../../styles/room.css";

export default function PromptSidebar({ roomName, callID }) {
  const prompts_ref = ref(rtdb, "/prompts/");
  const [prompts, setPrompts] = useState({});
  const callIDRef = ref(rtdb, `/calls/${roomName}/${callID}`);
  const activePromptRef = ref(
    rtdb,
    `/calls/${roomName}/${callID}/active_prompt`
  );

  const getPrompts = () => {
    get(prompts_ref)
      .then((snapshot) => {
        if (snapshot.exists()) {
          // console.log(snapshot.val());
          const data = snapshot.val();
          // const prompts = JSON.stringify(data);
          // console.log(prompts);
          setPrompts(data);
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlePromptSelect = (promptName) => {
    console.log("Prompt Selected");
    set(activePromptRef, promptName);
  };

  useEffect(() => {
    getPrompts();
    // const interval = setInterval(() => {
    //   get(activePromptRef).then((snapshot) => {
    //     console.log("grabbing active prompt");
    //     if (snapshot.exists()) {
    //       console.log(snapshot.val());
    //     }
    //   });
    // }, 1000);
    // return () => clearInterval(interval);
  }, [getPrompts]);

  return (
    <div className="sidebar">
      <Sidebar prompts={prompts} handlePromptSelect={handlePromptSelect} />
    </div>
  );
}
