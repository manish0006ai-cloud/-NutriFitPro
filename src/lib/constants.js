// Activity level multipliers for TDEE calculation
export const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  athlete: 1.9,
};

// Macro ratios by goal (protein/carbs/fat percentages)
export const MACRO_RATIOS = {
  muscle_gain: { protein: 30, carbs: 45, fat: 25 },
  fat_loss: { protein: 35, carbs: 35, fat: 30 },
  maintenance: { protein: 25, carbs: 45, fat: 30 },
  recomposition: { protein: 35, carbs: 40, fat: 25 },
};

// Protein per kg body weight
export const PROTEIN_PER_KG = {
  muscle_gain: { min: 1.6, max: 2.2 },
  fat_loss: { min: 1.8, max: 2.4 },
  maintenance: { min: 1.2, max: 1.6 },
  recomposition: { min: 1.6, max: 2.2 },
};

// Calorie adjustments
export const CALORIE_ADJUSTMENTS = {
  muscle_gain: 300,
  fat_loss: -400,
  maintenance: 0,
  recomposition: -200,
};

export const MEAL_TYPES = [
  { id: 'breakfast', label: 'Breakfast', icon: '🌅', time: '7:00 AM' },
  { id: 'lunch', label: 'Lunch', icon: '☀️', time: '12:30 PM' },
  { id: 'pre_workout', label: 'Pre-Workout', icon: '⚡', time: '4:00 PM' },
  { id: 'post_workout', label: 'Post-Workout', icon: '💪', time: '6:00 PM' },
  { id: 'dinner', label: 'Dinner', icon: '🌙', time: '8:00 PM' },
  { id: 'snacks', label: 'Snacks', icon: '🍎', time: 'Anytime' },
];

export const GOALS = [
  { id: 'muscle_gain', label: 'Muscle Gain', icon: '💪', desc: 'Build lean muscle mass', color: '#22c55e' },
  { id: 'fat_loss', label: 'Fat Loss', icon: '🔥', desc: 'Lose fat, preserve muscle', color: '#ef4444' },
  { id: 'maintenance', label: 'Maintenance', icon: '⚖️', desc: 'Maintain current physique', color: '#3b82f6' },
  { id: 'recomposition', label: 'Recomposition', icon: '🔄', desc: 'Lose fat & gain muscle', color: '#a855f7' },
];

export const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary', desc: 'Desk job, no exercise' },
  { id: 'lightly_active', label: 'Lightly Active', desc: '1-3 days/week' },
  { id: 'moderately_active', label: 'Moderately Active', desc: '3-5 days/week' },
  { id: 'very_active', label: 'Very Active', desc: '6-7 days/week' },
  { id: 'athlete', label: 'Athlete', desc: '2x/day training' },
];

export const SUPPLEMENTS = [
  { id: 'creatine', label: 'Creatine', dose: '5g/day' },
  { id: 'whey', label: 'Whey Protein', dose: '25-30g/serving' },
  { id: 'multivitamin', label: 'Multivitamin', dose: '1/day' },
  { id: 'bcaa', label: 'BCAAs', dose: '5-10g/day' },
  { id: 'omega3', label: 'Omega-3', dose: '1-2g/day' },
  { id: 'vitamin_d', label: 'Vitamin D', dose: '2000-5000 IU/day' },
];

// USDA nutrient IDs mapped to readable names
export const NUTRIENT_MAP = {
  1008: { name: 'calories', unit: 'kcal' },
  1003: { name: 'protein', unit: 'g' },
  1005: { name: 'carbs', unit: 'g' },
  1004: { name: 'fat', unit: 'g' },
  1079: { name: 'fiber', unit: 'g' },
  2000: { name: 'sugars', unit: 'g' },
  1258: { name: 'saturatedFat', unit: 'g' },
  1292: { name: 'transFat', unit: 'g' },
  1253: { name: 'cholesterol', unit: 'mg' },
  1093: { name: 'sodium', unit: 'mg' },
  1092: { name: 'potassium', unit: 'mg' },
  1087: { name: 'calcium', unit: 'mg' },
  1089: { name: 'iron', unit: 'mg' },
  1090: { name: 'magnesium', unit: 'mg' },
  1095: { name: 'zinc', unit: 'mg' },
  1091: { name: 'phosphorus', unit: 'mg' },
  1106: { name: 'vitaminA', unit: 'mcg' },
  1165: { name: 'vitaminB1', unit: 'mg' },
  1166: { name: 'vitaminB2', unit: 'mg' },
  1167: { name: 'vitaminB3', unit: 'mg' },
  1175: { name: 'vitaminB6', unit: 'mg' },
  1178: { name: 'vitaminB12', unit: 'mcg' },
  1162: { name: 'vitaminC', unit: 'mg' },
  1114: { name: 'vitaminD', unit: 'mcg' },
  1109: { name: 'vitaminE', unit: 'mg' },
  1185: { name: 'vitaminK', unit: 'mcg' },
  1177: { name: 'folate', unit: 'mcg' },
};

export const EGG_SIZES = [
  { id: 'small', label: 'Small', weight: 40 },
  { id: 'medium', label: 'Medium', weight: 50 },
  { id: 'large', label: 'Large', weight: 60 },
];
