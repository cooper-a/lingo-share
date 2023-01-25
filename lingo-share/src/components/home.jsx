import React from "react";
import { useRef } from "react";
import { Button } from "@chakra-ui/react";
import { db } from "../firebase";
import { addDoc, collection } from "@firebase/firestore";
import { get_token } from "../firebase";

export default function Home() {
  const nameRef = useRef();
  const ref = collection(db, "people");

  const handleSave = (e) => {
    e.preventDefault();
    console.log(nameRef.current.value);

    let data = {
      name: nameRef.current.value,
    };

    try {
      addDoc(ref, data);
    } catch (error) {
      console.log(error);
    }
  };

  const getToken = (e) => {
    e.preventDefault();
    get_token({room: "testing"})
      .then((result) => {
        // Read result of the Cloud Function.
        /** @type {any} */
        const data = result.data;
        const token = data.token;
        // console.log(token);
      })
      .catch((error) => {
        // Getting the Error details.
        const code = error.code;
        const message = error.message;
        const details = error.details;
        // ...
      });
  };


  return (
    <div>
      <h1>Home</h1>
      <form onSubmit={handleSave}>
        <label>Add to DB:</label>
        <input type="text" ref={nameRef} />
        <button type="submit">Submit</button>
        <Button onClick={getToken}>GetTokenTest</Button>
      </form>
    </div>
  );
}
