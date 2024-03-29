const functions = require("firebase-functions");
const twilio = require("twilio");

exports.get_token = functions.https.onCall((data, context) => {
  // Authenticate the user
  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    throw new functions.https.HttpsError(
        "failed-precondition",
        "The function must be called " + "while authenticated."
    );
  }

  const identity = data.identity || "user";

  const accessToken = new twilio.jwt.AccessToken(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_API_KEY_SID,
      process.env.TWILIO_API_KEY_SECRET,
      {identity: identity}
  );

  // If no room is specified, use the user's uid as the room name
  // const room = data.room || context.auth.uid;
  const room = data.room || "room";
  // const name = context.auth.token.name || null;

  console.log("identity: " + identity);
  console.log("room: " + room);

  const videoGrant = new twilio.jwt.AccessToken.VideoGrant({
    room: room,
  });
  accessToken.addGrant(videoGrant);

  return {token: accessToken.toJwt()};
});

exports.block_user = functions.database
    .ref("/users/{uid}/blocked/{blockedUid}")
    .onCreate((snapshot, context) => {
      const uid = context.params.uid;
      const blockedUid = context.params.blockedUid;
      functions.logger.log("uid: " + uid);
      functions.logger.log("blockedUid: " + blockedUid);
      functions.logger.log("snapshot ref: " + snapshot.ref);
      const blockedUserFriendsRef = snapshot.ref.parent.parent.parent
          .child(blockedUid)
          .child("friends")
          .child(uid);
      console.log("blockedUserFriendsRef: " + blockedUserFriendsRef);
      const blockedUserBlockedByRef = snapshot.ref.parent.parent.parent
          .child(blockedUid)
          .child("blockedBy")
          .child(uid);
      return blockedUserFriendsRef.set(null).then(() => {
        blockedUserBlockedByRef.set(true);
      });
    });

exports.unfriend_user = functions.database
    .ref("/users/{uid}/friends/{friendUid}")
    .onDelete((snapshot, context) => {
      const uid = context.params.uid;
      const friendUid = context.params.friendUid;
      functions.logger.log("uid: " + uid);
      functions.logger.log("friendUid: " + friendUid);
      functions.logger.log("snapshot ref: " + snapshot.ref);
      const friendUserFriendsRef = snapshot.ref.parent.parent.parent
          .child(friendUid)
          .child("friends")
          .child(uid);
      console.log("friendUserFriendsRef: " + friendUserFriendsRef);
      return friendUserFriendsRef.set(null);
    });

exports.unblock_user = functions.database
    .ref("/users/{uid}/blocked/{blockedUid}")
    .onDelete((snapshot, context) => {
      const uid = context.params.uid;
      const blockedUid = context.params.blockedUid;
      functions.logger.log("uid: " + uid);
      functions.logger.log("blockedUid: " + blockedUid);
      functions.logger.log("snapshot ref: " + snapshot.ref);
      const blockedUserBlockedByRef = snapshot.ref.parent.parent.parent
          .child(blockedUid)
          .child("blockedBy")
          .child(uid);
      console.log("blockedUserBlockedByRef: " + blockedUserBlockedByRef);
      return blockedUserBlockedByRef.set(null);
    });
