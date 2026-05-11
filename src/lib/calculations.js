import { ACTIVITY_MULTIPLIERS, MACRO_RATIOS, PROTEIN_PER_KG, CALORIE_ADJUSTMENTS } from './constants';

// BMR using Mifflin-St Jeor (most accurate)
export function calculateBMR(weight, height, age, gender) {
  const base = 10 * weight + 6.25 * height - 5 * age;
  return Math.round(gender === 'male' ? base + 5 : base - 161);
}

// TDEE = BMR × activity multiplier
export function calculateTDEE(bmr, activityLevel) {
  return Math.round(bmr * (ACTIVITY_MULTIPLIERS[activityLevel] || 1.55));
}

// Daily calorie target based on goal
export function calculateCalorieTarget(tdee, goal) {
  return Math.round(tdee + (CALORIE_ADJUSTMENTS[goal] || 0));
}

// Macro targets in grams
export function calculateMacros(calories, goal, weightKg) {
  const ratios = MACRO_RATIOS[goal] || MACRO_RATIOS.maintenance;
  const proteinRange = PROTEIN_PER_KG[goal] || PROTEIN_PER_KG.maintenance;
  const proteinFromRatio = Math.round((calories * ratios.protein / 100) / 4);
  const proteinFromWeight = Math.round(weightKg * ((proteinRange.min + proteinRange.max) / 2));
  const protein = Math.max(proteinFromRatio, proteinFromWeight);
  const proteinCals = protein * 4;
  const remainingCals = calories - proteinCals;
  const fatRatio = ratios.fat / (ratios.fat + ratios.carbs);
  const carbRatio = ratios.carbs / (ratios.fat + ratios.carbs);
  const fat = Math.round((remainingCals * fatRatio) / 9);
  const carbs = Math.round((remainingCals * carbRatio) / 4);
  return { protein, carbs, fat, fiber: 30, water: 40 };
}

// Full profile calculation
export function calculateTargets(profile) {
  const { weight, height, age, gender, activityLevel, goal } = profile;
  const bmr = calculateBMR(weight, height, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  const calories = calculateCalorieTarget(tdee, goal);
  const macros = calculateMacros(calories, goal, weight);
  return { bmr, tdee, dailyTargets: { calories, ...macros } };
}

// Training day adjustment (+200 cal, more carbs)
export function getTrainingDayTargets(targets) {
  const cal = targets.calories + 200;
  return { ...targets, calories: cal, carbs: targets.carbs + 50 };
}

// Protein per meal distribution
export function proteinPerMeal(totalProtein, mealCount = 5) {
  return Math.round(totalProtein / mealCount);
}

// Nutrition score (0-100): how well user met targets
export function calculateNutritionScore(consumed, targets) {
  const metrics = ['calories', 'protein', 'carbs', 'fat'];
  let score = 0;
  metrics.forEach(m => {
    const ratio = consumed[m] / (targets[m] || 1);
    const accuracy = 1 - Math.abs(1 - ratio);
    score += Math.max(0, accuracy) * 25;
  });
  return Math.round(Math.min(100, score));
}
