const mongoose = require('mongoose')
require('dotenv').config()

const DATABASE = process.env.MONGO_URI  // make sure this is in your .env file

main().catch(err => console.log(err))

async function main() {
  await mongoose.connect(DATABASE)
  console.log("✅ Database connected")
}
