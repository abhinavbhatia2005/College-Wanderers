import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Trip from '../models/Trip.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

// Load environment variables
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log("MongoDB URI:", process.env.MONGODB_URI); // Debugging

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Sample admin user ID
let adminId;

// Clear previous trip data (but keep users)
const clearDatabase = async () => {
  try {
    await Trip.deleteMany({});
    console.log('Trips collection cleared');

    // Find or create an admin user
    const adminUser = await User.findOne({ email: 'admin@college.edu' });
    if (adminUser) {
      adminId = adminUser._id;
      console.log('Admin user found:', adminId);
    } else {
      console.log('Admin user not found, creating a new one...');
      const newAdmin = new User({
        name: 'College Admin',
        email: 'admin@college.edu',
        password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1MpnX.', // password: admin123
        phone: '9876543210',
        address: {
          street: 'College Campus',
          city: 'Jaipur',
          state: 'Rajasthan',
          country: 'India',
          zipCode: '302001'
        }
      });
      const savedAdmin = await newAdmin.save();
      adminId = savedAdmin._id;
      console.log('Admin user created:', adminId);
    }
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

// Rajasthan trips data (added missing image)
const rajasthanTrips = [
  {
    title: 'Jaipur Heritage Tour',
    description: 'Explore the Pink City with your college friends! Visit Hawa Mahal, City Palace, Jantar Mantar, and Amber Fort. Perfect weekend getaway to learn about Rajasthan\'s rich history and architecture.',
    destination: 'Jaipur',
    startDate: new Date('2025-01-15'),
    endDate: new Date('2025-01-17'),
    price: 1500,
    maxCapacity: 30,
    currentBookings: 0,
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=2070',
    bookedBy: []
  },
  {
    title: 'Udaipur Lake City Retreat',
    description: 'Experience the city of lakes with this 3-day trip to Udaipur. Visit Lake Pichola, City Palace, and enjoy a cultural evening. Great for photography enthusiasts and architecture students.',
    destination: 'Udaipur',
    startDate: new Date('2023-12-22'),
    endDate: new Date('2023-12-24'),
    price: 2000,
    maxCapacity: 25,
    currentBookings: 0,
    image: 'https://images.unsplash.com/photo-1595658658481-d53d3f999875?q=80&w=2074',
    bookedBy: []
  },
  {
    title: 'Jaisalmer Desert Camp',
    description: 'Experience the Thar Desert with overnight camping in Jaisalmer. Enjoy camel rides, folk performances, and stargazing. Perfect for adventure lovers and geology students.',
    destination: 'Jaisalmer',
    startDate: new Date('2024-01-12'),
    endDate: new Date('2024-01-14'),
    price: 2200,
    maxCapacity: 20,
    currentBookings: 0,
    image: 'https://images.unsplash.com/photo-1590050752117-42bb0ffd6dd3?q=80&w=2033',  // ✅ Added missing image
    bookedBy: []
  },
  {
    title: 'Pushkar Camel Fair Special',
    description: 'Join us for the famous Pushkar Camel Fair! Experience the vibrant traditions, camel races, and cultural performances. Special photography workshop included for art students.',
    destination: 'Pushkar',
    startDate: new Date('2023-11-25'),
    endDate: new Date('2023-11-27'),
    price: 1600,
    maxCapacity: 20,
    currentBookings: 0,
    image: 'https://www.travel-rajasthan.com/blog/wp-content/uploads/2019/07/PushkarCamelFair-1024x682.jpg',
    bookedBy: []
  },
  {
    title: 'Kumbhalgarh & Ranakpur Weekend',
    description: 'Visit the second-longest wall in the world at Kumbhalgarh Fort and the magnificent Jain temples of Ranakpur. Great educational tour for history and religious studies.',
    destination: 'Kumbhalgarh',
    startDate: new Date('2025-10-05'),
    endDate: new Date('2025-10-07'),
    price: 1800,
    maxCapacity: 20,
    currentBookings: 0,
    image: 'https://images.unsplash.com/photo-1590050752117-42bb0ffd6dd3?q=80&w=2033',
    bookedBy: []
  }
];

// Seed the database
const seedDatabase = async () => {
  try {
    await clearDatabase();

    // Ensure adminId is defined
    if (!adminId) {
      console.error('Error: Admin ID is undefined.');
      process.exit(1);
    }

    // Attach the admin ID as the creator of each trip
    const tripsWithCreator = rajasthanTrips.map(trip => ({
      ...trip,
      creator: adminId
    }));

    await Trip.insertMany(tripsWithCreator);
    console.log('Database seeded with Rajasthan college trips!');

    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seeding process
seedDatabase();
