const express = require("express");
const axios = require("axios");
require("dotenv").config();

const app = express();
const port = 3000;

// OAuth configuration
const clientID = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_CLIENT_SECRET;
const redirectURI = process.env.TWITCH_REDIRECT_URI;
const scopes = "channel:read:redemptions";

// Authorization endpoint
app.get("/auth/twitch", (req, res) => {
  res.redirect(
    `https://id.twitch.tv/oauth2/authorize?client_id=${clientID}&redirect_uri=${redirectURI}&response_type=code&scope=${scopes}`
    //
  );
});

// Callback endpoint
app.get("/auth/twitch/callback", async (req, res) => {
  const code = req.query.code;

  // Exchange authorization code for access token
  try {
    const response = await axios.post(
      "https://id.twitch.tv/oauth2/token",
      null,
      {
        params: {
          client_id: clientID,
          client_secret: clientSecret,
          code: req.query.code,
          grant_type: "client_credentials",
          redirect_uri: redirectURI,
        },
      }
    );

    const accessToken = response.data.access_token;
    console.log(accessToken);

    // Make API request to get channel point redemptions
    try {
      const redemptionsResponse = await axios.get(
        "https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions",
        {
          headers: {
            "Client-ID": clientID,
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            broadcaster_id: "aiyo_chu",
            reward_id: "boop",
          },
        }
      );

      const redemptions = redemptionsResponse.data.data;

      // Process the redemptions
      console.log("Channel Point Redemptions:");
      console.log(redemptions);
    } catch (error) {
      console.error("Error fetching redemptions:", error);
    }
  } catch (error) {
    console.error("Error exchanging code for access token:", error);
  }

  res.send("Authentication successful!");
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
