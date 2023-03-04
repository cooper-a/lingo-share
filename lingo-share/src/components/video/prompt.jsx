import React, { useEffect, useState } from "react";
import { UserAuth } from "../../contexts/AuthContext";
import { rtdb } from "../../firebase";
import { ref, get, set } from "firebase/database";
import { Button } from "@chakra-ui/react";

export default function Prompt({ roomName, callID }) {
  const prompt_ref = ref(rtdb, "/prompts/");
  const live_prompt_ref = ref(rtdb, "/live_prompts/");
  const [prompts, setPrompts] = useState("");
  const test_prompt = "test prompt tell me what you think?";

  const getPrompts = () => {
    get(prompt_ref)
      .then((snapshot) => {
        if (snapshot.exists()) {
          //   console.log(snapshot);
          //   console.log("HERE");
          console.log(snapshot.val());
          const data = snapshot.val();
          const prompts = JSON.stringify(data);
          console.log(prompts);
          setPrompts(prompts);
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
    <div>
      <p>{prompts}</p>
      <Button onClick={handlePromptSelect}>Select Prompt Test</Button>
    </div>
  );
}
