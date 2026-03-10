import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { DollarSign, Calculator, MapPin } from "lucide-react";
import { stateOptions, taxRates, localTaxOptions } from "@/lib/tax-data";

interface IncomeCardProps {
  desiredIncome: string;
  payPeriod: string;
  stateCode: string;
  filingStatus: string;
  localityName: string;
  onDesiredIncomeChange: (value: string) => void;
  onPayPeriodChange: (value: string) => void;
  onStateCodeChange: (value: string) => void;
  onFilingStatusChange: (value: string) => void;
  onLocalityChange: (value: string) => void;
  onCalculate: () => void;
  isCalculating: boolean;
}

export function IncomeCard({
  desiredIncome,
  payPeriod,
  stateCode,
  filingStatus,
  localityName,
  onDesiredIncomeChange,
  onPayPeriodChange,
  onStateCodeChange,
  onFilingStatusChange,
  onLocalityChange,
  onCalculate,
  isCalculating,
}: IncomeCardProps) {
  const hasLocalTax = stateCode && taxRates[stateCode]?.hasLocalTax;
  const localities = stateCode ? localTaxOptions[stateCode] || [] : [];

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2.5 text-base font-semibold tracking-tight">
          <div className="flex items-center justify-center h-7 w-7 rounded-md bg-emerald-500/10 text-emerald-500">
            <DollarSign className="h-4 w-4" />
          </div>
          Income Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label
            htmlFor="desired-income"
            className="text-sm text-muted-foreground"
          >
            Desired Take-Home Pay
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
              $
            </span>
            <Input
              id="desired-income"
              type="number"
              min="0"
              max="100000000"
              step="100"
              placeholder="5,000"
              value={desiredIncome}
              onChange={(e) => onDesiredIncomeChange(e.target.value)}
              className="pl-7 tabular-nums"
              autoComplete="off"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pay-period" className="text-sm text-muted-foreground">
            Pay Period
          </Label>
          <Select value={payPeriod} onValueChange={onPayPeriodChange}>
            <SelectTrigger id="pay-period" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
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
              {stateOptions.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Locality selector — only shown for states with local taxes */}
        {hasLocalTax && localities.length > 0 && (
          <div className="space-y-2">
            <Label
              htmlFor="locality-select"
              className="text-sm text-muted-foreground flex items-center gap-1.5"
            >
              <MapPin className="h-3 w-3" />
              City / County
            </Label>
            <Select value={localityName} onValueChange={onLocalityChange}>
              <SelectTrigger id="locality-select" className="w-full">
                <SelectValue placeholder="Select locality (optional)" />
              </SelectTrigger>
              <SelectContent>
                {localities.map((loc) => (
                  <SelectItem key={loc.name} value={loc.name}>
                    {loc.name}
                    {loc.rate > 0 && (
                      <span className="text-muted-foreground ml-1">
                        ({(loc.rate * 100).toFixed(2)}%)
                      </span>
                    )}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-muted-foreground/60">
              Select your city/county for more accurate local tax estimates
            </p>
          </div>
        )}

        <div className="space-y-2">
          <Label
            htmlFor="filing-status"
            className="text-sm text-muted-foreground"
          >
            Filing Status
          </Label>
          <Select value={filingStatus} onValueChange={onFilingStatusChange}>
            <SelectTrigger id="filing-status" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single</SelectItem>
              <SelectItem value="marriedJoint">
                Married Filing Jointly
              </SelectItem>
              <SelectItem value="marriedSeparate">
                Married Filing Separately
              </SelectItem>
              <SelectItem value="headOfHousehold">
                Head of Household
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          onClick={onCalculate}
          disabled={isCalculating}
          className="w-full mt-2 cursor-pointer"
          size="lg"
        >
          <Calculator className="h-4 w-4 mr-2" />
          {isCalculating ? "Calculating..." : "Calculate"}
        </Button>
      </CardContent>
    </Card>
  );
}
