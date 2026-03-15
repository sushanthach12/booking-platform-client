'use client';

import { cn } from '@/lib/utils';
import { ChevronLeft, Heart, Share } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';

interface PhotoTourProps {
  propertyId: string;
  images: string[];
  title: string;
  /** Optional labels per image (e.g. "Living room", "Full kitchen"). Falls back to "Cover Photo" / "View N" when omitted. */
  labels?: string[];
}

function getLabel(index: number, labels?: string[]): string {
  if (labels?.[index]) return labels[index];
  return index === 0 ? 'Cover Photo' : `View ${index + 1}`;
}

export default function PhotoTour({
  propertyId,
  images,
  title,
  labels,
}: PhotoTourProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const observer = useRef<IntersectionObserver | null>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    observer.current = new IntersectionObserver(
      (entries) => {
        // Among all currently intersecting entries, pick the one closest to the top
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (intersecting.length > 0) {
          const index = parseInt(
            intersecting[0].target.getAttribute('data-index') || '0',
          );
          setActiveIndex(index);
        }
      },
      {
        threshold: 0,
        rootMargin: '0px 0px -40% 0px',
      },
    );

    const targets = document.querySelectorAll('[data-photo-section]');
    targets.forEach((target) => observer.current?.observe(target));

    return () => observer.current?.disconnect();
  }, []);

  const scrollToImage = (index: number) => {
    const target = document.querySelector(`[data-index="${index}"]`);
    if (target) {
      const headerOffset = 180; // Approximate header + nav height
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className='min-h-screen bg-white flex flex-col overflow-visible'>
      {/* Sticky header only */}
      <header className='sticky top-0 z-20 flex items-center justify-between px-4 sm:px-4 py-4 bg-white '>
        <Link
          href={`/properties/${propertyId}`}
          className='p-2 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors group border border-stone-100'
          aria-label='Back to property'
        >
          <ChevronLeft className='size-6 text-stone-900 group-hover:scale-110 transition-transform' />
        </Link>
        <div className='flex items-center'>
          <Button
            variant={'ghost'}
            size={'sm'}
            className='flex items-center gap-2 text-sm font-semibold hover:bg-stone-100 px-4 py-2 rounded-lg transition-all border border-transparent hover:border-stone-200'
          >
            <Share className='size-4' />
            <span className='hidden sm:inline'>Share</span>
          </Button>
          <Button
            variant={'ghost'}
            size={'sm'}
            onClick={() => setIsFavorited(!isFavorited)}
            className='flex items-center gap-2 text-sm font-semibold hover:bg-stone-100 px-4 py-2 rounded-lg transition-all border border-transparent hover:border-stone-200'
          >
            <Heart
              className={cn(
                'size-4 transition-all',
                isFavorited
                  ? 'fill-rose-500 text-rose-500 scale-110'
                  : 'text-stone-900',
              )}
            />
            <span className='hidden sm:inline'>
              {isFavorited ? 'Saved' : 'Save'}
            </span>
          </Button>
        </div>
      </header>

      {/* Main container: same width for photo tour + content */}
      <main className='flex-1 flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-6'>
        {/* Photo tour title + thumbnail strip */}
        <div className='pb-4 bg-white shrink-0'>
          <h2 className='text-xl sm:text-2xl font-bold text-stone-900 mb-4 font-display tracking-tight'>
            Photo tour
          </h2>
          <nav className='w-full'>
            <div className='grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-5 py-2'>
              {images.map((url, index) => (
                <button
                  key={`thumb-${index}`}
                  ref={(el) => {
                    thumbnailRefs.current[index] = el;
                  }}
                  onClick={() => scrollToImage(index)}
                  className='flex flex-col items-center gap-2 w-full group focus:outline-none transition-all'
                >
                  <div className='relative w-full aspect-video overflow-hidden border-2 bg-white shadow-sm transition-all duration-300 group-hover:shadow-md'>
                    <Image
                      src={url}
                      alt={getLabel(index, labels)}
                      fill
                      className='object-cover'
                      sizes='(min-width: 1024px) 16vw, (min-width: 640px) 22vw, 45vw'
                    />
                  </div>
                  <span
                    className={cn(
                      'text-xs font-medium text-stone-700 text-center w-full line-clamp-2',
                      activeIndex === index && 'font-semibold text-stone-900',
                    )}
                  >
                    {getLabel(index, labels)}
                  </span>
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Content — same width as photo tour above */}
        <div className='flex-1 w-full py-6 sm:py-10 flex flex-col items-center'>
          {/* Vertical Image List: two-column layout — sticky left text, scrolling right image */}
          <div className='flex flex-col gap-24 sm:gap-32 w-full'>
            {images.map((url, index) => (
              <div
                key={`${url}-${index}`}
                data-index={index}
                data-photo-section
                className='grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,2.5fr)] gap-8 md:gap-10 lg:gap-12 items-start scroll-mt-28'
              >
                {/* Left: sticky text — stays in view while right column scrolls */}
                <div className='md:sticky md:top-24 md:self-start flex flex-col gap-1.5 pr-0 md:pr-4'>
                  <h2 className='text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-3'>
                    <span className='size-8 rounded-full bg-stone-900 text-white text-sm flex items-center justify-center font-display shrink-0'>
                      {index + 1}
                    </span>
                    {getLabel(index, labels)}
                  </h2>
                  <p className='text-stone-500 text-sm sm:text-base leading-relaxed'>
                    {index === 0
                      ? 'Welcome to this beautiful property. This is the main view that greets every guest.'
                      : 'Capturing the unique essence and character of this space.'}
                  </p>
                </div>

                {/* Right: image scrolls with the page */}
                <div className='relative aspect-3/2 w-full max-w-xl mx-auto overflow-hidden bg-stone-100 shadow-2xl border border-stone-100 transition-all duration-700 group-hover:shadow-[0_48px_96px_-24px_rgba(0,0,0,0.2)] ring-1 ring-black/5 min-h-[220px]'>
                  <Image
                    src={url}
                    alt={`${title} - View ${index + 1}`}
                    fill
                    className='object-cover transition-transform duration-1000 group-hover:scale-[1.04]'
                    sizes='(min-width: 768px) 576px, 100vw'
                    priority={index < 2}
                    loading={index < 2 ? 'eager' : 'lazy'}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Footer spacing */}
          <div className='h-32 sm:h-48 w-full' />
          <div className='text-center py-12 border-t border-stone-100 w-full'>
            <p className='text-stone-400 text-sm font-medium'>
              End of photo tour
            </p>
            <Link
              href={`/properties/${propertyId}`}
              className='mt-6 inline-flex items-center gap-2 text-rose-600 font-bold hover:underline group'
            >
              <ChevronLeft className='size-4 group-hover:-translate-x-1 transition-transform' />
              Back to property details
            </Link>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
