import { Card } from "@codevs/ui/card";
import { Label } from "@codevs/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@codevs/ui/select";

const STATUS_OPTIONS = [
  { label: "Available", value: "AVAILABLE", color: "text-codeGreen" },
  { label: "Deployed", value: "DEPLOYED", color: "text-codeViolet" },
  { label: "Training", value: "TRAINING", color: "text-codeYellow" },
  { label: "Vacation", value: "VACATION", color: "text-codeBlue" },
  { label: "Busy", value: "BUSY", color: "text-codeRed" },
  { label: "Client Ready", value: "CLIENT_READY", color: "text-codePurple" },
];

const TYPE_OPTIONS = [
  { label: "Intern", value: "INTERN" },
  { label: "In-house", value: "INHOUSE" },
];

const POSITION_OPTIONS = [
  { label: "Front End Developer", value: "Front End Developer" },
  { label: "Back End Developer", value: "Back End Developer" },
  { label: "Full Stack Developer", value: "Full Stack Developer" },
  { label: "UI/UX Designer", value: "UI/UX Designer" },
  { label: "Project Manager", value: "Project Manager" },
];

interface TableFiltersProps {
  filters: {
    status: string;
    type: string;
    position: string;
  };
  onFilterChange: (key: string, value: string) => void;
}

export function TableFilters({ filters, onFilterChange }: TableFiltersProps) {
  return (
    <Card className="bg-dark-100 border-dark-200 space-y-4 p-4">
      <div className="flex flex-wrap gap-4">
        <div className="min-w-[200px] space-y-2">
          <Label className="text-light-900">Status</Label>
          <Select
            value={filters.status || "all"}
            onValueChange={(value) =>
              onFilterChange("status", value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="bg-dark-200 border-dark-200 text-light-900">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-dark-100 border-dark-200">
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                  className={option.color}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[200px] space-y-2">
          <Label className="text-light-900">Type</Label>
          <Select
            value={filters.type || "all"}
            onValueChange={(value) =>
              onFilterChange("type", value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="bg-dark-200 border-dark-200 text-light-900">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="bg-dark-100 border-dark-200">
              <SelectItem value="all">All Types</SelectItem>
              {TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="min-w-[200px] space-y-2">
          <Label className="text-light-900">Position</Label>
          <Select
            value={filters.position || "all"}
            onValueChange={(value) =>
              onFilterChange("position", value === "all" ? "" : value)
            }
          >
            <SelectTrigger className="bg-dark-200 border-dark-200 text-light-900">
              <SelectValue placeholder="Filter by position" />
            </SelectTrigger>
            <SelectContent className="bg-dark-100 border-dark-200">
              <SelectItem value="all">All Positions</SelectItem>
              {POSITION_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </Card>
  );
}
