import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Receipt } from "lucide-react";
import { formatCurrency, type CalculationResult } from "@/lib/calculator";

interface ResultsCardProps {
  result: CalculationResult | null;
  vaMonthlyCompensation: number;
  error: string | null;
}

function ResultRow({
  label,
  value,
  highlight = false,
  muted = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between py-2.5 ${
        highlight
          ? "bg-primary/5 -mx-4 px-4 rounded-lg"
          : ""
      }`}
    >
      <span
        className={`text-sm ${
          muted ? "text-muted-foreground/70" : "text-muted-foreground"
        }`}
      >
        {label}
      </span>
      <span
        className={`font-mono text-sm font-semibold tabular-nums ${
          highlight ? "text-emerald-400 text-base" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}

export function ResultsCard({
  result,
  vaMonthlyCompensation,
  error,
}: ResultsCardProps) {
  if (error) {
    return (
      <Card className="border-destructive/30 bg-destructive/5">
        <CardContent className="pt-6">
          <p className="text-sm text-destructive text-center">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Receipt className="h-5 w-5 text-muted-foreground/50" />
            </div>
            <p className="text-sm text-muted-foreground/70">
              Enter your information and click{" "}
              <span className="font-medium text-muted-foreground">Calculate</span>{" "}
              to see your results
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2.5 text-base font-semibold tracking-tight">
          <div className="flex items-center justify-center h-7 w-7 rounded-md bg-blue-500/10 text-blue-500">
            <TrendingUp className="h-4 w-4" />
          </div>
          Results
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {/* Primary Results */}
        <ResultRow
          label="Required Annual Gross Salary"
          value={formatCurrency(result.grossSalary, 0)}
          highlight
        />
        <ResultRow
          label="Hourly Rate (2,080 hrs/yr)"
          value={formatCurrency(result.grossSalary / 2080, 2)}
        />

        <Separator className="my-3" />

        {/* Monthly Breakdown */}
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
            Monthly Breakdown
          </h3>
        </div>
        <ResultRow
          label="VA Disability Compensation"
          value={formatCurrency(vaMonthlyCompensation, 2)}
        />
        <ResultRow
          label="Net Salary After Taxes"
          value={formatCurrency(result.netSalary / 12, 2)}
        />
        <ResultRow
          label="Total Monthly Take-Home"
          value={formatCurrency(result.totalMonthlyTakeHome, 2)}
          highlight
        />

        <Separator className="my-3" />

        {/* Tax Breakdown */}
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
            Tax Breakdown (Annual)
          </h3>
          {result.location && result.location !== "No state selected" && (
            <div className="flex items-center gap-1.5 flex-wrap">
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
        <ResultRow
          label="Federal Tax"
          value={formatCurrency(result.federalTax, 0)}
        />
        <ResultRow
          label="State Tax"
          value={formatCurrency(result.stateTax, 0)}
        />
        {result.localTax > 0 && (
          <ResultRow
            label={result.localTaxName ? `${result.localTaxName} Tax` : "Local Tax"}
            value={formatCurrency(result.localTax, 0)}
          />
        )}
        <ResultRow
          label="FICA / Medicare"
          value={formatCurrency(result.ficaTax, 0)}
        />
        <ResultRow
          label="Total Taxes"
          value={formatCurrency(result.totalTaxes, 0)}
        />
      </CardContent>
    </Card>
  );
}
