import { useEffect, useState } from 'react';

import { onAuthRequired } from '@/api/authEvents';
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog';
import { useTranslation } from 'react-i18next';

import { DialogHeader } from '../ui/dialog';
import LoginForm from './LoginForm';

export default function LoginModal() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    onAuthRequired(() => setOpen(true));
  }, []);

  const handleSuccess = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="border-[#7b6738] bg-black">
        <DialogHeader>
          <DialogTitle className="text-[#F3EEE4]">
            {t('auth:session.expired')}
          </DialogTitle>
        </DialogHeader>
        <LoginForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
