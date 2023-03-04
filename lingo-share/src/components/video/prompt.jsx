import React, { useEffect, useState } from "react";
import { UserAuth } from "../../contexts/AuthContext";
import { rtdb } from "../../firebase";
import { ref, get, set } from "firebase/database";
import Sidebar from "./sidebar";
import "../../styles/room.css";

export default function Prompt({ roomName, callID }) {
  const prompt_ref = ref(rtdb, "/prompts/");
  const live_prompt_ref = ref(rtdb, "/live_prompts/");
  const [prompts, setPrompts] = useState({});
  const test_prompt = "test prompt tell me what you think?";

  const getPrompts = () => {
    get(prompt_ref)
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
    set(live_prompt_ref, test_prompt);
  };

  useEffect(() => {
    getPrompts();
  }, []);

  return (
    <div className="sidebar">
      <Sidebar prompts={prompts} handlePromptSelect={handlePromptSelect} />
    </div>
  );
}
