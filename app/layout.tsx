import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClearLedger Pro — South African Personal Finance",
  description: "Budget, invest, pay tax, and track your net worth. Built for South African salaries — SARS ITR12, TFSA, UIF, stokvel, and ZAR-native.",
  keywords: "South Africa personal finance, SARS tax estimator, TFSA tracker, budget app, ZAR, ITR12",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
