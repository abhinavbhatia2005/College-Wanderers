import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';

const TripDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    fetchTripDetails();
  }, [id]);

  const fetchTripDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/trips/${id}`);
      setTrip(response.data);
    } catch (error) {
      toast.error('Error fetching trip details');
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to book a trip');
      navigate('/login');
      return;
    }

    setBooking(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/trips/${id}/book`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setTrip(response.data);
      toast.success('Trip booked successfully!');
    } catch (error) {
      const message = error.response?.data?.message || 'Error booking trip';
      toast.error(message);
    } finally {
      setBooking(false);
    }
  };

  const handleCancelBooking = async () => {
    setCancelling(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/trips/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setTrip(response.data);
      toast.success('Booking cancelled successfully');
    } catch (error) {
      const message = error.response?.data?.message || 'Error cancelling booking';
      toast.error(message);
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isBooked = () => {
    if (!isAuthenticated || !trip) return false;
    return trip.bookedBy.some(bookingUser => bookingUser._id === user.id);
  };
  
  const isCreator = () => {
    if (!isAuthenticated || !trip) return false;
    return trip.creator._id === user.id;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Trip Not Found</h2>
        <p className="mb-6">The trip you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate('/')}
          className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
        >
          Go Back Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-20 pb-16">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Trip Image */}
        <div className="h-80 overflow-hidden">
          <img 
            src={trip.image} 
            alt={trip.title} 
            className="w-full h-full object-cover"
          />
        </div>

        {/* Trip Content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{trip.title}</h1>
              <p className="text-lg text-gray-600 mb-2">{trip.destination}</p>
              <div className="flex items-center text-gray-500 mb-4">
                <span className="mr-4">{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                <span>{Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))} days</span>
              </div>

              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <span className="text-gray-600">Organized by:</span>
                  <span className="ml-2 font-medium">{trip.creator.name}</span>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 p-4 rounded-lg border border-primary-100 flex flex-col items-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">₹{trip.price}</div>
              <div className="text-sm text-gray-600 mb-4">per person</div>
              <div className="text-sm text-gray-600 mb-4">
                {trip.currentBookings}/{trip.maxCapacity} spots taken
              </div>

              {!isAuthenticated ? (
                <button
                  onClick={() => navigate('/login')}
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors"
                >
                  Log in to Book
                </button>
              ) : isCreator() ? (
                <div className="w-full text-center py-2 px-4 bg-gray-100 text-gray-600 rounded-md">
                  Your Trip
                </div>
              ) : isBooked() ? (
                <button
                  onClick={handleCancelBooking}
                  disabled={cancelling}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:bg-red-300"
                >
                  {cancelling ? 'Cancelling...' : 'Cancel Booking'}
                </button>
              ) : trip.currentBookings >= trip.maxCapacity ? (
                <div className="w-full text-center py-2 px-4 bg-gray-100 text-gray-600 rounded-md">
                  Fully Booked
                </div>
              ) : (
                <button
                  onClick={handleBooking}
                  disabled={booking}
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 transition-colors disabled:bg-primary-300"
                >
                  {booking ? 'Booking...' : 'Book Now'}
                </button>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-700 mb-6 whitespace-pre-wrap">{trip.description}</p>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Trip Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-900">Duration</h3>
                <p className="text-gray-600">
                  {Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24))} days
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Group Size</h3>
                <p className="text-gray-600">
                  Maximum {trip.maxCapacity} travelers
                </p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Start Date</h3>
                <p className="text-gray-600">{formatDate(trip.startDate)}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">End Date</h3>
                <p className="text-gray-600">{formatDate(trip.endDate)}</p>
              </div>
            </div>
          </div>

          {trip.bookedBy && trip.bookedBy.length > 0 && (
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Travelers ({trip.bookedBy.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {trip.bookedBy.map((traveler) => (
                  <div key={traveler._id} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                    {traveler.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripDetails; 