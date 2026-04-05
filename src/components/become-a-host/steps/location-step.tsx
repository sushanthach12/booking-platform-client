import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IBecomeHostPropertyFormData } from "@/domain/entities";

interface LocationStepProps {
  formData: IBecomeHostPropertyFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<IBecomeHostPropertyFormData>
  >;
}

export const LocationStep = ({ formData, setFormData }: LocationStepProps) => {
  return (
    <div className="w-full mx-auto flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 w-full">
        <h2 className="text-base md:text-xl lg:text-2xl 3xl:text-3xl font-bold tracking-tight text-foreground mb-2">
          Where&apos;s your property located?
        </h2>
        <p className="text-muted-foreground text-sm md:text-md lg:text-md 3xl:text-base">
          Guests will only get your exact address once they&apos;ve booked.
        </p>
      </div>

      <div className="w-full space-y-6">
        <div className="flex flex-col space-y-2">
          <Label className="text-sm font-semibold text-foreground">
            Street Address
          </Label>
          <Input
            type="text"
            value={formData.addressLine1}
            onChange={(e) =>
              setFormData({ ...formData, addressLine1: e.target.value })
            }
            className="w-full px-4 py-6 text-base bg-white border-stone-200 rounded-lg focus-visible:ring-0 focus-visible:border-rose-500 transition-all"
            placeholder="e.g. 123 Main Street"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <Label className="text-sm font-semibold text-foreground">
            Apt, suite, etc. (Optional)
          </Label>
          <Input
            type="text"
            value={formData.addressLine2}
            onChange={(e) =>
              setFormData({ ...formData, addressLine2: e.target.value })
            }
            className="w-full px-4 py-6 text-base bg-white border-stone-200 rounded-lg focus-visible:ring-0 focus-visible:border-rose-500 transition-all"
            placeholder="e.g. Apt 4B"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <Label className="text-sm font-semibold text-foreground">
              City
            </Label>
            <Input
              type="text"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="w-full px-4 py-6 text-base bg-white border-stone-200 rounded-lg focus-visible:ring-0 focus-visible:border-rose-500 transition-all"
              placeholder="e.g. New York"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label className="text-sm font-semibold text-foreground">
              State / Province
            </Label>
            <Input
              type="text"
              value={formData.state}
              onChange={(e) =>
                setFormData({ ...formData, state: e.target.value })
              }
              className="w-full px-4 py-6 text-base bg-white border-stone-200 rounded-lg focus-visible:ring-0 focus-visible:border-rose-500 transition-all"
              placeholder="e.g. NY"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col space-y-2">
            <Label className="text-sm font-semibold text-foreground">
              Country
            </Label>
            <Input
              type="text"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              className="w-full px-4 py-6 text-base bg-white border-stone-200 rounded-lg focus-visible:ring-0 focus-visible:border-rose-500 transition-all"
              placeholder="e.g. United States"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label className="text-sm font-semibold text-foreground">
              Postal Code
            </Label>
            <Input
              type="text"
              value={formData.postalCode}
              onChange={(e) =>
                setFormData({ ...formData, postalCode: e.target.value })
              }
              className="w-full px-4 py-6 text-base bg-white border-stone-200 rounded-lg focus-visible:ring-0 focus-visible:border-rose-500 transition-all"
              placeholder="e.g. 10001"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
