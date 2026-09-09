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
import { ClipboardList } from "lucide-react";
import type { FilingStatus } from "@/lib/tax-data";
import {
  MARYLAND_EXEMPTION_AMOUNT,
  getStateWithholdingProfile,
  getStateWithholdingTitle,
} from "@/lib/withholding";
import { formatCurrency } from "@/lib/calculator";

export interface WithholdingFormValues {
  federalFilingStatus: FilingStatus;
  twoJobs: boolean;
  dependentsCredit: string;
  otherIncome: string;
  deductions: string;
  additionalFederalAnnual: string;
  stateFilingStatus: FilingStatus;
  stateExemptions: string;
  additionalStateAnnual: string;
}

interface WithholdingCardProps {
  stateCode: string;
  values: WithholdingFormValues;
  onChange: (next: WithholdingFormValues) => void;
}

const W4_STATUSES: { value: FilingStatus; label: string }[] = [
  { value: "single", label: "Single or Married filing separately" },
  {
    value: "marriedJoint",
    label: "Married filing jointly or qualifying surviving spouse",
  },
  { value: "marriedSeparate", label: "Married filing separately" },
  { value: "headOfHousehold", label: "Head of household" },
];

const MD_STATUSES: { value: FilingStatus; label: string }[] = [
  { value: "single", label: "Single" },
  {
    value: "marriedJoint",
    label: "Married (surviving spouse or unmarried Head of Household)",
  },
  { value: "marriedSeparate", label: "Married filing separately" },
  { value: "headOfHousehold", label: "Head of household" },
];

function formatWithCommas(value: string): string {
  const raw = value.replace(/[^0-9.]/g, "");
  if (!raw) return "";
  const [intPart, decPart] = raw.split(".");
  const formatted = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return decPart !== undefined ? `${formatted}.${decPart}` : formatted;
}

function DollarField({
  id,
  label,
  value,
  onChange,
  hint,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          $
        </span>
        <Input
          id={id}
          type="text"
          inputMode="decimal"
          placeholder="0"
          value={formatWithCommas(value)}
          onChange={(e) => onChange(e.target.value.replace(/[^0-9.]/g, ""))}
          className="pl-7 tabular-nums"
          autoComplete="off"
        />
      </div>
      {hint ? (
        <p className="text-[11px] text-muted-foreground/70">{hint}</p>
      ) : null}
    </div>
  );
}

function StatusSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: FilingStatus;
  options: { value: FilingStatus; label: string }[];
  onChange: (value: FilingStatus) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className="text-sm text-muted-foreground">
        {label}
      </Label>
      <Select
        value={value}
        onValueChange={(next) => onChange(next as FilingStatus)}
      >
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}

function WithholdingSection({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-lg border border-border">
      <div className="border-b border-border bg-muted/50 px-4 py-2">
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <div className="flex flex-col gap-4 p-4">
        <p className="text-sm font-medium">{subtitle}</p>
        {children}
      </div>
    </section>
  );
}

export function WithholdingCard({
  stateCode,
  values,
  onChange,
}: WithholdingCardProps) {
  const profile = getStateWithholdingProfile(stateCode);
  const stateTitle = getStateWithholdingTitle(stateCode);

  const patch = (partial: Partial<WithholdingFormValues>) =>
    onChange({ ...values, ...partial });

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2.5 text-base font-semibold tracking-tight">
          <div className="flex size-7 items-center justify-center rounded-md bg-sky-500/10 text-sky-500">
            <ClipboardList className="size-4" />
          </div>
          Withholding settings
        </CardTitle>
        <CardDescription>
          W-4 and state certificate fields used for a paycheck-style withholding
          estimate. This is not a full IRS or payroll simulator.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <WithholdingSection
          title="Federal Section"
          subtitle="Current Federal Withholding:"
        >
          <StatusSelect
            id="w4-marital-status"
            label="Marital Status"
            value={values.federalFilingStatus}
            options={W4_STATUSES}
            onChange={(federalFilingStatus) =>
              patch({
                federalFilingStatus,
                stateFilingStatus: federalFilingStatus,
              })
            }
          />

          <fieldset className="flex flex-col gap-2">
            <legend className="text-sm text-muted-foreground">
              Step 2c (two total jobs)
            </legend>
            <ToggleGroup
              type="single"
              variant="outline"
              spacing={2}
              value={values.twoJobs ? "yes" : "no"}
              onValueChange={(value) => {
                if (value === "yes" || value === "no") {
                  patch({ twoJobs: value === "yes" });
                }
              }}
              className="grid w-full grid-cols-2"
              aria-label="Form W-4 Step 2c two total jobs"
            >
              <ToggleGroupItem value="no" className="w-full">
                No
              </ToggleGroupItem>
              <ToggleGroupItem value="yes" className="w-full">
                Yes
              </ToggleGroupItem>
            </ToggleGroup>
            <p className="text-[11px] text-muted-foreground/70">
              Yes uses the Pub 15-T Step 2 checkbox method (half the standard
              deduction), which usually withholds more.
            </p>
          </fieldset>

          <DollarField
            id="w4-step-3"
            label="Step 3 (claim dependents amt)"
            value={values.dependentsCredit}
            onChange={(dependentsCredit) => patch({ dependentsCredit })}
            hint="Annual credit from W-4 Step 3. Subtracted from estimated federal withholding."
          />
          <DollarField
            id="w4-step-4a"
            label="Step 4a (other income)"
            value={values.otherIncome}
            onChange={(otherIncome) => patch({ otherIncome })}
            hint="Annual other income from W-4 Step 4(a), added to wages before withholding."
          />
          <DollarField
            id="w4-step-4b"
            label="Step 4b (deductions)"
            value={values.deductions}
            onChange={(deductions) => patch({ deductions })}
            hint="Annual deductions from W-4 Step 4(b), on top of the standard deduction."
          />
          <DollarField
            id="w4-additional"
            label="Additional Amt Withheld"
            value={values.additionalFederalAnnual}
            onChange={(additionalFederalAnnual) =>
              patch({ additionalFederalAnnual })
            }
            hint="Extra federal withholding per year (W-4 Step 4c, annualized)."
          />
        </WithholdingSection>

        <WithholdingSection title="State Section" subtitle={`${stateTitle}:`}>
          {profile === "none" && stateCode ? (
            <p className="text-sm text-muted-foreground">
              {stateTitle.replace("Current ", "").replace(" Withholding", "")}{" "}
              has no state income tax. State withholding is $0.
            </p>
          ) : null}

          {!stateCode ? (
            <p className="text-sm text-muted-foreground">
              Select a state to see state withholding options.
            </p>
          ) : null}

          {profile === "exemptions" ? (
            <>
              <StatusSelect
                id="state-marital-status"
                label="Marital Status"
                value={values.stateFilingStatus}
                options={MD_STATUSES}
                onChange={(stateFilingStatus) => patch({ stateFilingStatus })}
              />
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="state-exemptions"
                  className="text-sm text-muted-foreground"
                >
                  Number of exemptions
                </Label>
                <Input
                  id="state-exemptions"
                  type="text"
                  inputMode="numeric"
                  placeholder="0"
                  value={values.stateExemptions}
                  onChange={(e) =>
                    patch({
                      stateExemptions: e.target.value.replace(/[^0-9]/g, ""),
                    })
                  }
                  className="tabular-nums"
                  autoComplete="off"
                />
                <p className="text-[11px] text-muted-foreground/70">
                  Maryland MW507: each exemption reduces taxable wages by{" "}
                  {formatCurrency(MARYLAND_EXEMPTION_AMOUNT, 0)} (Comptroller of
                  Maryland, 2026 withholding facts). Phaseouts above $100,000
                  MAGI are not modeled.
                </p>
              </div>
              <DollarField
                id="state-additional"
                label="Additional Amt Withheld"
                value={values.additionalStateAnnual}
                onChange={(additionalStateAnnual) =>
                  patch({ additionalStateAnnual })
                }
                hint="Extra state withholding per year."
              />
            </>
          ) : null}

          {profile === "additional" ? (
            <>
              <StatusSelect
                id="state-marital-status"
                label="Marital Status"
                value={values.stateFilingStatus}
                options={W4_STATUSES}
                onChange={(stateFilingStatus) => patch({ stateFilingStatus })}
              />
              <DollarField
                id="state-additional"
                label="Additional Amt Withheld"
                value={values.additionalStateAnnual}
                onChange={(additionalStateAnnual) =>
                  patch({ additionalStateAnnual })
                }
                hint="Extra state withholding per year. This state is not modeled with Maryland-style exemptions."
              />
            </>
          ) : null}
        </WithholdingSection>
      </CardContent>
    </Card>
  );
}
