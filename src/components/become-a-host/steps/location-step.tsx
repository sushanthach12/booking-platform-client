import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IBecomeHostPropertyFormData } from "@/data/interfaces";

interface LocationStepProps {
    formData: IBecomeHostPropertyFormData;
    setFormData: React.Dispatch<React.SetStateAction<IBecomeHostPropertyFormData>>;
}

export const LocationStep = ({
    formData,
    setFormData,
}: LocationStepProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Where&apos;s your property located?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <input
                    type="text"
                    value={formData.addressLine1}
                    onChange={(e) =>
                        setFormData({ ...formData, addressLine1: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg"
                    placeholder="Address Line 1"
                />
                <input
                    type="text"
                    value={formData.addressLine2}
                    onChange={(e) =>
                        setFormData({ ...formData, addressLine2: e.target.value })
                    }
                    className="w-full p-3 border rounded-lg"
                    placeholder="Address Line 2 (Optional)"
                />
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full p-3 border rounded-lg"
                        placeholder="City"
                    />
                    <input
                        type="text"
                        value={formData.state}
                        onChange={(e) =>
                            setFormData({ ...formData, state: e.target.value })
                        }
                        className="w-full p-3 border rounded-lg"
                        placeholder="State"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        value={formData.country}
                        onChange={(e) =>
                            setFormData({ ...formData, country: e.target.value })
                        }
                        className="w-full p-3 border rounded-lg"
                        placeholder="Country"
                    />
                    <input
                        type="text"
                        value={formData.postalCode}
                        onChange={(e) =>
                            setFormData({ ...formData, postalCode: e.target.value })
                        }
                        className="w-full p-3 border rounded-lg"
                        placeholder="Postal Code"
                    />
                </div>
            </CardContent>
        </Card>
    );
}
