import React from "react";

const Lobby = ({username, roomName, handleUsernameChange, handleRoomNameChange, handleSubmit}) => {
    return (
        <form onSubmit={handleSubmit}>
            <label>Username:</label>
            <input type="text" id="field" value={username} onChange={handleUsernameChange}/>
            <label>Roomname:</label>
            <input type="text" id="room" value={roomName} onChange={handleRoomNameChange}/>
            <button type="submit">Submit</button>
        </form>
    )
}

export default Lobby