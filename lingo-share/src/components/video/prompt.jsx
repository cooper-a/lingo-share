import React, { useEffect, useState } from "react";
import { UserAuth } from "../../contexts/AuthContext";
import { rtdb } from "../../firebase";
import { ref, get, set, onValue } from "firebase/database";
import Sidebar from "./sidebar";
import "../../styles/room.css";

export default function Prompt({ roomName, callID }) {
  const prompts_ref = ref(rtdb, "/prompts/");
  const [activePrompt, setActivePrompt] = useState(null);
  const [prompts, setPrompts] = useState({});
  const test_prompt = "test prompt tell me what you think abc?";
  const activePromptsRef = ref(rtdb, `/calls/${roomName}/${callID}/}`);

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

  const handlePromptSelect = () => {
    console.log("Prompt Selected");
    console.log(roomName);
    console.log(callID);
    ref = ref(rtdb, `/calls/${roomName}/${callID}/}`);
    set(ref, { active_prompt: test_prompt });
  };

  useEffect(() => {
    getPrompts();
    console.log(activePromptsRef);
    ref = ref(rtdb, `/calls/${roomName}/${callID}/}`);
    onValue(ref, (snapshot) => {
      const data = snapshot.val();
      setActivePrompt(data);
      console.log("change detected");
    });
  }, [activePromptsRef, getPrompts]);

  return (
    <div className="sidebar">
      <h1>Active Prompt</h1>
      <p>{activePrompt}</p>
      <Sidebar prompts={prompts} handlePromptSelect={handlePromptSelect} />
    </div>
  );
}
