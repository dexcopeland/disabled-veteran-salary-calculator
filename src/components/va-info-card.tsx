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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";

interface VAInfoCardProps {
  vaRating: string;
  dependents: string;
  hasSpouse: boolean;
  hasDependentParent: boolean;
  onVaRatingChange: (value: string) => void;
  onDependentsChange: (value: string) => void;
  onHasSpouseChange: (value: boolean) => void;
  onHasDependentParentChange: (value: boolean) => void;
}

const RATINGS = ["0", "10", "20", "30", "40", "50", "60", "70", "80", "90", "100"];
const DEPENDENTS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

export function VAInfoCard({
  vaRating,
  dependents,
  hasSpouse,
  hasDependentParent,
  onVaRatingChange,
  onDependentsChange,
  onHasSpouseChange,
  onHasDependentParentChange,
}: VAInfoCardProps) {
  const ratingNum = parseInt(vaRating);
  const spouseEnabled = ratingNum >= 30;
  const parentEnabled = ratingNum >= 100;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2.5 text-base font-semibold tracking-tight">
          <div className="flex items-center justify-center h-7 w-7 rounded-md bg-amber-500/10 text-amber-500">
            <Shield className="h-4 w-4" />
          </div>
          VA Disability Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="va-rating" className="text-sm text-muted-foreground">
            Disability Rating
          </Label>
          <Select value={vaRating} onValueChange={onVaRatingChange}>
            <SelectTrigger id="va-rating" className="w-full">
              <SelectValue placeholder="Select rating" />
            </SelectTrigger>
            <SelectContent>
              {RATINGS.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}%
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dependents" className="text-sm text-muted-foreground">
            Dependent Children
          </Label>
          <Select value={dependents} onValueChange={onDependentsChange}>
            <SelectTrigger id="dependents" className="w-full">
              <SelectValue placeholder="Number of dependents" />
            </SelectTrigger>
            <SelectContent>
              {DEPENDENTS.map((d) => (
                <SelectItem key={d} value={d}>
                  {d === "10" ? "10+" : d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-3">
            <Checkbox
              id="has-spouse"
              checked={hasSpouse}
              onCheckedChange={(checked) =>
                onHasSpouseChange(checked === true)
              }
              disabled={!spouseEnabled}
            />
            <Label
              htmlFor="has-spouse"
              className={`text-sm cursor-pointer ${
                !spouseEnabled ? "text-muted-foreground/50" : ""
              }`}
            >
              I have a spouse
            </Label>
          </div>

          <div className="flex items-center gap-3">
            <Checkbox
              id="has-parent"
              checked={hasDependentParent}
              onCheckedChange={(checked) =>
                onHasDependentParentChange(checked === true)
              }
              disabled={!parentEnabled}
            />
            <Label
              htmlFor="has-parent"
              className={`text-sm cursor-pointer ${
                !parentEnabled ? "text-muted-foreground/50" : ""
              }`}
            >
              I have dependent parent(s)
            </Label>
          </div>

          {!spouseEnabled && (
            <p className="text-[11px] text-muted-foreground/60 pl-7">
              Spouse/parent dependents require 30%+ rating
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
