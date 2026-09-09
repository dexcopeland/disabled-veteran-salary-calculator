import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Receipt, TrendingUp } from "lucide-react";
import {
  formatCurrency,
  type CalculationMode,
  type CalculationResult,
} from "@/lib/calculator";
import { cn } from "@/lib/utils";

interface ResultsCardProps {
  result: CalculationResult | null;
  vaMonthlyCompensation: number;
  error: string | null;
  mode: CalculationMode;
}

function ResultRow({
  label,
  value,
  detail,
  highlight = false,
  muted = false,
}: {
  label: string;
  value: string;
  detail?: string;
  highlight?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 py-2.5",
        highlight && "bg-primary/5 -mx-4 rounded-lg px-4"
      )}
    >
      <div className="min-w-0">
        <span
          className={cn(
            "text-sm",
            muted ? "text-muted-foreground/70" : "text-muted-foreground"
          )}
        >
          {label}
        </span>
        {detail ? (
          <p className="text-[11px] text-muted-foreground/60">{detail}</p>
        ) : null}
      </div>
      <span
        className={cn(
          "shrink-0 font-mono text-sm font-semibold tabular-nums",
          highlight ? "text-base text-emerald-400" : "text-foreground"
        )}
      >
        {value}
      </span>
    </div>
  );
}

function withholdingDetail(
  annualAmount: number,
  grossSalary: number,
  extra?: string
): string {
  const monthly = `${formatCurrency(annualAmount / 12, 2)}/mo`;
  const share =
    grossSalary > 0
      ? `${((annualAmount / grossSalary) * 100).toFixed(1)}% of salary`
      : null;
  return [monthly, share, extra].filter(Boolean).join(" · ");
}

export function ResultsCard({
  result,
  vaMonthlyCompensation,
  error,
  mode,
}: ResultsCardProps) {
  if (error) {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="pt-6">
          <p className="text-center text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-muted/50">
              <Receipt className="size-5 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground/70">
              Enter your information and click{" "}
              <span className="font-medium text-muted-foreground">
                {mode === "knownSalary"
                  ? "Estimate take-home"
                  : "Calculate required salary"}
              </span>{" "}
              to see federal and state withholding
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const isKnownSalary = result.mode === "knownSalary";
  const localLabel = result.localTaxName
    ? `${result.localTaxName} tax`
    : "Local tax";
  const stateDetail = !result.hasStateIncomeTax
    ? "No state income tax"
    : withholdingDetail(result.stateTax, result.grossSalary);

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2.5 text-base font-semibold tracking-tight">
          <div className="flex size-7 items-center justify-center rounded-md bg-blue-500/10 text-blue-500">
            <TrendingUp className="size-4" />
          </div>
          {isKnownSalary ? "Estimated take-home" : "Required salary"}
        </CardTitle>
        <CardDescription>
          {isKnownSalary
            ? "What this salary plus tax-free VA compensation could take home after estimated taxes."
            : "The gross salary that, after estimated taxes plus VA compensation, reaches your target."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {isKnownSalary ? (
          <>
            <ResultRow
              label="Annual salary / offer"
              value={formatCurrency(result.grossSalary, 0)}
            />
            <ResultRow
              label="Estimated annual take-home"
              value={formatCurrency(result.totalAnnualTakeHome, 0)}
              highlight
            />
            <ResultRow
              label="Estimated monthly take-home"
              value={formatCurrency(result.totalMonthlyTakeHome, 2)}
              highlight
            />
          </>
        ) : (
          <>
            <ResultRow
              label="Required annual gross salary"
              value={formatCurrency(result.grossSalary, 0)}
              highlight
            />
            <ResultRow
              label="Hourly rate (2,080 hrs/yr)"
              value={formatCurrency(result.grossSalary / 2080, 2)}
            />
            <ResultRow
              label="Estimated monthly take-home"
              value={formatCurrency(result.totalMonthlyTakeHome, 2)}
              highlight
            />
          </>
        )}

        <Separator className="my-3" />

        <div className="mb-1 flex items-center justify-between gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
            Estimated withholding
          </h3>
          {result.location && result.location !== "No state selected" && (
            <div className="flex flex-wrap items-center justify-end gap-1.5">
              <Badge variant="secondary" className="text-[10px] font-normal">
                {result.location}
              </Badge>
              {result.localTaxName && result.localTaxName !== "Other / None" && (
                <Badge variant="outline" className="text-[10px] font-normal">
                  {result.localTaxName}
                </Badge>
              )}
            </div>
          )}
        </div>
        <p className="mb-1 text-[11px] leading-relaxed text-muted-foreground/70">
          Annual tax liability this calculator expects to be withheld — not a
          W-4 or paycheck simulator. Actual withholding can differ.
        </p>
        <ResultRow
          label="Federal income tax"
          value={formatCurrency(result.federalTax, 0)}
          detail={withholdingDetail(result.federalTax, result.grossSalary)}
        />
        <ResultRow
          label="State income tax"
          value={formatCurrency(result.stateTax, 0)}
          detail={stateDetail}
        />
        {(result.localTax > 0 ||
          (result.localTaxName && result.localTaxName !== "Other / None")) && (
          <ResultRow
            label={localLabel}
            value={formatCurrency(result.localTax, 0)}
            detail={withholdingDetail(result.localTax, result.grossSalary)}
          />
        )}
        <ResultRow
          label="Social Security"
          value={formatCurrency(result.socialSecurityTax, 0)}
          detail={withholdingDetail(
            result.socialSecurityTax,
            result.grossSalary,
            "FICA"
          )}
        />
        <ResultRow
          label="Medicare"
          value={formatCurrency(result.medicareTax, 0)}
          detail={withholdingDetail(
            result.medicareTax,
            result.grossSalary,
            "FICA"
          )}
        />
        <ResultRow
          label="Total estimated withholding"
          value={formatCurrency(result.totalTaxes, 0)}
          detail={withholdingDetail(result.totalTaxes, result.grossSalary)}
        />

        <Separator className="my-3" />

        <div className="mb-1 flex items-center gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
            How take-home adds up
          </h3>
        </div>
        <ResultRow
          label="Net from job (after tax)"
          value={formatCurrency(result.netSalary, 0)}
          detail={`${formatCurrency(result.netSalary / 12, 2)}/mo`}
        />
        <ResultRow
          label="VA disability compensation"
          value={formatCurrency(result.vaCompensation, 0)}
          detail={`${formatCurrency(vaMonthlyCompensation, 2)}/mo · tax-free`}
        />
        <ResultRow
          label="Total annual take-home"
          value={formatCurrency(result.totalAnnualTakeHome, 0)}
          highlight
        />
      </CardContent>
    </Card>
  );
}
