import { NextRequest, NextResponse } from "next/server";
import { ServerApiClient } from "@/lib/server-api";
import { validateUserAccess, AuthenticationError } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const userTgId = await validateUserAccess(request);

    // Получаем рефералов пользователя
    const referralsResult = await ServerApiClient.getReferrals(userTgId);

    if (referralsResult.error) {
      return NextResponse.json(
        { error: referralsResult.error },
        { status: referralsResult.status }
      );
    }

    // Получаем платежи для подсчета реферальных бонусов
    const paymentsResult = await ServerApiClient.getPayments(userTgId);

    if (paymentsResult.error) {
      console.warn(
        "Failed to fetch payments for referral bonuses:",
        paymentsResult.error
      );
    }

    const referrals = Array.isArray(referralsResult.data)
      ? referralsResult.data
      : [];
    const payments = Array.isArray(paymentsResult.data)
      ? paymentsResult.data
      : [];

    // Подсчитываем реферальные бонусы
    const referralBonus = payments.reduce((total: number, payment: any) => {
      if (
        payment.status === "success" &&
        (payment.payment_system === "referral" ||
          payment.payment_system === "bonus" ||
          payment.payment_system === "referral_bonus" ||
          payment.payment_system?.toLowerCase().includes("referral") ||
          payment.payment_system?.toLowerCase().includes("реферал"))
      ) {
        return total + (payment.amount || 0);
      }
      return total;
    }, 0);

    // Формируем ответ
    const response = {
      referrals,
      stats: {
        invited: referrals.length,
        balance: `${Math.round(referralBonus * 100) / 100}₽`,
        totalBonus: referralBonus,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Referrals API error:", error);

    if (error instanceof AuthenticationError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch referrals" },
      { status: 500 }
    );
  }
}
