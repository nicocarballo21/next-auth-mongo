import mongoose from "mongoose";

const connectMongoDb = async () => {
  if (mongoose.connections[0].readyState) return;
  try {
    await mongoose.connect(process.env.MONGO_URL ?? "", {});

    console.log("Connected to MongoDB");
  } catch (error) {
    throw new Error("Error connecting to MongoDB");
  }
};

export default connectMongoDb;
