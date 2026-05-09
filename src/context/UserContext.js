'use client';
import { createContext, useContext, useReducer, useEffect } from 'react';
import { getUserProfile, saveUserProfile } from '../lib/storage';
import { calculateTargets } from '../lib/calculations';

const UserContext = createContext(null);

const initialState = {
  profile: null,
  isOnboarded: false,
  isTrainingDay: true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_PROFILE':
      return { ...state, profile: action.payload, isOnboarded: !!action.payload };
    case 'SET_PROFILE': {
      const targets = calculateTargets(action.payload);
      const full = { ...action.payload, ...targets };
      saveUserProfile(full);
      return { ...state, profile: full, isOnboarded: true };
    }
    case 'TOGGLE_TRAINING_DAY':
      return { ...state, isTrainingDay: !state.isTrainingDay };
    case 'UPDATE_PROFILE': {
      const updated = { ...state.profile, ...action.payload };
      const targets = calculateTargets(updated);
      const full = { ...updated, ...targets };
      saveUserProfile(full);
      return { ...state, profile: full };
    }
    default: return state;
  }
}

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const saved = getUserProfile();
    if (saved) dispatch({ type: 'LOAD_PROFILE', payload: saved });
  }, []);

  return (
    <UserContext.Provider value={{ ...state, dispatch }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
