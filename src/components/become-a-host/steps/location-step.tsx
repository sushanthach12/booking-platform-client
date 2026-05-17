import { MapPicker, type MapLocation } from '@/components/map/map-picker';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { IBecomeHostPropertyFormData } from '@/domain/entities';

interface LocationStepProps {
  formData: IBecomeHostPropertyFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<IBecomeHostPropertyFormData>
  >;
}

export const LocationStep = ({ formData, setFormData }: LocationStepProps) => {
  const mapValue: MapLocation = {
    latitude: formData.latitude,
    longitude: formData.longitude,
    addressLine1: formData.addressLine1,
    addressLine2: formData.addressLine2,
    city: formData.city,
    state: formData.state,
    country: formData.country,
    postalCode: formData.postalCode,
  };

  const handleMapChange = (location: MapLocation) => {
    setFormData((prev) => ({
      ...prev,
      latitude: location.latitude,
      longitude: location.longitude,
      addressLine1: location.addressLine1,
      addressLine2: location.addressLine2,
      city: location.city,
      state: location.state,
      country: location.country,
      postalCode: location.postalCode,
    }));
  };

  const field = (
    key: keyof IBecomeHostPropertyFormData,
    placeholder: string,
  ) => (
    <Input
      type='text'
      value={(formData[key] as string) ?? ''}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, [key]: e.target.value }))
      }
      className='w-full px-4 py-6 text-base bg-card border-border rounded-lg focus-visible:ring-0 focus-visible:border-primary transition-all'
      placeholder={placeholder}
    />
  );

  return (
    <div className='w-full mx-auto flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <div className='mb-8 w-full'>
        <h2 className='text-base md:text-xl lg:text-2xl 3xl:text-3xl font-bold tracking-tight text-foreground mb-2'>
          Where&apos;s your property located?
        </h2>
        <p className='text-muted-foreground text-sm md:text-md lg:text-md 3xl:text-base'>
          Guests will only get your exact address once they&apos;ve booked.
        </p>
      </div>

      {/* Map picker — search fills the fields below automatically */}
      <div className='mb-8'>
        <MapPicker
          value={mapValue}
          onChange={handleMapChange}
          mapHeight='280px'
        />
      </div>

      {/* Manual address fields (pre-filled by map, editable for corrections) */}
      <div className='w-full space-y-6'>
        <div className='flex flex-col space-y-2'>
          <Label className='text-sm font-semibold text-foreground'>
            Street Address
          </Label>
          {field('addressLine1', 'e.g. 123 Main Street')}
        </div>

        <div className='flex flex-col space-y-2'>
          <Label className='text-sm font-semibold text-foreground'>
            Apt, suite, etc.{' '}
            <span className='font-normal text-muted-foreground'>
              (Optional)
            </span>
          </Label>
          {field('addressLine2', 'e.g. Apt 4B')}
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col space-y-2'>
            <Label className='text-sm font-semibold text-foreground'>
              City
            </Label>
            {field('city', 'e.g. New York')}
          </div>
          <div className='flex flex-col space-y-2'>
            <Label className='text-sm font-semibold text-foreground'>
              State / Province
            </Label>
            {field('state', 'e.g. NY')}
          </div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='flex flex-col space-y-2'>
            <Label className='text-sm font-semibold text-foreground'>
              Country
            </Label>
            {field('country', 'e.g. United States')}
          </div>
          <div className='flex flex-col space-y-2'>
            <Label className='text-sm font-semibold text-foreground'>
              Postal Code
            </Label>
            {field('postalCode', 'e.g. 10001')}
          </div>
        </div>
      </div>
    </div>
  );
};
