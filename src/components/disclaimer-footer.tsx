import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { TriangleAlert } from "lucide-react";

export function DisclaimerFooter() {
  return (
    <footer className="mt-8 pb-8">
      <Alert variant="destructive" className="bg-destructive/5 border-destructive/20">
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle className="text-sm font-semibold">Disclaimer</AlertTitle>
        <AlertDescription className="text-xs leading-relaxed mt-1">
          This calculator provides estimates only and should not be used for
          financial planning without consulting a tax professional. Actual taxes
          may vary based on deductions, credits, and other factors not considered
          here. VA compensation rates are based on 2026 published rates and are
          subject to change. State and local tax calculations are estimates and
          may not reflect all local jurisdictions.
        </AlertDescription>
      </Alert>
    </footer>
  );
}
