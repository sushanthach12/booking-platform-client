import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { IBecomeHostPropertyFormData, PROPERTY_TYPES } from '@/data/interfaces';

interface PropertyDetailsStepProps {
  formData: IBecomeHostPropertyFormData;
  setFormData: React.Dispatch<
    React.SetStateAction<IBecomeHostPropertyFormData>
  >;
}

export const PropertyDetailsStep = ({
  formData,
  setFormData,
}: PropertyDetailsStepProps) => {
  return (
    <div className='w-full mx-auto flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500'>
      <div className='mb-10 w-full'>
        <h2 className='text-base md:text-xl lg:text-2xl 3xl:text-3xl font-bold tracking-tight text-foreground mb-2'>
          Tell us about your property
        </h2>
        <p className='text-muted-foreground text-sm md:text-md lg:text-md 3xl:text-base'>
          Share some basic details to get your listing started.
        </p>
      </div>

      <div className='w-full space-y-8'>
        <div className='flex flex-col space-y-2'>
          <Label className='text-sm font-semibold text-foreground'>
            Property Type
          </Label>
          <Select
            value={formData.propertyType}
            onValueChange={(e) => setFormData({ ...formData, propertyType: e })}
          >
            <SelectTrigger className='w-full px-4 py-6 text-base bg-white border border-stone-200 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-rose-500 transition-all cursor-pointer'>
              <SelectValue placeholder='Select property type' />
            </SelectTrigger>
            <SelectContent className='rounded-lg border-stone-200'>
              {PROPERTY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='flex flex-col space-y-2'>
          <Label className='text-sm font-semibold text-foreground'>
            Property Title
          </Label>
          <Input
            type='text'
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className='w-full px-4 py-6 text-base bg-white border-stone-200 rounded-lg focus-visible:ring-0 focus-visible:border-rose-500 transition-all'
            placeholder='e.g. Cozy apartment in downtown'
          />
        </div>

        <div className='flex flex-col space-y-2'>
          <Label className='text-sm font-semibold text-foreground'>
            Description
          </Label>
          <Textarea
            value={formData.description}
            rows={4}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className='w-full p-4 text-base bg-white border-stone-200 rounded-lg resize-none focus-visible:ring-0 focus-visible:border-rose-500 transition-all'
            placeholder='What makes your place special? Mention the best features, the neighborhood, etc.'
          />
        </div>
      </div>
    </div>
  );
};
