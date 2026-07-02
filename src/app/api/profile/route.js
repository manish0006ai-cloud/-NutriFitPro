import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        age: true,
        weight: true,
        height: true,
        gender: true,
        activityLevel: true,
        goal: true,
        bodyFat: true,
        targetCalories: true,
        targetProtein: true,
        targetCarbs: true,
        targetFat: true,
      }
    });

    return NextResponse.json({ profile: user });
  } catch (error) {
    console.error("Fetch profile error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const updatedUser = await prisma.user.update({
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

    return NextResponse.json({ profile: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
