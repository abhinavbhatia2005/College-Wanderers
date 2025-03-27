import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Check if current page is login or register
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled || isAuthPage ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/" 
            className={`text-2xl font-bold ${scrolled || isAuthPage ? 'text-primary-600' : 'text-white drop-shadow-md'}`}
          >
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
              </svg>
              College Explorer
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `${isActive 
                  ? (scrolled || isAuthPage ? 'text-primary-600 font-medium' : 'text-white font-medium') 
                  : (scrolled || isAuthPage ? 'text-gray-700 hover:text-primary-600' : 'text-white/90 hover:text-white')
                } transition-colors`
              }
            >
              Home
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink 
                  to="/create-trip" 
                  className={({ isActive }) => 
                    `${isActive 
                      ? (scrolled || isAuthPage ? 'text-primary-600 font-medium' : 'text-white font-medium') 
                      : (scrolled || isAuthPage ? 'text-gray-700 hover:text-primary-600' : 'text-white/90 hover:text-white')
                    } transition-colors`
                  }
                >
                  Create Trip
                </NavLink>
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => 
                    `${isActive 
                      ? (scrolled || isAuthPage ? 'text-primary-600 font-medium' : 'text-white font-medium') 
                      : (scrolled || isAuthPage ? 'text-gray-700 hover:text-primary-600' : 'text-white/90 hover:text-white')
                    } transition-colors`
                  }
                >
                  Profile
                </NavLink>
                <button 
                  onClick={handleLogout}
                  className={`${
                    scrolled || isAuthPage
                      ? 'text-gray-700 hover:text-primary-600' 
                      : 'text-white/90 hover:text-white'
                  } transition-colors`}
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className={`px-4 py-2 rounded-full ${
                    scrolled || isAuthPage
                      ? 'text-primary-600 hover:bg-primary-50' 
                      : 'text-white hover:bg-white/10'
                  } transition-colors`}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className={`px-4 py-2 rounded-full ${
                    scrolled || isAuthPage
                      ? 'bg-primary-600 text-white hover:bg-primary-700' 
                      : 'bg-white text-primary-600 hover:bg-white/90'
                  } transition-colors shadow-sm hover:shadow-md`}
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMenu} 
            className={`md:hidden p-2 rounded-md ${
              scrolled || isAuthPage
                ? 'text-gray-700 hover:bg-gray-100' 
                : 'text-white hover:bg-white/10'
            }`}
          >
            {isMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMenuOpen ? 'max-h-screen opacity-100 py-4' : 'max-h-0 opacity-0'
        }`}>
          <div className={`flex flex-col space-y-3 ${scrolled || isAuthPage ? 'text-gray-700' : 'text-white'}`}>
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `${isActive 
                  ? (scrolled || isAuthPage ? 'text-primary-600 font-medium' : 'text-white font-medium') 
                  : (scrolled || isAuthPage ? 'text-gray-700' : 'text-white/90')
                } block px-4 py-2 rounded-md ${scrolled || isAuthPage ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`
              }
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink 
                  to="/create-trip" 
                  className={({ isActive }) => 
                    `${isActive 
                      ? (scrolled || isAuthPage ? 'text-primary-600 font-medium' : 'text-white font-medium') 
                      : (scrolled || isAuthPage ? 'text-gray-700' : 'text-white/90')
                    } block px-4 py-2 rounded-md ${scrolled || isAuthPage ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Create Trip
                </NavLink>
                <NavLink 
                  to="/profile" 
                  className={({ isActive }) => 
                    `${isActive 
                      ? (scrolled || isAuthPage ? 'text-primary-600 font-medium' : 'text-white font-medium') 
                      : (scrolled || isAuthPage ? 'text-gray-700' : 'text-white/90')
                    } block px-4 py-2 rounded-md ${scrolled || isAuthPage ? 'hover:bg-gray-100' : 'hover:bg-white/10'}`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profile
                </NavLink>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className={`text-left block px-4 py-2 rounded-md ${
                    scrolled || isAuthPage
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : 'text-white/90 hover:bg-white/10'
                  }`}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className={`block px-4 py-2 rounded-md ${
                    scrolled || isAuthPage
                      ? 'text-gray-700 hover:bg-gray-100' 
                      : 'text-white/90 hover:bg-white/10'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className={`block px-4 py-2 rounded-md ${
                    scrolled || isAuthPage
                      ? 'bg-primary-600 text-white' 
                      : 'bg-white text-primary-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 