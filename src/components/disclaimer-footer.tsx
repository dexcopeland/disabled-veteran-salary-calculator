import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";

export function DisclaimerFooter() {
  return (
    <footer className="mt-8 pb-8">
      <Alert variant="destructive" className="bg-destructive/5 border-destructive/20">
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle className="text-sm font-semibold">Disclaimer</AlertTitle>
        <AlertDescription className="text-xs leading-relaxed mt-1">
          This calculator provides estimates only. It is not a W-2, a full IRS
          W-4 / state MW507 simulator, or a payroll system, and it should not
          replace a tax professional. Federal and state figures are a
          paycheck-style withholding estimate from the fields you enter and this
          app's tax tables. Actual paystubs can differ (pre-tax deductions,
          credits, extra withholding elections, and employer methods). VA
          compensation rates are based on 2026 published rates and are subject
          to change. State and local tax calculations are estimates and may not
          reflect all local jurisdictions.
        </AlertDescription>
      </Alert>
    </footer>
  );
}
