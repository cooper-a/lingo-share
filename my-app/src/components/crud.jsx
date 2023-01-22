import React from "react";
import { Button } from "@chakra-ui/react";
import { useRef } from "react";
import { UserAuth } from "../contexts/AuthContext";
import { set, ref } from "firebase/database";
import { rtdb } from "../firebase";

export default function Crud() {
  const { user } = UserAuth();
  const messageRef = useRef();
  const handleSave = (e) => {
    e.preventDefault();
    console.log(messageRef.current.value);

    let data = {
      name: messageRef.current.value,
    };

    try {
      const message_ref = ref(rtdb, "users/" + user.uid);
      set(message_ref, data);
      console.log(user.auth);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Home</h1>
      <form onSubmit={handleSave}>
        <label>Add a message to DB:</label>
        <input type="text" ref={messageRef} />
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
