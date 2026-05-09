import { NextResponse } from 'next/server';
import { NUTRIENT_MAP } from '../../../lib/constants';

const API_KEY = process.env.USDA_API_KEY || 'DEMO_KEY';
const BASE = 'https://api.nal.usda.gov/fdc/v1';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');
  if (!q) return NextResponse.json({ foods: [] });

  try {
    const res = await fetch(`${BASE}/foods/search?api_key=${API_KEY}&query=${encodeURIComponent(q)}&pageSize=10&dataType=Foundation,SR%20Legacy`);
    if (!res.ok) return NextResponse.json({ foods: [] });
    const data = await res.json();

    const foods = (data.foods || []).map(f => {
      const nutrients = {};
      (f.foodNutrients || []).forEach(n => {
        const mapped = NUTRIENT_MAP[n.nutrientId];
        if (mapped) nutrients[mapped.name] = Math.round(n.value * 10) / 10;
      });
      return {
        id: `usda_${f.fdcId}`,
        name: f.description?.length > 60 ? f.description.substring(0, 60) + '...' : f.description,
        cal: nutrients.calories || 0,
        protein: nutrients.protein || 0,
        carbs: nutrients.carbs || 0,
        fat: nutrients.fat || 0,
        fiber: nutrients.fiber || 0,
        ...nutrients,
        source: 'usda',
        fdcId: f.fdcId,
        traffic: 'green',
      };
    });

    return NextResponse.json({ foods });
  } catch (err) {
    return NextResponse.json({ foods: [], error: err.message });
  }
}
