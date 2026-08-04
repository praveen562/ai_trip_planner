import { Pencil, Phone, Globe2, ShieldAlert, UtensilsCrossed, Accessibility } from 'lucide-react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import type { UserProfileResponseDto } from '../../../types/api/dto';

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm text-dark">{value}</p>
    </div>
  );
}

export function ProfileView({ profile, onEdit }: { profile: UserProfileResponseDto; onEdit: () => void }) {
  const initials = profile.full_name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="space-y-6">
      <Card variant="elevated" className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          {profile.profile_image_url ? (
            <img src={profile.profile_image_url} alt={profile.full_name} className="size-16 rounded-full object-cover" />
          ) : (
            <span className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
              {initials}
            </span>
          )}
          <div>
            <h2 className="font-display text-xl font-semibold text-dark">{profile.full_name}</h2>
            {profile.bio && <p className="mt-1 max-w-md text-sm text-gray-500">{profile.bio}</p>}
          </div>
        </div>

        <Button size="sm" variant="outline" leftIcon={<Pencil className="size-4" />} onClick={onEdit}>
          Edit profile
        </Button>
      </Card>

      <Card>
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-dark">
          <Phone className="size-4 text-primary" />
          Contact
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Phone number" value={profile.phone_number} />
          <Field label="Nationality" value={profile.nationality} />
        </div>
      </Card>

      <Card>
        <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-dark">
          <Globe2 className="size-4 text-primary" />
          Preferences
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Preferred language" value={profile.preferred_language} />
          <Field label="Preferred currency" value={profile.preferred_currency} />
        </div>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex gap-2">
            <UtensilsCrossed className="mt-0.5 size-4 shrink-0 text-gray-400" />
            <Field label="Dietary preferences" value={profile.dietary_preferences} />
          </div>
          <div className="flex gap-2">
            <Accessibility className="mt-0.5 size-4 shrink-0 text-gray-400" />
            <Field label="Accessibility requirements" value={profile.accessibility_requirements} />
          </div>
        </div>
      </Card>

      {(profile.emergency_contact_name || profile.emergency_contact_phone) && (
        <Card>
          <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-dark">
            <ShieldAlert className="size-4 text-primary" />
            Emergency contact
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Contact name" value={profile.emergency_contact_name} />
            <Field label="Contact phone" value={profile.emergency_contact_phone} />
          </div>
        </Card>
      )}
    </div>
  );
}
