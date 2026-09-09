import { useState, useCallback } from "react";
import { CreatorBanner } from "@/components/creator-banner";
import { VAInfoCard } from "@/components/va-info-card";
import { IncomeCard } from "@/components/income-card";
import { WithholdingCard, type WithholdingFormValues } from "@/components/withholding-card";
import { ResultsCard } from "@/components/results-card";
import { DisclaimerFooter } from "@/components/disclaimer-footer";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import {
  calculateVACompensation,
  calculateRequiredSalary,
  calculateTakeHomeFromSalary,
  checkRateLimit,
  validateInputs,
  defaultWithholdingSettings,
  type CalculationMode,
  type CalculationResult,
  type WithholdingSettings,
} from "@/lib/calculator";
import type { FilingStatus } from "@/lib/tax-data";

function headerCopy(mode: CalculationMode): { title: string; subtitle: string } {
  switch (mode) {
    case "knownSalary":
      return {
        title: "VA Disability & Salary Calculator",
        subtitle:
          "Enter a job or offer salary and W-4 / state withholding settings to estimate take-home pay — plus tax-free VA disability.",
      };
    case "targetTakeHome":
      return {
        title: "VA Disability & Salary Calculator",
        subtitle:
          "Calculate the gross salary needed to reach a target take-home, using paycheck-style withholding plus tax-free VA disability.",
      };
    default: {
      const _exhaustive: never = mode;
      throw new Error(`Unhandled calculation mode: ${_exhaustive}`);
    }
  }
}

function emptyWithholdingForm(
  filingStatus: FilingStatus = "single"
): WithholdingFormValues {
  return {
    federalFilingStatus: filingStatus,
    twoJobs: false,
    dependentsCredit: "0",
    otherIncome: "0",
    deductions: "0",
    additionalFederalAnnual: "0",
    stateFilingStatus: filingStatus,
    stateExemptions: "0",
    additionalStateAnnual: "0",
  };
}

function parseAmount(value: string): number {
  const parsed = parseFloat(value.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function toWithholdingSettings(
  form: WithholdingFormValues
): WithholdingSettings {
  return {
    ...defaultWithholdingSettings(form.federalFilingStatus),
    federalFilingStatus: form.federalFilingStatus,
    twoJobs: form.twoJobs,
    dependentsCredit: Math.max(0, parseAmount(form.dependentsCredit)),
    otherIncome: Math.max(0, parseAmount(form.otherIncome)),
    deductions: Math.max(0, parseAmount(form.deductions)),
    additionalFederalAnnual: Math.max(
      0,
      parseAmount(form.additionalFederalAnnual)
    ),
    stateFilingStatus: form.stateFilingStatus,
    stateExemptions: Math.max(0, parseInt(form.stateExemptions, 10) || 0),
    additionalStateAnnual: Math.max(0, parseAmount(form.additionalStateAnnual)),
  };
}

export default function App() {
  const [vaRating, setVaRating] = useState("0");
  const [dependents, setDependents] = useState("0");
  const [hasSpouse, setHasSpouse] = useState(false);
  const [hasDependentParent, setHasDependentParent] = useState(false);

  const [mode, setMode] = useState<CalculationMode>("targetTakeHome");
  const [desiredIncome, setDesiredIncome] = useState("");
  const [payPeriod, setPayPeriod] = useState("monthly");
  const [stateCode, setStateCode] = useState("");
  const [localityName, setLocalityName] = useState("");
  const [withholdingForm, setWithholdingForm] = useState<WithholdingFormValues>(
    emptyWithholdingForm()
  );

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [vaMonthlyComp, setVaMonthlyComp] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

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

  const handleStateCodeChange = useCallback((value: string) => {
    setStateCode(value);
    setLocalityName("");
  }, []);

  const handleModeChange = useCallback((nextMode: CalculationMode) => {
    setMode(nextMode);
    setDesiredIncome("");
    setResult(null);
    setError(null);
    setPayPeriod(nextMode === "knownSalary" ? "yearly" : "monthly");
  }, []);

  const handleCalculate = useCallback(() => {
    setIsCalculating(true);
    setError(null);

    setTimeout(() => {
      try {
        checkRateLimit();

        const income = parseFloat(desiredIncome) || 0;
        validateInputs(income, stateCode, mode);

        const annualIncome = payPeriod === "monthly" ? income * 12 : income;
        const withholding = toWithholdingSettings(withholdingForm);
        const filingStatus = withholding.federalFilingStatus;

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

        let calcResult: CalculationResult;
        switch (mode) {
          case "knownSalary":
            calcResult = calculateTakeHomeFromSalary(
              annualIncome,
              vaComp,
              stateCode,
              filingStatus,
              localityName,
              withholding
            );
            break;
          case "targetTakeHome":
            calcResult = calculateRequiredSalary(
              annualIncome,
              vaComp,
              stateCode,
              filingStatus,
              localityName,
              withholding
            );
            break;
          default: {
            const _exhaustive: never = mode;
            throw new Error(`Unhandled calculation mode: ${_exhaustive}`);
          }
        }
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
    localityName,
    mode,
    withholdingForm,
  ]);

  const copy = headerCopy(mode);

  return (
    <div className="min-h-screen bg-background">
      <CreatorBanner />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {copy.title}
          </h1>
          <p className="mx-auto mt-2.5 max-w-xl text-sm text-muted-foreground sm:text-base">
            {copy.subtitle}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-6">
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
              mode={mode}
              desiredIncome={desiredIncome}
              payPeriod={payPeriod}
              stateCode={stateCode}
              localityName={localityName}
              onModeChange={handleModeChange}
              onDesiredIncomeChange={setDesiredIncome}
              onPayPeriodChange={setPayPeriod}
              onStateCodeChange={handleStateCodeChange}
              onLocalityChange={setLocalityName}
            />
            <WithholdingCard
              stateCode={stateCode}
              values={withholdingForm}
              onChange={setWithholdingForm}
            />
            <Button
              onClick={handleCalculate}
              disabled={isCalculating}
              className="w-full cursor-pointer"
              size="lg"
            >
              <Calculator data-icon="inline-start" />
              {isCalculating
                ? "Calculating..."
                : mode === "knownSalary"
                  ? "Estimate take-home"
                  : "Calculate required salary"}
            </Button>
          </div>

          <div className="lg:sticky lg:top-6 lg:self-start">
            <ResultsCard
              result={result}
              vaMonthlyCompensation={vaMonthlyComp}
              error={error}
              mode={mode}
            />
          </div>
        </div>

        <DisclaimerFooter />
      </main>
    </div>
  );
}
