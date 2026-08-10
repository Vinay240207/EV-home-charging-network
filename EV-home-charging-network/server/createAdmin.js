require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const createAdmin = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected successfully");

    const email = "admin@evhome.com";
    const password = "Admin@123";

    const existingAdmin = await User.findOne({
      email: email,
    });

    if (existingAdmin) {
      existingAdmin.name = "EV Home Admin";
      existingAdmin.phone = "9999999999";
      existingAdmin.role = "admin";
      existingAdmin.password = await bcrypt.hash(password, 10);

      await existingAdmin.save();

      console.log("=================================");
      console.log("ADMIN ACCOUNT UPDATED");
      console.log("=================================");
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

      await User.create({
        name: "EV Home Admin",
        email: email,
        password: hashedPassword,
        phone: "9999999999",
        role: "admin",
      });

      console.log("=================================");
      console.log("ADMIN ACCOUNT CREATED");
      console.log("=================================");
    }

    console.log("Email    : admin@evhome.com");
    console.log("Password : Admin@123");
    console.log("Role     : admin");
    console.log("=================================");

    await mongoose.disconnect();

    process.exit(0);
  } catch (error) {
    console.error("=================================");
    console.error("ADMIN CREATION FAILED");
    console.error("=================================");
    console.error(error.message);

    process.exit(1);
  }
};

createAdmin();