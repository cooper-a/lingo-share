import React from "react";
import { useRef } from "react";

import { db } from "../firebase";
import { addDoc, collection } from "@firebase/firestore";

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

  return (
    <div>
      <h1>Home</h1>
      <form onSubmit={handleSave}>
        <label>Add to DB:</label>
        <input type="text" ref={nameRef} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
