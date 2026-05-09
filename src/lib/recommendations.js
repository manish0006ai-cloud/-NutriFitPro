import gymFoods, { getFoodsByDiet } from './foodDatabase';

// Score a food based on remaining macros (0-100)
export function scoreFoodForRemaining(food, remaining) {
  let score = 0;
  if (remaining.protein > 10 && food.protein > 15) score += 30;
  else if (remaining.protein > 5 && food.protein > 8) score += 15;
  if (remaining.carbs > 20 && food.carbs > 15) score += 25;
  else if (remaining.carbs > 10 && food.carbs > 8) score += 12;
  if (remaining.fat > 10 && food.fat < 15) score += 15;
  if (remaining.calories > 200 && food.cal <= remaining.calories) score += 10;
  if (food.traffic === 'green') score += 15;
  else if (food.traffic === 'yellow') score += 5;
  else score -= 20;
  if (food.fiber > 3) score += 5;
  return Math.min(100, Math.max(0, score));
}

// Get top N food recommendations based on remaining macros
export function getRecommendations(remaining, diet, n = 10) {
  const foods = getFoodsByDiet(diet).filter(f => f.traffic !== 'red');
  return foods
    .map(f => ({ ...f, score: scoreFoodForRemaining(f, remaining) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}

// Pre-workout meal: high carbs (40-60g), moderate protein (20-30g), low fat (<10g)
export function getPreWorkoutMeals(diet) {
  return getFoodsByDiet(diet)
    .filter(f => f.traffic !== 'red')
    .map(f => {
      let score = 0;
      if (f.carbs >= 15) score += 35;
      if (f.protein >= 5) score += 25;
      if (f.fat <= 8) score += 25;
      if (f.fiber <= 5) score += 15;
      return { ...f, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

// Post-workout meal: high protein (30-40g), moderate carbs (50-80g), low fat
export function getPostWorkoutMeals(diet) {
  return getFoodsByDiet(diet)
    .filter(f => f.traffic !== 'red')
    .map(f => {
      let score = 0;
      if (f.protein >= 15) score += 40;
      if (f.carbs >= 10) score += 25;
      if (f.fat <= 10) score += 20;
      if (f.traffic === 'green') score += 15;
      return { ...f, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);
}

// Best foods list by goal
export function getBestFoodsForGoal(goal, diet) {
  const foods = getFoodsByDiet(diet).filter(f => f.traffic === 'green');
  if (goal === 'muscle_gain' || goal === 'recomposition') {
    return foods.sort((a, b) => b.protein - a.protein).slice(0, 15);
  }
  if (goal === 'fat_loss') {
    return foods.sort((a, b) => (b.protein / (b.cal || 1)) - (a.protein / (a.cal || 1))).slice(0, 15);
  }
  return foods.slice(0, 15);
}

// Foods to avoid
export function getFoodsToAvoid() {
  return gymFoods.filter(f => f.traffic === 'red');
}
