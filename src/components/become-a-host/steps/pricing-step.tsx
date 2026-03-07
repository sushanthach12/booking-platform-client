import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IBecomeHostPropertyFormData } from "@/data/interfaces";

interface PricingStepProps {
  formData: IBecomeHostPropertyFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<IBecomeHostPropertyFormData>
  >;
}

export const PricingStep = ({ formData, setFormData }: PricingStepProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Set your pricing and policies</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Base Price per Night
            </label>
            <input
              type="number"
              value={formData.basePrice}
              onChange={(e) =>
                setFormData({ ...formData, basePrice: Number(e.target.value) })
              }
              className="w-full p-3 border rounded-lg"
              placeholder="100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <select
              value={formData.currency}
              onChange={(e) =>
                setFormData({ ...formData, currency: e.target.value })
              }
              className="w-full p-3 border rounded-lg"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Min Nights</label>
            <input
              type="number"
              value={formData.minNights}
              onChange={(e) =>
                setFormData({ ...formData, minNights: Number(e.target.value) })
              }
              className="w-full p-3 border rounded-lg"
              placeholder="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Nights</label>
            <input
              type="number"
              value={formData.maxNights}
              onChange={(e) =>
                setFormData({ ...formData, maxNights: Number(e.target.value) })
              }
              className="w-full p-3 border rounded-lg"
              placeholder="30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Max Guests</label>
            <input
              type="number"
              value={formData.maxGuests}
              onChange={(e) =>
                setFormData({ ...formData, maxGuests: Number(e.target.value) })
              }
              className="w-full p-3 border rounded-lg"
              placeholder="2"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Check-in Time
            </label>
            <input
              type="time"
              value={formData.checkInTime}
              onChange={(e) =>
                setFormData({ ...formData, checkInTime: e.target.value })
              }
              className="w-full p-3 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Check-out Time
            </label>
            <input
              type="time"
              value={formData.checkOutTime}
              onChange={(e) =>
                setFormData({ ...formData, checkOutTime: e.target.value })
              }
              className="w-full p-3 border rounded-lg"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
