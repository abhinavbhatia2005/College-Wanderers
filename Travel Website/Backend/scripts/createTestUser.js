import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Import User model schema
    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      phone: String,
      address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zipCode: String
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    });
    
    const User = mongoose.model('User', userSchema);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: 'admin@college.edu' });
    
    if (existingUser) {
      console.log('Test user already exists, updating password...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      await User.updateOne({ email: 'admin@college.edu' }, { password: hashedPassword });
    } else {
      console.log('Creating test user...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      const user = new User({
        name: 'Admin User',
        email: 'admin@college.edu',
        password: hashedPassword,
        phone: '555-123-4567',
        address: {
          street: '123 Campus Drive',
          city: 'College Town',
          state: 'CA',
          country: 'USA',
          zipCode: '90210'
        }
      });
      await user.save();
    }
    
    console.log('Test user ready with email: admin@college.edu and password: password123');
    process.exit(0);
  })
  .catch(err => {
    console.error('Error:', err);
    process.exit(1);
  }); 