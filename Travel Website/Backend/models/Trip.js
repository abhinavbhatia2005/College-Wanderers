import mongoose from 'mongoose';

const tripSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    destination: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    maxCapacity: {
        type: Number,
        required: true,
        min: 1
    },
    currentBookings: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    bookedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Virtual for available spots
tripSchema.virtual('availableSpots').get(function() {
    return this.maxCapacity - this.currentBookings;
});

// Method to check if trip is full
tripSchema.methods.isFull = function() {
    return this.currentBookings >= this.maxCapacity;
};

const Trip = mongoose.model('Trip', tripSchema);

export default Trip; 