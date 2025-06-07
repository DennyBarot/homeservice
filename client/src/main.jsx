import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import App from './App.jsx';
import useUserStore from './store.js';
import Login from './pages/auth/login.jsx';
import Signup from './pages/auth/signup.jsx';
import Userhome from './pages/userhome/userhome.jsx';
import Providerhome from './pages/providerhome/providerhome.jsx';
import OrdersPage from './pages/providerhome/userorderspage.jsx';
import AccountPage from './pages/providerhome/providersaccount.jsx';
import ChatListPage from './pages/providerhome/chatstouser.jsx';
import MessagePageforProvider from './pages/providerhome/messagepageforprovider.jsx';
import MessagePageforUser from './pages/userhome/messagepageforuser.jsx';
import UserAccount from './pages/userhome/Useraccount.jsx';
import Services from './pages/userhome/services.jsx';
import ProvidersList from './pages/userhome/providerslist.jsx';
import ProviderDetails from './pages/userhome/providerDetails.jsx';
import './app.css';
import Chatstoprovider from './pages/userhome/chatstoprovider.jsx';
import Ordertoprovider from './pages/userhome/orderstoprovider.jsx';
import UserAbout from './pages/userhome/userabout.jsx';
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/providerhome',
    element: (
      <ProtectedRoute>
        <Providerhome />
      </ProtectedRoute>
    ),
  },
  {
    path: '/userhome',
    element: (
      <ProtectedRoute>
        <Userhome />
      </ProtectedRoute>
    ),
  },
  {
    path: '/orderspage',
    element: (
      <ProtectedRoute>
        <OrdersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/chatstouser',
    element: (
      <ProtectedRoute>
        <ChatListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/providerchat/:id',
    element: (
      <ProtectedRoute>
        <MessagePageforProvider />
      </ProtectedRoute>
    ),
  },
  {
    path: '/userchat/:id',
    element: (
      <ProtectedRoute>
        <MessagePageforUser />
      </ProtectedRoute>
    ),
  },
  {
    path: '/providersaccount',
    element: (
      <ProtectedRoute>
        <AccountPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/account',
    element: (
      <ProtectedRoute>
        <UserAccount />
      </ProtectedRoute>
    ),
  },
  {
    path: '/services',
    element: (
      <ProtectedRoute>
        <Services />
      </ProtectedRoute>
    ),
  },
  {
    path: '/providers/:category',
    element: (
      <ProtectedRoute>
        <ProvidersList />
      </ProtectedRoute>
    ),
  },
  {
    path: '/provider/:id',
    element: (
      <ProtectedRoute>
        <React.Suspense fallback={<div>Loading...</div>}><ProviderDetails /></React.Suspense>
      </ProtectedRoute>
    ),
  },
  {
    path: '/chatstoprovider',
    element: (
      <ProtectedRoute>
        <Chatstoprovider />
      </ProtectedRoute>
    ),
  },
  {
    path: '/ordertoprovider',
    element: (
      <ProtectedRoute>
        <Ordertoprovider />
      </ProtectedRoute>
    ),
  },
  {
    path: '/userabout',
    element: (
      <ProtectedRoute>
        <UserAbout />
      </ProtectedRoute>
    ),
  },
]);


const Root = () => {
  const [authLoading, setAuthLoading] = useState(true);
  const getCurrentUser = useUserStore((state) => state.getCurrentUser);
  const initializeSocket = useUserStore((state) => state.initializeSocket);
  const userProfile = useUserStore((state) => state.userProfile);
  const isAuthenticated = useUserStore((state) => state.isAuthenticated);

  useEffect(() => {
    const loadUser = async () => {
      await getCurrentUser();
      setAuthLoading(false);
    };
    loadUser();
  }, [getCurrentUser]);

  useEffect(() => {
    if (isAuthenticated && userProfile) {
      initializeSocket();
    }
  }, [isAuthenticated, userProfile, initializeSocket]);
  
  if (authLoading) {
    return <div>Loading authentication...</div>;
  }

  return (
    <>
      <App />
      <RouterProvider router={router} />
    </>
  );
};

createRoot(document.getElementById('root')).render(<Root />);