import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://romiardana21:OX1AULqDAPLJG9rK@e-comel-online-shop.6kvvq.mongodb.net/?retryWrites=true&w=majority&appName=e-comel-online-shop"
    );
    console.log("database connected");
  } catch (error) {
    console.error("error connect", error);
    process.exit(1);
  }
};
export default connectDB;
