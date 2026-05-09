import { getFoodsByDiet } from './foodDatabase';

// Generate a 7-day meal plan to meet calorie/macro targets
export function generateMealPlan(targets, diet = 'non_veg', budget = false) {
  const foods = getFoodsByDiet(diet).filter(f => f.traffic !== 'red');
  const highProtein = foods.filter(f => f.protein >= 10).sort((a,b) => b.protein - a.protein);
  const carbSources = foods.filter(f => f.carbs >= 15 && f.category !== 'avoid');
  const fatSources = foods.filter(f => f.fat >= 5 && f.category !== 'avoid');
  const veggies = foods.filter(f => f.category === 'micro');
  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

  function pick(arr, n) {
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(n, shuffled.length));
  }

  function buildMeal(proteinG, carbG, targetCal) {
    const items = [];
    const p = pick(highProtein, 1)[0];
    if (p) { const qty = Math.round((proteinG / p.protein) * 100); items.push({ ...p, quantity: qty, unit: 'g' }); }
    const c = pick(carbSources, 1)[0];
    if (c) { const qty = Math.round((carbG / (c.carbs || 1)) * 100); items.push({ ...c, quantity: Math.min(qty, 300), unit: 'g' }); }
    const v = pick(veggies, 1)[0];
    if (v) items.push({ ...v, quantity: 100, unit: 'g' });
    return items;
  }

  const plan = days.map(day => {
    const bfast = buildMeal(targets.protein * 0.2, targets.carbs * 0.25, targets.calories * 0.25);
    const lunch = buildMeal(targets.protein * 0.3, targets.carbs * 0.3, targets.calories * 0.3);
    const dinner = buildMeal(targets.protein * 0.25, targets.carbs * 0.2, targets.calories * 0.25);
    const snacks = pick(foods.filter(f => f.cal < 200), 2).map(f => ({ ...f, quantity: 50, unit: 'g' }));
    return { day, breakfast: bfast, lunch, dinner, snacks };
  });

  return { weekOf: new Date().toISOString().split('T')[0], preference: diet, days: plan };
}

// Generate shopping list from meal plan
export function generateShoppingList(plan) {
  const list = {};
  plan.days.forEach(day => {
    ['breakfast','lunch','dinner','snacks'].forEach(meal => {
      (day[meal] || []).forEach(item => {
        if (list[item.id]) { list[item.id].quantity += item.quantity; }
        else { list[item.id] = { name: item.name, quantity: item.quantity, unit: item.unit }; }
      });
    });
  });
  return Object.values(list).sort((a, b) => a.name.localeCompare(b.name));
}
