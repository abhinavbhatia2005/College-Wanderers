import express from 'express';
import Trip from '../models/Trip.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Get all trips with search functionality
router.get('/', async (req, res) => {
    try {
        const { search, destination, startDate, endDate } = req.query;
        let query = {};

        // Search by title or description
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by destination
        if (destination) {
            query.destination = { $regex: destination, $options: 'i' };
        }

        // Filter by date range
        if (startDate || endDate) {
            query.$and = [];
            
            // If startDate is provided, find trips that end on or after the startDate
            if (startDate) {
                const parsedStartDate = new Date(startDate);
                if (!isNaN(parsedStartDate.getTime())) {
                    console.log('Filtering by start date:', parsedStartDate);
                    query.$and.push({ endDate: { $gte: parsedStartDate } });
                } else {
                    console.log('Invalid start date provided:', startDate);
                }
            }
            
            // If endDate is provided, find trips that start on or before the endDate
            if (endDate) {
                const parsedEndDate = new Date(endDate);
                if (!isNaN(parsedEndDate.getTime())) {
                    console.log('Filtering by end date:', parsedEndDate);
                    query.$and.push({ startDate: { $lte: parsedEndDate } });
                } else {
                    console.log('Invalid end date provided:', endDate);
                }
            }
            
            // If $and array is empty, remove it
            if (query.$and.length === 0) {
                delete query.$and;
            }
        }

        console.log('Search query:', JSON.stringify(query, null, 2));

        const trips = await Trip.find(query)
            .populate('creator', 'name email')
            .sort({ createdAt: -1 });

        res.json(trips);
    } catch (error) {
        console.error('Error fetching trips:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get single trip
router.get('/:id', async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id)
            .populate('creator', 'name email')
            .populate('bookedBy', 'name email');
        
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        res.json(trip);
    } catch (error) {
        console.error('Error fetching trip:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create new trip (protected route)
router.post('/', auth, async (req, res) => {
    try {
        const trip = new Trip({
            ...req.body,
            creator: req.user.userId
        });

        await trip.save();
        res.status(201).json(trip);
    } catch (error) {
        console.error('Error creating trip:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Book a trip (protected route)
router.post('/:id/book', auth, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        if (trip.isFull()) {
            return res.status(400).json({ message: 'Trip is already full' });
        }

        if (trip.bookedBy.includes(req.user.userId)) {
            return res.status(400).json({ message: 'You have already booked this trip' });
        }

        trip.bookedBy.push(req.user.userId);
        trip.currentBookings += 1;
        await trip.save();

        res.json(trip);
    } catch (error) {
        console.error('Error booking trip:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Cancel booking (protected route)
router.post('/:id/cancel', auth, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        const bookingIndex = trip.bookedBy.indexOf(req.user.userId);
        if (bookingIndex === -1) {
            return res.status(400).json({ message: 'You have not booked this trip' });
        }

        trip.bookedBy.splice(bookingIndex, 1);
        trip.currentBookings -= 1;
        await trip.save();

        res.json(trip);
    } catch (error) {
        console.error('Error canceling booking:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update trip (protected route)
router.put('/:id', auth, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        if (trip.creator.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to update this trip' });
        }

        Object.assign(trip, req.body);
        await trip.save();

        res.json(trip);
    } catch (error) {
        console.error('Error updating trip:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete trip (protected route)
router.delete('/:id', auth, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        
        if (!trip) {
            return res.status(404).json({ message: 'Trip not found' });
        }

        if (trip.creator.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized to delete this trip' });
        }

        await trip.deleteOne();
        res.json({ message: 'Trip deleted successfully' });
    } catch (error) {
        console.error('Error deleting trip:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router; 