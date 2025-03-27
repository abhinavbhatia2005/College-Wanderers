import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const [userTrips, setUserTrips] = useState([]);
  const [bookedTrips, setBookedTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
    fetchUserTrips();
  }, []);

  const fetchUserTrips = async () => {
    try {
      const [createdTrips, bookedTrips] = await Promise.all([
        axios.get('http://localhost:5000/api/trips', {
          params: { creator: user._id }
        }),
        axios.get('http://localhost:5000/api/trips', {
          params: { bookedBy: user._id }
        })
      ]);

      setUserTrips(createdTrips.data);
      setBookedTrips(bookedTrips.data);
    } catch (error) {
      toast.error('Error fetching trips');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {user.name}</p>
              <p><span className="font-medium">Email:</span> {user.email}</p>
              <p><span className="font-medium">Phone:</span> {user.phone || 'Not provided'}</p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Address</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Street:</span> {user.address?.street || 'Not provided'}</p>
              <p><span className="font-medium">City:</span> {user.address?.city || 'Not provided'}</p>
              <p><span className="font-medium">State:</span> {user.address?.state || 'Not provided'}</p>
              <p><span className="font-medium">Country:</span> {user.address?.country || 'Not provided'}</p>
              <p><span className="font-medium">ZIP Code:</span> {user.address?.zipCode || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Trips Created</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userTrips.map((trip) => (
              <Link
                key={trip._id}
                to={`/trips/${trip._id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={trip.image}
                  alt={trip.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{trip.title}</h3>
                  <p className="text-gray-600 mb-2">{trip.destination}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-600 font-semibold">₹{trip.price}</span>
                    <span className="text-gray-500">
                      {trip.currentBookings}/{trip.maxCapacity} spots taken
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Booked Trips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookedTrips.map((trip) => (
              <Link
                key={trip._id}
                to={`/trips/${trip._id}`}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={trip.image}
                  alt={trip.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{trip.title}</h3>
                  <p className="text-gray-600 mb-2">{trip.destination}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-primary-600 font-semibold">₹{trip.price}</span>
                    <span className="text-gray-500">
                      {trip.currentBookings}/{trip.maxCapacity} spots taken
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 