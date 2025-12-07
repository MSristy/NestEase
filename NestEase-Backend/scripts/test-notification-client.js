#!/usr/bin/env node
/*
 * Simple test client to connect to the NestEase notifications socket using a JWT,
 * listen for 'notification' events, and trigger a test notification via REST.
 *
 * Usage:
 *   node scripts/test-notification-client.js <email> <password>
 *
 * Requirements:
 *   npm install axios socket.io-client
 */

const axios = require("axios");
const io = require("socket.io-client");

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  if (!email || !password) {
    console.error(
      "Usage: node scripts/test-notification-client.js <email> <password>"
    );
    process.exit(1);
  }

  try {
    const loginResp = await axios.post(
      "http://localhost:3001/api/auth/login",
      {
        email,
        password,
      },
      {
        validateStatus: false,
      }
    );

    if (!loginResp.data || !loginResp.data.token) {
      console.error(
        "Login failed or token not returned:",
        loginResp.status,
        loginResp.data
      );
      process.exit(2);
    }

    const token = loginResp.data.token;
    console.log("Logged in. Got token of length:", token.length);

    // Connect over socket.io with JWT token in auth
    const socket = io("http://localhost:3001", {
      transports: ["websocket"],
      auth: { token },
    });

    socket.on("connect", () => {
      console.log("Socket connected, id:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    socket.on("notification", (notification) => {
      console.log("Received notification:", notification);
    });

    // Trigger a notification through the API to ensure it gets emitted
    const testResp = await axios.post(
      "http://localhost:3001/notifications/test",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        validateStatus: false,
      }
    );

    if (testResp.status !== 200) {
      console.warn(
        "Test endpoint returned non-200:",
        testResp.status,
        testResp.data
      );
    } else {
      console.log("Created test notification:", testResp.data);
    }

    console.log("Waiting for notifications... (Ctrl+C to exit)");
  } catch (err) {
    console.error("Error:", err.message || err);
    process.exit(3);
  }
}

main();
