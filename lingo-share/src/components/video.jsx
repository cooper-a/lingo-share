import React from "react";
import { Button } from "@chakra-ui/react";
import { useRef } from "react";
import { UserAuth } from "../contexts/AuthContext";
import { set, ref } from "firebase/database";
import { rtdb } from "../firebase";
import { get_token } from "../firebase";
import { createContext, useContext, useEffect } from "react";


export default function Video() {
  const { user } = UserAuth();
  const { connect } = require("twilio-video");
  const [room, setRoom] = useState(null);

  const getToken = (e) => {
    e.preventDefault();
    get_token({room: "testing"})
      .then((result) => {
        // Read result of the Cloud Function.
        /** @type {any} */
        const data = result.data;
        const token = data.token;
        console.log(token);
        return token;
      })
      .catch((error) => {
        // Getting the Error details.
        const code = error.code;
        const message = error.message;
        const details = error.details;
        // ...
      });
  };

  async function joinRoom() {
    try {
        const token = getToken()
        const room = await connect(token, { name: "testing", audio: true, video: true });
        setRoom(room);
    } catch (error) {
        console.log(error);
    }
  }

  const leaveRoom = () => {
    setRoom({ room: null });
  };

  return (
    <div>
      <h1>Home</h1>
      <Button onClick={getToken}>GetTokenTest</Button>
    </div>
  );
}
