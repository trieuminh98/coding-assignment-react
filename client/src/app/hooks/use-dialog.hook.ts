import { useState } from 'react';

export const useDialog = () => {
  const [open, setOpen] = useState(false);

  const onCloseDialog = () => {
    setOpen(false);
  };

  const onOpenDialog = () => {
    setOpen(true);
  };

  return { open, onCloseDialog, onOpenDialog };
};
