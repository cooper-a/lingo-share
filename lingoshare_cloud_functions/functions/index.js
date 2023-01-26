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

  const accessToken = new twilio.jwt.AccessToken(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_API_KEY_SID,
    process.env.TWILIO_API_KEY_SECRET
  );

  // If no room is specified, use the user's uid as the room name
  // const room = data.room || context.auth.uid;
  const room = "room1"

  const name = context.auth.token.name || null;

  console.log(name)
  accessToken.identity = "user";
  console.log(room);
  const videoGrant = new twilio.jwt.AccessToken.VideoGrant({
    room: room,
  });
  accessToken.addGrant(videoGrant);

  return { token: accessToken.toJwt() };
});
