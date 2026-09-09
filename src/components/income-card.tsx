import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DollarSign, MapPin } from "lucide-react";
import { stateOptions, taxRates, localTaxOptions } from "@/lib/tax-data";
import type { CalculationMode } from "@/lib/calculator";

interface IncomeCardProps {
  mode: CalculationMode;
  desiredIncome: string;
  payPeriod: string;
  stateCode: string;
  localityName: string;
  onModeChange: (value: CalculationMode) => void;
  onDesiredIncomeChange: (value: string) => void;
  onPayPeriodChange: (value: string) => void;
  onStateCodeChange: (value: string) => void;
  onLocalityChange: (value: string) => void;
}

function isCalculationMode(value: string): value is CalculationMode {
  return value === "targetTakeHome" || value === "knownSalary";
}

export function IncomeCard({
  mode,
  desiredIncome,
  payPeriod,
  stateCode,
  localityName,
  onModeChange,
  onDesiredIncomeChange,
  onPayPeriodChange,
  onStateCodeChange,
  onLocalityChange,
}: IncomeCardProps) {
  const hasLocalTax = stateCode && taxRates[stateCode]?.hasLocalTax;
  const localities = stateCode ? localTaxOptions[stateCode] || [] : [];
  const isKnownSalary = mode === "knownSalary";

  const formatWithCommas = (value: string): string => {
    const raw = value.replace(/[^0-9.]/g, "");
    if (!raw) return "";
    const [intPart, decPart] = raw.split(".");
    const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decPart !== undefined ? `${formatted}.${decPart}` : formatted;
  };

  const displayValue = formatWithCommas(desiredIncome);

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    onDesiredIncomeChange(raw);
  };

  const amountLabel = isKnownSalary
    ? payPeriod === "yearly"
      ? "Annual salary / offer"
      : "Salary / offer"
    : "Desired take-home pay";

  const amountPlaceholder = isKnownSalary
    ? payPeriod === "yearly"
      ? "75,000"
      : "6,250"
    : payPeriod === "yearly"
      ? "60,000"
      : "5,000";

  const amountHelp = isKnownSalary
    ? "Enter the job or offer amount. VA disability is tax-free and added after estimated taxes."
    : "The take-home you want, including tax-free VA disability compensation.";

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2.5 text-base font-semibold tracking-tight">
          <div className="flex size-7 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-500">
            <DollarSign className="size-4" />
          </div>
          Income Information
        </CardTitle>
        <CardDescription>
          Choose whether you know a target take-home or a salary / offer.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <fieldset className="flex flex-col gap-2">
          <legend className="text-sm text-muted-foreground">
            What do you know?
          </legend>
          <ToggleGroup
            type="single"
            variant="outline"
            spacing={2}
            value={mode}
            onValueChange={(value) => {
              if (isCalculationMode(value)) {
                onModeChange(value);
              }
            }}
            className="grid w-full grid-cols-1 sm:grid-cols-2"
            aria-label="Calculation mode"
          >
            <ToggleGroupItem
              value="targetTakeHome"
              aria-label="I know my target take-home"
              className="h-auto min-h-9 w-full whitespace-normal px-3 py-2 text-left"
            >
              I know my target take-home
            </ToggleGroupItem>
            <ToggleGroupItem
              value="knownSalary"
              aria-label="I know my salary or offer"
              className="h-auto min-h-9 w-full whitespace-normal px-3 py-2 text-left"
            >
              I know my salary / offer
            </ToggleGroupItem>
          </ToggleGroup>
        </fieldset>

        <div className="flex flex-col gap-2">
          <Label
            htmlFor="income-amount"
            className="text-sm text-muted-foreground"
          >
            {amountLabel}
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              $
            </span>
            <Input
              id="income-amount"
              type="text"
              inputMode="decimal"
              placeholder={amountPlaceholder}
              value={displayValue}
              onChange={handleIncomeChange}
              className="pl-7 tabular-nums"
              autoComplete="off"
            />
          </div>
          <p className="text-[11px] text-muted-foreground/70">{amountHelp}</p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="pay-period" className="text-sm text-muted-foreground">
            Pay period
          </Label>
          <Select value={payPeriod} onValueChange={onPayPeriodChange}>
            <SelectTrigger id="pay-period" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Label
            htmlFor="state-select"
            className="text-sm text-muted-foreground"
          >
            State / Territory
          </Label>
          <Select value={stateCode} onValueChange={onStateCodeChange}>
            <SelectTrigger id="state-select" className="w-full">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {stateOptions.map((s) => (
                  <SelectItem key={s.value} value={s.value}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {hasLocalTax && localities.length > 0 && (
          <div className="flex flex-col gap-2">
            <Label
              htmlFor="locality-select"
              className="flex items-center gap-1.5 text-sm text-muted-foreground"
            >
              <MapPin className="size-3" />
              City / County
            </Label>
            <Select value={localityName} onValueChange={onLocalityChange}>
              <SelectTrigger id="locality-select" className="w-full">
                <SelectValue placeholder="Select locality (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {localities.map((loc) => (
                    <SelectItem key={loc.name} value={loc.name}>
                      {loc.name}
                      {loc.rate > 0 && (
                        <span className="ml-1 text-muted-foreground">
                          ({(loc.rate * 100).toFixed(2)}%)
                        </span>
                      )}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground/60">
              Select your city/county for more accurate local tax estimates
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
