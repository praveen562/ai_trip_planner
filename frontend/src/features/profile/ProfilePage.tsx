import { useState } from 'react';
import { AlertTriangle, UserPlus } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';
import { Skeleton } from '../../components/ui/Loading';
import { Card } from '../../components/ui/Card';
import { ProfileForm } from './components/ProfileForm';
import { ProfileView } from './components/ProfileView';
import { useProfile, useSaveProfile } from './useProfile';
import { mapProfileResponseToForm } from '../../utils/mappers/profile';

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton variant="rect" height={110} />
      <Skeleton variant="rect" height={140} />
      <Skeleton variant="rect" height={140} />
    </div>
  );
}

export function ProfilePage() {
  const { data: profile, isLoading, isError } = useProfile();
  const [isEditing, setIsEditing] = useState(false);

  const saveMutation = useSaveProfile(profile ? 'edit' : 'create');

  return (
    <PageLayout>
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 font-display text-3xl font-semibold text-dark">Profile</h1>

        {isLoading && <ProfileSkeleton />}

        {isError && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-error/10 text-error">
              <AlertTriangle className="size-5" />
            </span>
            <p className="text-gray-500">Couldn't load your profile. Please try again in a moment.</p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {!profile && (
              <Card variant="elevated">
                <div className="mb-6 flex items-center gap-2">
                  <span className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <UserPlus className="size-4.5" />
                  </span>
                  <div>
                    <h2 className="font-display text-lg font-semibold text-dark">Set up your profile</h2>
                    <p className="text-sm text-gray-500">Used to personalize your trips and itineraries.</p>
                  </div>
                </div>
                <ProfileForm
                  mode="create"
                  onSubmit={(values) => saveMutation.mutate(values)}
                  isSaving={saveMutation.isPending}
                />
                {saveMutation.isError && (
                  <p className="mt-4 text-sm text-error">Something went wrong saving your profile. Please try again.</p>
                )}
              </Card>
            )}

            {profile && !isEditing && <ProfileView profile={profile} onEdit={() => setIsEditing(true)} />}

            {profile && isEditing && (
              <Card variant="elevated">
                <h2 className="mb-6 font-display text-lg font-semibold text-dark">Edit profile</h2>
                <ProfileForm
                  mode="edit"
                  defaultValues={mapProfileResponseToForm(profile)}
                  onSubmit={(values) =>
                    saveMutation.mutate(values, { onSuccess: () => setIsEditing(false) })
                  }
                  onCancel={() => setIsEditing(false)}
                  isSaving={saveMutation.isPending}
                />
                {saveMutation.isError && (
                  <p className="mt-4 text-sm text-error">Something went wrong saving your profile. Please try again.</p>
                )}
              </Card>
            )}
          </>
        )}
      </div>
    </PageLayout>
  );
}
