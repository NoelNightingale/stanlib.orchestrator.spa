/* eslint-disable prettier/prettier */
// src/components/ProtectedRoute.js
import React, { useContext } from 'react'

import { Navigate } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'


const ProtectedRoute = ({ children, requiredScopes = [] }) => {
  const { isAuthenticated, scopes } = useContext(AuthContext);

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requiredScopes.length > 0) {
    const hasScopes = requiredScopes.every(scope => scopes.includes(scope));
    if (!hasScopes) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return children;
}

export default ProtectedRoute
