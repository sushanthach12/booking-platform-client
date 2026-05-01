'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAuthUseCase, getBookingUseCase } from '@/domain/di';
import {
  GuestBooking,
  GuestBookingsSummary,
  GuestProfile,
} from '@/domain/entities';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import {
  Bell,
  Calendar,
  Camera,
  ChevronRight,
  Edit3,
  Globe,
  HelpCircle,
  Lock,
  LogOut,
  Mail,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import { BookingsTab } from './bookings-tab';
import { EditProfileDialog } from './edit-profile-modal';
import { StatsSidebar } from './stats-sidebar';

interface AccountViewProps {
  profile: GuestProfile;
  bookingsSummary: GuestBookingsSummary;
}

type TabId = 'bookings' | 'settings';

function getInitials(first: string, last: string) {
  return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase();
}

function SettingsRow({
  icon: Icon,
  label,
  description,
  action,
  destructive = false,
}: {
  icon: React.ElementType;
  label: string;
  description?: string;
  action?: React.ReactNode;
  destructive?: boolean;
}) {
  return (
    <div className='flex items-center gap-4 py-4'>
      <div
        className={cn(
          'size-9 rounded-xl flex items-center justify-center shrink-0',
          destructive ? 'bg-red-50' : 'bg-slate-50',
        )}
      >
        <Icon
          className={cn(
            'size-4',
            destructive ? 'text-red-500' : 'text-slate-500',
          )}
        />
      </div>
      <div className='flex-1 min-w-0'>
        <p
          className={cn(
            'text-sm font-semibold',
            destructive ? 'text-red-600' : 'text-slate-800',
          )}
        >
          {label}
        </p>
        {description && (
          <p className='text-xs text-slate-400 mt-0.5'>{description}</p>
        )}
      </div>
      {action ?? <ChevronRight className='size-4 text-slate-300 shrink-0' />}
    </div>
  );
}

export function AccountView({ profile, bookingsSummary }: AccountViewProps) {
  const [activeTab, setActiveTab] = useState<TabId>('bookings');
  const [localProfile, setLocalProfile] = useState(profile);
  const [editOpen, setEditOpen] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [localBookings, setLocalBookings] = useState<{
    upcoming: GuestBooking[];
    past: GuestBooking[];
  }>({ upcoming: bookingsSummary.upcoming, past: bookingsSummary.past });

  const fullName = `${localProfile.firstName} ${localProfile.lastName}`;

  const handleSignOut = async () => {
    await getAuthUseCase().logout();
    window.location.href = '/';
  };

  const handleProfileSave = (updated: Partial<GuestProfile>) => {
    setLocalProfile((p) => ({ ...p, ...updated }));
  };

  const handleCancelBooking = async (id: string) => {
    setCancellingId(id);
    try {
      await getBookingUseCase().cancelBooking(id);
      const optimisticUpdate = (list: GuestBooking[]) =>
        list.map((b) =>
          b.id === id ? { ...b, status: 'cancelled' as const } : b,
        );
      setLocalBookings((prev) => ({
        upcoming: optimisticUpdate(prev.upcoming),
        past: optimisticUpdate(prev.past),
      }));
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className='min-h-screen bg-slate-50'>
      {/* Profile header */}
      <div className='bg-white border-b border-slate-100'>
        <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='flex flex-col sm:flex-row items-start sm:items-center gap-6'>
            <div className='relative'>
              <Avatar className='size-20 ring-4 ring-white shadow-md'>
                <AvatarImage
                  src={localProfile.avatarUrl ?? undefined}
                  alt={fullName}
                />
                <AvatarFallback className='bg-rose-100 text-rose-600 text-xl font-bold'>
                  {getInitials(localProfile.firstName, localProfile.lastName)}
                </AvatarFallback>
              </Avatar>
              <button
                aria-label='Change profile photo'
                className='absolute -bottom-1 -right-1 size-7 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors'
              >
                <Camera className='size-3.5 text-slate-500' />
              </button>
            </div>

            <div className='flex-1 min-w-0'>
              <div className='flex flex-wrap items-center gap-2 mb-1'>
                <h1 className='text-2xl font-bold text-slate-900'>
                  {fullName}
                </h1>
                {localProfile.isVerified && (
                  <Badge
                    variant='outline'
                    className='gap-1 text-emerald-700 border-emerald-200 bg-emerald-50 text-xs font-semibold'
                  >
                    <ShieldCheck className='size-3' />
                    Verified
                  </Badge>
                )}
              </div>
              <div className='flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 mb-3'>
                {localProfile.location && (
                  <span className='flex items-center gap-1'>
                    <MapPin className='size-3.5' />
                    {localProfile.location}
                  </span>
                )}
                <span className='flex items-center gap-1'>
                  <Calendar className='size-3.5' />
                  Member since{' '}
                  {format(parseISO(localProfile.memberSince), 'MMMM yyyy')}
                </span>
              </div>
              {localProfile.bio && (
                <p className='text-sm text-slate-600 max-w-lg'>
                  {localProfile.bio}
                </p>
              )}
            </div>

            <Button
              variant='outline'
              size='sm'
              className='gap-2 rounded-lg border-slate-200 text-slate-600 hover:text-slate-900'
              onClick={() => setEditOpen(true)}
            >
              <Edit3 className='size-3.5' />
              Edit profile
            </Button>
          </div>
        </div>
      </div>

      <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 items-start'>
          <div>
            {/* Tab bar */}
            <div className='flex gap-1 bg-white rounded-2xl p-1 border border-slate-100 mb-6 w-fit'>
              {(['bookings', 'settings'] as TabId[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all duration-150',
                    activeTab === tab
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-500 hover:text-slate-800',
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === 'bookings' && (
              <BookingsTab
                upcoming={localBookings.upcoming}
                past={localBookings.past}
                cancellingId={cancellingId}
                onCancel={handleCancelBooking}
              />
            )}

            {activeTab === 'settings' && (
              <div className='space-y-4'>
                <Card className='rounded-2xl border-slate-100 shadow-none'>
                  <CardHeader className='pb-0'>
                    <CardTitle className='text-sm font-bold text-slate-500 uppercase tracking-widest'>
                      Account
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='divide-y divide-slate-50 px-6'>
                    <SettingsRow
                      icon={Mail}
                      label='Email address'
                      description={localProfile.email}
                    />
                    <SettingsRow
                      icon={Lock}
                      label='Password'
                      description='Last changed 3 months ago'
                    />
                    <SettingsRow
                      icon={ShieldCheck}
                      label='Two-factor authentication'
                      description='Add an extra layer of security'
                      action={
                        <Badge
                          variant='outline'
                          className='text-slate-400 text-xs'
                        >
                          Off
                        </Badge>
                      }
                    />
                  </CardContent>
                </Card>

                <Card className='rounded-2xl border-slate-100 shadow-none'>
                  <CardHeader className='pb-0'>
                    <CardTitle className='text-sm font-bold text-slate-500 uppercase tracking-widest'>
                      Preferences
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='divide-y divide-slate-50 px-6'>
                    <SettingsRow
                      icon={Bell}
                      label='Notifications'
                      description='Email and push notification settings'
                    />
                    <SettingsRow
                      icon={Globe}
                      label='Language & region'
                      description='English (US) · USD'
                    />
                  </CardContent>
                </Card>

                <Card className='rounded-2xl border-slate-100 shadow-none'>
                  <CardHeader className='pb-0'>
                    <CardTitle className='text-sm font-bold text-slate-500 uppercase tracking-widest'>
                      Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='divide-y divide-slate-50 px-6'>
                    <SettingsRow icon={HelpCircle} label='Help centre' />
                    <SettingsRow
                      icon={LogOut}
                      label='Sign out'
                      destructive
                      action={
                        <Button
                          variant='ghost'
                          size='sm'
                          className='text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg text-xs'
                          onClick={handleSignOut}
                        >
                          Sign out
                        </Button>
                      }
                    />
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          <StatsSidebar stats={bookingsSummary.stats} profile={localProfile} />
        </div>
      </div>

      {editOpen && (
        <EditProfileDialog
          profile={localProfile}
          open={editOpen}
          onOpenChange={setEditOpen}
          onSave={handleProfileSave}
        />
      )}
    </div>
  );
}
