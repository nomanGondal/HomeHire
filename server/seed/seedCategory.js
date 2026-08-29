const mongoose = require("mongoose");
const dotenv = require("dotenv");
const ServiceCategory = require("../models/ServiceCategory");

dotenv.config();

const categories = [
  { name: "Electrician", slug: "electrician" },
  { name: "Plumber", slug: "plumber" },
  { name: "AC Technician", slug: "ac-technician" },
  { name: "Appliance Repair", slug: "appliance-repair" },
  { name: "Carpenter", slug: "carpenter" },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB for seeding...");

    for (const cat of categories) {
      await ServiceCategory.findOneAndUpdate(
        { slug: cat.slug },
        cat,
        { upsert: true, new: true } // insert if not exists, update if exists
      );
    }

    console.log("Service categories seeded successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
};

seed();