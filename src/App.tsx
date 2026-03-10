import { useState, useCallback } from "react";
import { CreatorBanner } from "@/components/creator-banner";
import { VAInfoCard } from "@/components/va-info-card";
import { IncomeCard } from "@/components/income-card";
import { ResultsCard } from "@/components/results-card";
import { DisclaimerFooter } from "@/components/disclaimer-footer";
import {
  calculateVACompensation,
  calculateRequiredSalary,
  checkRateLimit,
  validateInputs,
  type CalculationResult,
} from "@/lib/calculator";
import type { FilingStatus } from "@/lib/tax-data";

export default function App() {
  // VA Info state
  const [vaRating, setVaRating] = useState("0");
  const [dependents, setDependents] = useState("0");
  const [hasSpouse, setHasSpouse] = useState(false);
  const [hasDependentParent, setHasDependentParent] = useState(false);

  // Income state
  const [desiredIncome, setDesiredIncome] = useState("");
  const [payPeriod, setPayPeriod] = useState("monthly");
  const [stateCode, setStateCode] = useState("");
  const [filingStatus, setFilingStatus] = useState("single");
  const [localityName, setLocalityName] = useState("");

  // Results state
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [vaMonthlyComp, setVaMonthlyComp] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Reset spouse/parent when rating drops below threshold
  const handleVaRatingChange = useCallback((value: string) => {
    setVaRating(value);
    const num = parseInt(value);
    if (num < 30) {
      setHasSpouse(false);
      setHasDependentParent(false);
    }
    if (num < 100) {
      setHasDependentParent(false);
    }
  }, []);

  // Reset locality when state changes
  const handleStateCodeChange = useCallback((value: string) => {
    setStateCode(value);
    setLocalityName("");
  }, []);

  const handleCalculate = useCallback(() => {
    setIsCalculating(true);
    setError(null);

    setTimeout(() => {
      try {
        checkRateLimit();

        const income = parseFloat(desiredIncome) || 0;
        validateInputs(income, stateCode);

        const annualIncome =
          payPeriod === "monthly" ? income * 12 : income;

        const rating = parseInt(vaRating);
        const deps = parseInt(dependents);
        const parentEligible = rating === 100 && hasDependentParent;

        const vaComp = calculateVACompensation(
          rating,
          deps,
          hasSpouse,
          parentEligible
        );
        setVaMonthlyComp(vaComp);

        const calcResult = calculateRequiredSalary(
          annualIncome,
          vaComp,
          stateCode,
          filingStatus as FilingStatus,
          localityName
        );
        setResult(calcResult);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
        setResult(null);
      } finally {
        setIsCalculating(false);
      }
    }, 10);
  }, [
    desiredIncome,
    payPeriod,
    vaRating,
    dependents,
    hasSpouse,
    hasDependentParent,
    stateCode,
    filingStatus,
    localityName,
  ]);

  return (
    <div className="min-h-screen bg-background">
      <CreatorBanner />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <header className="text-center mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            VA Disability & Salary Calculator
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
            Calculate the gross salary needed to achieve your desired take-home
            pay, factoring in tax-free VA disability compensation.
          </p>
        </header>

        {/* Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column — Inputs */}
          <div className="space-y-6">
            <VAInfoCard
              vaRating={vaRating}
              dependents={dependents}
              hasSpouse={hasSpouse}
              hasDependentParent={hasDependentParent}
              onVaRatingChange={handleVaRatingChange}
              onDependentsChange={setDependents}
              onHasSpouseChange={setHasSpouse}
              onHasDependentParentChange={setHasDependentParent}
            />
            <IncomeCard
              desiredIncome={desiredIncome}
              payPeriod={payPeriod}
              stateCode={stateCode}
              filingStatus={filingStatus}
              localityName={localityName}
              onDesiredIncomeChange={setDesiredIncome}
              onPayPeriodChange={setPayPeriod}
              onStateCodeChange={handleStateCodeChange}
              onFilingStatusChange={setFilingStatus}
              onLocalityChange={setLocalityName}
              onCalculate={handleCalculate}
              isCalculating={isCalculating}
            />
          </div>

          {/* Right Column — Results */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <ResultsCard
              result={result}
              vaMonthlyCompensation={vaMonthlyComp}
              error={error}
            />
          </div>
        </div>

        <DisclaimerFooter />
      </main>
    </div>
  );
}
