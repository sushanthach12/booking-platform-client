import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TimePicker } from "@/components/ui/time-picker";
import { IBecomeHostPropertyFormData } from "@/data/interfaces";
import { DollarSign } from "lucide-react";

interface PricingStepProps {
  formData: IBecomeHostPropertyFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<IBecomeHostPropertyFormData>
  >;
}

export const PricingStep = ({ formData, setFormData }: PricingStepProps) => {
  return (
    <div className="w-full mx-auto flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 w-full">
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-2">
          Set your pricing and policies
        </h2>
        <p className="text-muted-foreground text-base">
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
            <InputGroup className="w-full py-6 text-base bg-white border-stone-200 rounded-lg focus-visible:ring-0  focus-visible:border-rose-500 transition-all">
              <InputGroupAddon align="inline-start">
                <DollarSign />
              </InputGroupAddon>
              <InputGroupInput
                type="number"
                value={formData.basePrice === 0 ? "" : formData.basePrice}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    basePrice: Number(e.target.value),
                  })
                }
                placeholder="100"
                min="0"
              />
            </InputGroup>
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
                type="number"
                value={formData.minNights}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    minNights: Number(e.target.value),
                  })
                }
                className="w-full py-6 px-4 text-base bg-white border-stone-200 rounded-lg focus-visible:ring-0 focus-visible:border-rose-500 transition-all"
                placeholder="1"
                min="1"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Max Nights
              </Label>
              <Input
                type="number"
                value={formData.maxNights}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxNights: Number(e.target.value),
                  })
                }
                className="w-full py-6 px-4 text-base bg-white border-stone-200 rounded-lg focus-visible:ring-0 focus-visible:border-rose-500 transition-all"
                placeholder="30"
                min="1"
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Max Guests
              </Label>
              <Input
                type="number"
                value={formData.maxGuests}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxGuests: Number(e.target.value),
                  })
                }
                className="w-full py-6 px-4 text-base bg-white border-stone-200 rounded-lg focus-visible:ring-0 focus-visible:border-rose-500 transition-all"
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
