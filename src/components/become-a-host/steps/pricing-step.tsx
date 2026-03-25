import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimePicker } from "@/components/ui/time-picker";
import { IBecomeHostPropertyFormData } from "@/domain/interfaces";
import { DollarSign } from "lucide-react";

interface PricingStepProps {
  formData: IBecomeHostPropertyFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<IBecomeHostPropertyFormData>
  >;
}

export const PricingStep = ({ formData, setFormData }: PricingStepProps) => {
  const handleNumberInput =
    (field: keyof IBecomeHostPropertyFormData) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "") {
          setFormData({ ...formData, [field]: 0 });
          return;
        }
        if (!/^\d+$/.test(value)) return;
        setFormData({ ...formData, [field]: Number(value) });
      };

  const blockInvalidKeys = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (
      !/[0-9]/.test(e.key) &&
      !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"].includes(e.key)
    ) {
      e.preventDefault();
    }
  };

  const numberInputProps = (field: keyof IBecomeHostPropertyFormData) => ({
    type: "text" as const,
    inputMode: "numeric" as const,
    value: (formData[field] as number) === 0 ? "" : (formData[field] as number),
    onChange: handleNumberInput(field),
    onKeyDown: blockInvalidKeys,
    className:
      "w-full py-6 px-4 text-base bg-white border-stone-200 rounded-lg focus-visible:ring-0 focus-visible:border-rose-500 transition-all",
  });

  return (
    <div className="w-full mx-auto flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 w-full">
        <h2 className="text-base md:text-xl lg:text-2xl 3xl:text-3xl font-bold tracking-tight text-foreground mb-2">
          Set your pricing and policies
        </h2>
        <p className="text-muted-foreground text-sm md:text-md lg:text-md 3xl:text-base">
          Decide how much you charge and set the rules for your property.
        </p>
      </div>

      <div className="w-full space-y-8">
        {/* Pricing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <Label className="text-sm font-semibold text-foreground">
              Base Price per Night
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
              <Input
                {...numberInputProps("basePrice")}
                placeholder="100"
                min="1"
                className="w-full pl-9 py-6 text-base bg-white border-stone-200 rounded-lg focus-visible:ring-0 focus-visible:border-rose-500 transition-all"
              />
            </div>
          </div>
          <div className="flex flex-col space-y-2">
            <Label className="text-sm font-semibold text-foreground">
              Currency
            </Label>
            <Select
              value={formData.currency}
              onValueChange={(value) =>
                setFormData({ ...formData, currency: value })
              }
            >
              <SelectTrigger className="w-full px-4 py-6 text-base bg-white border-stone-200 rounded-lg focus:ring-0 focus:border-rose-500 transition-all">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent className="rounded-lg border-stone-200">
                <SelectItem value="INR">INR (₹)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
                <SelectItem value="GBP">GBP (£)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stay Requirements */}
        <div className="pt-4 border-t border-stone-100">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Stay requirements
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Min Nights
              </Label>
              <Input
                {...numberInputProps("minNights")}
                placeholder="1"
                min="1"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Max Nights
              </Label>
              <Input
                {...numberInputProps("maxNights")}
                placeholder="30"
                min="1"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Max Guests
              </Label>
              <Input
                {...numberInputProps("maxGuests")}
                placeholder="2"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Check-in/out */}
        <div className="pt-4 border-t border-stone-100">
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Availability
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Check-in Time
              </Label>
              <TimePicker
                id="check-in-time"
                value={formData.checkInTime}
                onChange={(value) =>
                  setFormData({ ...formData, checkInTime: value })
                }
                className="w-full h-12 px-4 text-base bg-white border-stone-200 rounded-lg focus-visible:ring-0 focus-visible:border-rose-500 transition-all"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Check-out Time
              </Label>
              <TimePicker
                id="check-out-time"
                value={formData.checkOutTime}
                onChange={(value) =>
                  setFormData({ ...formData, checkOutTime: value })
                }
                className="w-full h-12 px-4 text-base bg-white border-stone-200 rounded-lg focus-visible:ring-0 focus-visible:border-rose-500 transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
