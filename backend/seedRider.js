// Script to seed a default rider user
const mongoose = require('mongoose');
const User = require('./models/user.model');

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://jayeshkakhani29:POQzpGE8NdiPZonY@cluster0.jkrc3.mongodb.net/fan_ac_ecommerce'; // Change if needed

async function seedRider() {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Check if rider already exists
    const existing = await User.findOne({ email: 'rider@example.com' });
    if (existing) {
      console.log('Rider user already exists:', existing.email);
      process.exit(0);
    }

    const rider = new User({
      name: 'Rider One',
      email: 'rider@example.com',
      password: 'rider123',
      role: 'rider',
    });
    await rider.save();
    console.log('Rider user created:');
    console.log('Email: rider@example.com');
    console.log('Password: rider123');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding rider:', err);
    process.exit(1);
  }
}

seedRider();
