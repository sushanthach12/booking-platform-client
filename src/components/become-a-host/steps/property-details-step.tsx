import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IBecomeHostPropertyFormData, PROPERTY_TYPES } from "@/data/interfaces";

interface PropertyDetailsStepProps {
    formData: IBecomeHostPropertyFormData;
    setFormData: React.Dispatch<React.SetStateAction<IBecomeHostPropertyFormData>>;
}

export const PropertyDetailsStep = ({
    formData,
    setFormData,
}: PropertyDetailsStepProps) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Tell us about your property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Property Title
                    </label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full p-3 border rounded-lg"
                        placeholder="Cozy apartment in downtown"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
                        className="w-full p-3 border rounded-lg h-32"
                        placeholder="Describe your property..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">
                        Property Type
                    </label>
                    <select
                        value={formData.propertyType}
                        onChange={(e) =>
                            setFormData({ ...formData, propertyType: e.target.value })
                        }
                        className="w-full p-3 border rounded-lg"
                    >
                        <option value="">Select property type</option>
                        {PROPERTY_TYPES.map((type) => (
                            <option key={type} value={type}>
                                {type.charAt(0) + type.slice(1).toLowerCase()}
                            </option>
                        ))}
                    </select>
                </div>
            </CardContent>
        </Card>
    );
}