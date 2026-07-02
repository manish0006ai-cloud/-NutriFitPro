import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, data } = await req.json();

    if (type === 'profile') {
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          age: data.age,
          weight: data.weight,
          height: data.height,
          gender: data.gender,
          activityLevel: data.activityLevel,
          goal: data.goal,
          bodyFat: data.bodyFat,
          targetCalories: data.targetCalories,
          targetProtein: data.targetProtein,
          targetCarbs: data.targetCarbs,
          targetFat: data.targetFat,
        }
      });
    } else if (type === 'log') {
      await prisma.dayLog.upsert({
        where: {
          userId_date: {
            userId: session.user.id,
            date: data.date
          }
        },
        update: {
          meals: JSON.stringify(data.meals),
          totals: JSON.stringify(data.totals),
          water: data.water,
          supplements: JSON.stringify(data.supplements)
        },
        create: {
          userId: session.user.id,
          date: data.date,
          meals: JSON.stringify(data.meals),
          totals: JSON.stringify(data.totals),
          water: data.water,
          supplements: JSON.stringify(data.supplements)
        }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
