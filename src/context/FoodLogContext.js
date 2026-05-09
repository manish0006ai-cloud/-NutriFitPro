'use client';
import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { getDayLog, saveDayLog, getTodayKey } from '../lib/storage';

const FoodLogContext = createContext(null);

function recalcTotals(meals) {
  const totals = { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 };
  Object.values(meals).forEach(items => {
    items.forEach(item => {
      const mult = (item.quantity || 100) / 100;
      totals.calories += Math.round((item.cal || 0) * mult);
      totals.protein += Math.round((item.protein || 0) * mult);
      totals.carbs += Math.round((item.carbs || 0) * mult);
      totals.fat += Math.round((item.fat || 0) * mult);
      totals.fiber += Math.round((item.fiber || 0) * mult);
    });
  });
  return totals;
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_LOG':
      return { ...state, ...action.payload };
    case 'ADD_FOOD': {
      const { mealType, food } = action.payload;
      const meals = { ...state.meals, [mealType]: [...(state.meals[mealType] || []), food] };
      const totals = recalcTotals(meals);
      const log = { ...state, meals, totals };
      saveDayLog(log);
      return log;
    }
    case 'REMOVE_FOOD': {
      const { mealType: mt, index } = action.payload;
      const items = [...(state.meals[mt] || [])];
      items.splice(index, 1);
      const meals = { ...state.meals, [mt]: items };
      const totals = recalcTotals(meals);
      const log = { ...state, meals, totals };
      saveDayLog(log);
      return log;
    }
    case 'SET_WATER': {
      const log = { ...state, water: action.payload };
      saveDayLog(log);
      return log;
    }
    case 'TOGGLE_SUPPLEMENT': {
      const s = action.payload;
      const sups = state.supplements.includes(s)
        ? state.supplements.filter(x => x !== s)
        : [...state.supplements, s];
      const log = { ...state, supplements: sups };
      saveDayLog(log);
      return log;
    }
    default: return state;
  }
}

export function FoodLogProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, getDayLog());

  useEffect(() => {
    const log = getDayLog(getTodayKey());
    dispatch({ type: 'LOAD_LOG', payload: log });
  }, []);

  const addFood = useCallback((mealType, food) => {
    dispatch({ type: 'ADD_FOOD', payload: { mealType, food } });
  }, []);

  const removeFood = useCallback((mealType, index) => {
    dispatch({ type: 'REMOVE_FOOD', payload: { mealType, index } });
  }, []);

  const setWater = useCallback((glasses) => {
    dispatch({ type: 'SET_WATER', payload: glasses });
  }, []);

  const toggleSupplement = useCallback((id) => {
    dispatch({ type: 'TOGGLE_SUPPLEMENT', payload: id });
  }, []);

  return (
    <FoodLogContext.Provider value={{ ...state, addFood, removeFood, setWater, toggleSupplement, dispatch }}>
      {children}
    </FoodLogContext.Provider>
  );
}

export function useFoodLog() {
  const ctx = useContext(FoodLogContext);
  if (!ctx) throw new Error('useFoodLog must be used within FoodLogProvider');
  return ctx;
}
