import { useGetMe, useLogout } from '@/api/hooks/useAuth';
import { useMyBookings } from '@/api/hooks/useBookings';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import BiografButton from '@/components/custom/BiografButton';
import {
  BiografCol,
  BiografContainer,
  BiografRow,
} from '@/components/custom/BiografContainer';
import { Separator } from '@/components/ui/separator';

export default function ProfilePage() {
  const { data: meData, isLoading } = useGetMe();
  const logout = useLogout();
  const navigate = useNavigate();
  const user = meData?.data;
  const { data: bookings } = useMyBookings();

  if (isLoading) {
    return (
      <BiografContainer className="flex justify-center py-20 text-[#7b6738]">
        Loading...
      </BiografContainer>
    );
  }

  if (!user) {
    navigate('/login?redirect=/profile');
    return null;
  }

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => navigate('/'),
    });
  };

  return (
    <BiografCol
      xs={12}
      sm={8}
      md={6}
      lg={4}
      className="mx-auto mt-12 flex max-w-2xl flex-col gap-6"
    >
      <BiografRow className="justify-center">
        <BiografCol className="flex flex-col items-center gap-4">
          <BiografContainer className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#B69852] bg-[#141414]">
            <User className="h-10 w-10 text-[#F3EEE4]" />
          </BiografContainer>
          <h1 className="text-2xl font-bold text-[#F3EEE4]">
            {user.firstName} {user.lastName}
          </h1>
          <span className="text-sm text-[#7b6738]">{user.role}</span>
        </BiografCol>
      </BiografRow>

      <Separator className="bg-[#B69852]/30" />

      <BiografRow>
        <BiografCol className="flex flex-col gap-4">
          <BiografRow className="justify-between">
            <BiografCol className="text-sm text-[#7b6738]">Email</BiografCol>
            <BiografCol className="text-right text-sm text-[#F3EEE4]">
              {user.email}
            </BiografCol>
          </BiografRow>
          {user.phone && (
            <BiografRow className="justify-between">
              <BiografCol className="text-sm text-[#7b6738]">Phone</BiografCol>
              <BiografCol className="text-right text-sm text-[#F3EEE4]">
                {user.phone}
              </BiografCol>
            </BiografRow>
          )}
        </BiografCol>
      </BiografRow>
      <div>
        <h2>Mina bokningar</h2>
        {(bookings as any)?.data?.map((b: any) => (
          <div key={b.id}>
            <p>
              Screening: {b.screeningId}, Datum: {b.screeningDate}, Pris:{' '}
              {b.total_price} kr, Status: {b.status}, Ref: {b.bookingReference}
            </p>
          </div>
        ))}
      </div>
      <Separator className="bg-[#B69852]/30" />

      <BiografButton
        variant="default"
        onClick={handleLogout}
        disabled={logout.isPending}
      >
        {logout.isPending ? 'Logging out...' : 'Log out'}
      </BiografButton>
    </BiografCol>
  );
}
