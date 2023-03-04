import React, { useEffect, useState } from "react";
import { UserAuth } from "../../contexts/AuthContext";
import { rtdb } from "../../firebase";
import { ref, get, set } from "firebase/database";
import Sidebar from "./sidebar";
import "../../styles/room.css";

export default function Prompt({ roomName, callID }) {
  const prompt_ref = ref(rtdb, "/prompts/");
  const [prompts, setPrompts] = useState({});

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

  useEffect(() => {
    getPrompts();
  }, []);

  return (
    <div className="sidebar">
      <Sidebar prompts={prompts} />
    </div>
  );
}
