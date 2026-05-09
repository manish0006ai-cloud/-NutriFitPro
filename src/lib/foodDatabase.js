// 50+ gym-friendly foods with full nutrition per 100g
const gymFoods = [
  // HIGH PROTEIN
  { id:'chicken_breast', name:'Chicken Breast (Grilled)', category:'protein', diet:['non_veg'], traffic:'green', cal:165, protein:31, carbs:0, fat:3.6, fiber:0, vitC:0, calcium:15, iron:1, vitB6:0.6, vitB12:0.3 },
  { id:'eggs_whole', name:'Whole Eggs', category:'protein', diet:['non_veg'], traffic:'green', cal:155, protein:13, carbs:1.1, fat:11, fiber:0, vitC:0, calcium:56, iron:1.8, vitB6:0.1, vitB12:0.9 },
  { id:'egg_whites', name:'Egg Whites', category:'protein', diet:['non_veg'], traffic:'green', cal:52, protein:11, carbs:0.7, fat:0.2, fiber:0, vitC:0, calcium:7, iron:0.1, vitB6:0, vitB12:0.1 },
  { id:'greek_yogurt', name:'Greek Yogurt (Plain)', category:'protein', diet:['non_veg','veg'], traffic:'green', cal:59, protein:10, carbs:3.6, fat:0.4, fiber:0, vitC:0, calcium:110, iron:0.1, vitB6:0.1, vitB12:0.8 },
  { id:'cottage_cheese', name:'Cottage Cheese (Paneer)', category:'protein', diet:['veg'], traffic:'green', cal:265, protein:18, carbs:1.2, fat:21, fiber:0, vitC:0, calcium:480, iron:0.2, vitB6:0, vitB12:0.8 },
  { id:'tuna_canned', name:'Tuna (Canned in Water)', category:'protein', diet:['non_veg'], traffic:'green', cal:116, protein:26, carbs:0, fat:0.8, fiber:0, vitC:0, calcium:12, iron:1.3, vitB6:0.4, vitB12:2.9 },
  { id:'salmon', name:'Salmon Fillet', category:'protein', diet:['non_veg'], traffic:'green', cal:208, protein:20, carbs:0, fat:13, fiber:0, vitC:0, calcium:12, iron:0.3, vitB6:0.6, vitB12:3.2 },
  { id:'turkey_breast', name:'Turkey Breast', category:'protein', diet:['non_veg'], traffic:'green', cal:135, protein:30, carbs:0, fat:1, fiber:0, vitC:0, calcium:10, iron:1.1, vitB6:0.7, vitB12:0.4 },
  { id:'tofu', name:'Firm Tofu', category:'protein', diet:['veg','vegan'], traffic:'green', cal:76, protein:8, carbs:1.9, fat:4.8, fiber:0.3, vitC:0.1, calcium:350, iron:5.4, vitB6:0.1, vitB12:0 },
  { id:'lentils', name:'Lentils (Cooked)', category:'protein', diet:['veg','vegan'], traffic:'green', cal:116, protein:9, carbs:20, fat:0.4, fiber:7.9, vitC:1.5, calcium:19, iron:3.3, vitB6:0.2, vitB12:0 },
  { id:'chickpeas', name:'Chickpeas (Cooked)', category:'protein', diet:['veg','vegan'], traffic:'green', cal:164, protein:8.9, carbs:27, fat:2.6, fiber:7.6, vitC:1.3, calcium:49, iron:2.9, vitB6:0.1, vitB12:0 },
  { id:'whey_protein', name:'Whey Protein (1 scoop)', category:'protein', diet:['non_veg','veg'], traffic:'green', cal:120, protein:24, carbs:3, fat:1.5, fiber:0, vitC:0, calcium:100, iron:0.5, vitB6:0, vitB12:0 },
  // COMPLEX CARBS
  { id:'oats', name:'Rolled Oats', category:'carbs', diet:['veg','vegan'], traffic:'green', cal:389, protein:17, carbs:66, fat:7, fiber:10, vitC:0, calcium:54, iron:4.7, vitB6:0.1, vitB12:0 },
  { id:'brown_rice', name:'Brown Rice (Cooked)', category:'carbs', diet:['veg','vegan'], traffic:'green', cal:123, protein:2.7, carbs:26, fat:1, fiber:1.8, vitC:0, calcium:10, iron:0.5, vitB6:0.1, vitB12:0 },
  { id:'sweet_potato', name:'Sweet Potato (Baked)', category:'carbs', diet:['veg','vegan'], traffic:'green', cal:90, protein:2, carbs:21, fat:0.1, fiber:3.3, vitC:20, calcium:38, iron:0.7, vitB6:0.3, vitB12:0 },
  { id:'quinoa', name:'Quinoa (Cooked)', category:'carbs', diet:['veg','vegan'], traffic:'green', cal:120, protein:4.4, carbs:21, fat:1.9, fiber:2.8, vitC:0, calcium:17, iron:1.5, vitB6:0.1, vitB12:0 },
  { id:'whole_wheat_bread', name:'Whole Wheat Bread', category:'carbs', diet:['veg','vegan'], traffic:'yellow', cal:247, protein:13, carbs:41, fat:3.4, fiber:7, vitC:0, calcium:107, iron:2.5, vitB6:0.2, vitB12:0 },
  { id:'banana', name:'Banana', category:'carbs', diet:['veg','vegan'], traffic:'green', cal:89, protein:1.1, carbs:23, fat:0.3, fiber:2.6, vitC:8.7, calcium:5, iron:0.3, vitB6:0.4, vitB12:0 },
  { id:'white_rice', name:'White Rice (Cooked)', category:'carbs', diet:['veg','vegan'], traffic:'yellow', cal:130, protein:2.7, carbs:28, fat:0.3, fiber:0.4, vitC:0, calcium:10, iron:0.2, vitB6:0.1, vitB12:0 },
  { id:'pasta', name:'Whole Wheat Pasta (Cooked)', category:'carbs', diet:['veg','vegan'], traffic:'yellow', cal:124, protein:5.3, carbs:25, fat:0.5, fiber:4.5, vitC:0, calcium:15, iron:1.4, vitB6:0.1, vitB12:0 },
  // HEALTHY FATS
  { id:'avocado', name:'Avocado', category:'fats', diet:['veg','vegan'], traffic:'green', cal:160, protein:2, carbs:9, fat:15, fiber:7, vitC:10, calcium:12, iron:0.6, vitB6:0.3, vitB12:0 },
  { id:'almonds', name:'Almonds', category:'fats', diet:['veg','vegan'], traffic:'green', cal:579, protein:21, carbs:22, fat:50, fiber:12, vitC:0, calcium:269, iron:3.7, vitB6:0.1, vitB12:0 },
  { id:'peanut_butter', name:'Peanut Butter (Natural)', category:'fats', diet:['veg','vegan'], traffic:'yellow', cal:588, protein:25, carbs:20, fat:50, fiber:6, vitC:0, calcium:43, iron:1.7, vitB6:0.4, vitB12:0 },
  { id:'olive_oil', name:'Olive Oil (1 tbsp)', category:'fats', diet:['veg','vegan'], traffic:'green', cal:884, protein:0, carbs:0, fat:100, fiber:0, vitC:0, calcium:1, iron:0.6, vitB6:0, vitB12:0 },
  { id:'chia_seeds', name:'Chia Seeds', category:'fats', diet:['veg','vegan'], traffic:'green', cal:486, protein:17, carbs:42, fat:31, fiber:34, vitC:1.6, calcium:631, iron:7.7, vitB6:0, vitB12:0 },
  { id:'walnuts', name:'Walnuts', category:'fats', diet:['veg','vegan'], traffic:'green', cal:654, protein:15, carbs:14, fat:65, fiber:7, vitC:1.3, calcium:98, iron:2.9, vitB6:0.5, vitB12:0 },
  { id:'flaxseeds', name:'Flaxseeds', category:'fats', diet:['veg','vegan'], traffic:'green', cal:534, protein:18, carbs:29, fat:42, fiber:27, vitC:0.6, calcium:255, iron:5.7, vitB6:0.5, vitB12:0 },
  // MICRONUTRIENT-RICH
  { id:'spinach', name:'Spinach (Raw)', category:'micro', diet:['veg','vegan'], traffic:'green', cal:23, protein:2.9, carbs:3.6, fat:0.4, fiber:2.2, vitC:28, calcium:99, iron:2.7, vitB6:0.2, vitB12:0 },
  { id:'broccoli', name:'Broccoli (Steamed)', category:'micro', diet:['veg','vegan'], traffic:'green', cal:35, protein:2.4, carbs:7, fat:0.4, fiber:3.3, vitC:65, calcium:40, iron:0.7, vitB6:0.2, vitB12:0 },
  { id:'blueberries', name:'Blueberries', category:'micro', diet:['veg','vegan'], traffic:'green', cal:57, protein:0.7, carbs:14, fat:0.3, fiber:2.4, vitC:9.7, calcium:6, iron:0.3, vitB6:0.1, vitB12:0 },
  { id:'milk_whole', name:'Whole Milk', category:'micro', diet:['veg'], traffic:'yellow', cal:61, protein:3.2, carbs:4.8, fat:3.3, fiber:0, vitC:0, calcium:113, iron:0, vitB6:0, vitB12:0.4 },
  { id:'pumpkin_seeds', name:'Pumpkin Seeds', category:'micro', diet:['veg','vegan'], traffic:'green', cal:559, protein:30, carbs:11, fat:49, fiber:6, vitC:1.9, calcium:46, iron:8.8, vitB6:0.1, vitB12:0 },
  { id:'kale', name:'Kale (Raw)', category:'micro', diet:['veg','vegan'], traffic:'green', cal:49, protein:4.3, carbs:9, fat:0.9, fiber:3.6, vitC:120, calcium:150, iron:1.5, vitB6:0.3, vitB12:0 },
  // COMMON GYM MEALS
  { id:'chicken_rice', name:'Chicken & Rice Bowl', category:'meal', diet:['non_veg'], traffic:'green', cal:295, protein:28, carbs:32, fat:5, fiber:1, vitC:0, calcium:20, iron:1, vitB6:0.5, vitB12:0.3 },
  { id:'protein_shake', name:'Protein Shake (Whey+Banana+Milk)', category:'meal', diet:['non_veg','veg'], traffic:'green', cal:280, protein:30, carbs:35, fat:4, fiber:2, vitC:5, calcium:150, iron:0.5, vitB6:0.3, vitB12:0.5 },
  { id:'oats_peanut_butter', name:'Oats with Peanut Butter', category:'meal', diet:['veg','vegan'], traffic:'green', cal:350, protein:15, carbs:45, fat:14, fiber:6, vitC:0, calcium:50, iron:3, vitB6:0.3, vitB12:0 },
  // FOODS TO AVOID / LIMIT
  { id:'chips', name:'Potato Chips', category:'avoid', diet:['veg','vegan'], traffic:'red', cal:536, protein:7, carbs:53, fat:35, fiber:4.4, vitC:24, calcium:24, iron:1.6, vitB6:0.5, vitB12:0 },
  { id:'soda', name:'Cola (Soft Drink)', category:'avoid', diet:['veg','vegan'], traffic:'red', cal:42, protein:0, carbs:11, fat:0, fiber:0, vitC:0, calcium:2, iron:0, vitB6:0, vitB12:0 },
  { id:'instant_noodles', name:'Instant Noodles', category:'avoid', diet:['veg'], traffic:'red', cal:448, protein:10, carbs:56, fat:20, fiber:2, vitC:0, calcium:20, iron:3.4, vitB6:0, vitB12:0 },
  { id:'cookies', name:'Chocolate Cookies', category:'avoid', diet:['veg'], traffic:'red', cal:488, protein:5.5, carbs:64, fat:24, fiber:3, vitC:0, calcium:26, iron:3.2, vitB6:0, vitB12:0 },
  { id:'french_fries', name:'French Fries', category:'avoid', diet:['veg','vegan'], traffic:'red', cal:312, protein:3.4, carbs:41, fat:15, fiber:3.8, vitC:9.5, calcium:12, iron:0.8, vitB6:0.3, vitB12:0 },
  { id:'candy_bar', name:'Candy Bar', category:'avoid', diet:['veg'], traffic:'red', cal:488, protein:4.3, carbs:62, fat:25, fiber:2, vitC:0.8, calcium:50, iron:1, vitB6:0, vitB12:0.2 },
  // MORE PROTEIN
  { id:'shrimp', name:'Shrimp (Cooked)', category:'protein', diet:['non_veg'], traffic:'green', cal:99, protein:24, carbs:0.2, fat:0.3, fiber:0, vitC:0, calcium:70, iron:2.4, vitB6:0.1, vitB12:1.1 },
  { id:'beef_lean', name:'Lean Beef (Sirloin)', category:'protein', diet:['non_veg'], traffic:'yellow', cal:198, protein:28, carbs:0, fat:9, fiber:0, vitC:0, calcium:18, iron:2.6, vitB6:0.6, vitB12:2.6 },
  { id:'tempeh', name:'Tempeh', category:'protein', diet:['veg','vegan'], traffic:'green', cal:192, protein:20, carbs:8, fat:11, fiber:0, vitC:0, calcium:111, iron:2.7, vitB6:0.2, vitB12:0.1 },
  { id:'dal_moong', name:'Moong Dal (Cooked)', category:'protein', diet:['veg','vegan'], traffic:'green', cal:105, protein:7, carbs:19, fat:0.4, fiber:2, vitC:1, calcium:16, iron:1.4, vitB6:0.1, vitB12:0 },
  { id:'soy_milk', name:'Soy Milk (Fortified)', category:'protein', diet:['veg','vegan'], traffic:'green', cal:54, protein:3.3, carbs:6, fat:1.8, fiber:0.6, vitC:0, calcium:25, iron:0.6, vitB6:0, vitB12:0.4 },
  // MORE CARBS/VEGGIES
  { id:'apple', name:'Apple', category:'micro', diet:['veg','vegan'], traffic:'green', cal:52, protein:0.3, carbs:14, fat:0.2, fiber:2.4, vitC:5, calcium:6, iron:0.1, vitB6:0, vitB12:0 },
  { id:'orange', name:'Orange', category:'micro', diet:['veg','vegan'], traffic:'green', cal:47, protein:0.9, carbs:12, fat:0.1, fiber:2.4, vitC:53, calcium:40, iron:0.1, vitB6:0.1, vitB12:0 },
  { id:'mixed_berries', name:'Mixed Berries', category:'micro', diet:['veg','vegan'], traffic:'green', cal:57, protein:1.2, carbs:12, fat:0.4, fiber:4, vitC:26, calcium:20, iron:0.5, vitB6:0.1, vitB12:0 },
];

export default gymFoods;

export function searchLocalFoods(query) {
  const q = query.toLowerCase();
  return gymFoods.filter(f => f.name.toLowerCase().includes(q));
}

export function getFoodsByCategory(cat) {
  return gymFoods.filter(f => f.category === cat);
}

export function getFoodsByTraffic(color) {
  return gymFoods.filter(f => f.traffic === color);
}

export function getFoodsByDiet(pref) {
  if (pref === 'non_veg') return gymFoods;
  return gymFoods.filter(f => f.diet.includes(pref));
}
