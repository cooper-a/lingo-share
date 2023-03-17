import React, { useEffect, useState } from "react";
import { rtdb } from "../../firebase";
import { ref, get, set, push } from "firebase/database";
import Sidebar from "./sidebar";
import "../../styles/room.css";

export default function PromptSidebar({
  roomName,
  callID,
  setActivePrompt,
  preferredLanguage,
}) {
  const prompts_ref = ref(rtdb, "/prompts/");
  const [prompts, setPrompts] = useState({});
  const activePromptRef = ref(
    rtdb,
    `/calls/${roomName}/${callID}/active_prompt`
  );
  const promptHistoryRef = ref(
    rtdb,
    `/calls/${roomName}/${callID}/prompt_history`
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

  const handlePromptSelect = (promptObj) => {
    console.log("Prompt Selected");
    set(activePromptRef, promptObj);
    console.log("promptName: " + promptObj);
    setActivePrompt(promptObj);
    console.log("Pushing prompt to history");
    push(promptHistoryRef, promptObj);
  };

  useEffect(() => {
    getPrompts();
  });

  return (
    <div className="sidebar">
      <Sidebar prompts={prompts} handlePromptSelect={handlePromptSelect} />
    </div>
  );
}
