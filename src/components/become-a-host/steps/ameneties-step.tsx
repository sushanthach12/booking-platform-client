import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AMENITIES, IBecomeHostPropertyFormData } from "@/data/interfaces";

interface AmenitiesStepProps {
    formData: IBecomeHostPropertyFormData;
    setFormData: React.Dispatch<React.SetStateAction<IBecomeHostPropertyFormData>>;
}

export const AmenitiesStep = ({
    formData,
    setFormData,
}: AmenitiesStepProps) => {
    const toggleAmenity = (amenity: string) => {
        setFormData({
            ...formData,
            amenities: formData.amenities.includes(amenity)
                ? formData.amenities.filter((a) => a !== amenity)
                : [...formData.amenities, amenity],
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>What amenities do you offer?</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {AMENITIES.map((amenity) => (
                        <label
                            key={amenity.name}
                            className="flex items-center space-x-2 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={formData.amenities.includes(amenity.name)}
                                onChange={() => toggleAmenity(amenity.name)}
                                className="rounded"
                            />
                            <span className="text-sm">{amenity.name}</span>
                        </label>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}