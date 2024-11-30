import mongoose from "mongoose"
import { MONGO_URI } from "../constants/env"

const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('Connected to database successfully!')
  }
  catch (err) {
    console.log("Could not connect to database", err)
    process.exit(1)
  }
}

export default connectToDatabase