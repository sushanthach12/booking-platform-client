import { GuestProfile } from '@/data/interfaces';
import { useState } from 'react';
import { Modal } from '../shared/modal';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

export const EditProfileDialog = ({
  profile,
  open,
  onOpenChange,
  onSave,
}: {
  profile: GuestProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updated: Partial<GuestProfile>) => void;
}) => {
  const [form, setForm] = useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.phone,
    bio: profile.bio,
    location: profile.location,
  });

  function handleSave() {
    onSave(form);
    onOpenChange(false);
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} className='max-w-md'>
      <Modal.Header>Edit Profile</Modal.Header>
      <Modal.Body>
        <div className='space-y-4 pt-2'>
          <div className='grid grid-cols-2 gap-3'>
            <div className='space-y-1.5'>
              <Label
                htmlFor='firstName'
                className='text-xs font-semibold text-slate-600'
              >
                First name
              </Label>
              <Input
                id='firstName'
                value={form.firstName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, firstName: e.target.value }))
                }
              />
            </div>
            <div className='space-y-1.5'>
              <Label
                htmlFor='lastName'
                className='text-xs font-semibold text-slate-600'
              >
                Last name
              </Label>
              <Input
                id='lastName'
                value={form.lastName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, lastName: e.target.value }))
                }
              />
            </div>
          </div>

          <div className='space-y-1.5'>
            <Label
              htmlFor='phone'
              className='text-xs font-semibold text-slate-600'
            >
              Phone number
            </Label>
            <Input
              id='phone'
              type='tel'
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
            />
          </div>

          <div className='space-y-1.5'>
            <Label
              htmlFor='location'
              className='text-xs font-semibold text-slate-600'
            >
              Location
            </Label>
            <Input
              id='location'
              value={form.location}
              onChange={(e) =>
                setForm((f) => ({ ...f, location: e.target.value }))
              }
              placeholder='City, Country'
            />
          </div>

          <div className='space-y-1.5'>
            <Label
              htmlFor='bio'
              className='text-xs font-semibold text-slate-600'
            >
              Bio
            </Label>
            <Textarea
              id='bio'
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              className='resize-none'
              rows={3}
              placeholder='Tell hosts a little about yourself...'
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className='flex gap-2 pt-1'>
          <Button
            variant='outline'
            className='flex-1 rounded-lg'
            size='lg'
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            className='flex-1 rounded-lg bg-rose-500 hover:bg-rose-600 text-white'
            size='lg'
            onClick={handleSave}
          >
            Save changes
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};
