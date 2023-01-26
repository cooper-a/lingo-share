import React from "react";

const Lobby = ({username, handleUsernameChange, roomname, handleRoomNameChange, handleSubmit}) => {
    return (
        <form onSubmit={handleSubmit}>
            <label>Username:</label>
            <input type="text" id="field" value={username} onChange={handleUsernameChange}/>
            <label>Roomname:</label>
            <input type="text" id="room" value={roomname} onChange={handleRoomNameChange}/>
            <button type="submit">Submit</button>
        </form>
    )
}

export default Lobby