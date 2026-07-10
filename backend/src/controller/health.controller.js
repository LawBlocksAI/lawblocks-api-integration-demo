import mongoose from "mongoose";

export const getHealth = (req, res) => {
  res.json({
    status: "ok",
    message: "Proxy server is healthy",
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
};

export const getTest = (req, res) => {
  res.send("Hello World");
};
