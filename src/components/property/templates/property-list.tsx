import { getPropertyUseCase } from "@/domain/di";

const PropertyListingTemplate = async () => {
    const propertyUseCase = getPropertyUseCase();
    const properties = await propertyUseCase.getProperties();

    return (
        <div>PropertyListingTemplate
            {properties.map((property) => (
                <div key={property.id}>{property.name}</div>
            ))}

        </div>
    )
}

export default PropertyListingTemplate