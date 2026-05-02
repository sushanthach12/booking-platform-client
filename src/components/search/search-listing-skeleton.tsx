import { cn } from '@/lib/utils';

function SkeletonBox({ className }: { className?: string }) {
  return <div className={cn('bg-muted animate-pulse rounded-xl', className)} />;
}

function PropertyCardSkeleton() {
  return (
    <div className='flex flex-col'>
      {/* Image */}
      <SkeletonBox className='aspect-[4/3] rounded-2xl mb-3' />
      {/* Location + rating row */}
      <div className='flex items-center justify-between px-0.5 mb-1.5'>
        <SkeletonBox className='h-4 w-2/3 rounded-md' />
        <SkeletonBox className='h-4 w-10 rounded-md' />
      </div>
      {/* Title */}
      <SkeletonBox className='h-4 w-4/5 rounded-md px-0.5 mb-2 ml-0.5' />
      {/* Price */}
      <SkeletonBox className='h-4 w-1/3 rounded-md px-0.5 ml-0.5' />
    </div>
  );
}

interface SearchListingSkeletonProps {
  count?: number;
}

export function SearchListingSkeleton({
  count = 10,
}: SearchListingSkeletonProps) {
  return (
    <div className='p-4 sm:p-6 grid grid-cols-1 gap-6 lg:gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
      {Array.from({ length: count }).map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  );
}
