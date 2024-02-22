import {
  DialogTitle,
  Dialog as MDialog,
  DialogProps as MDialogProps,
} from '@mui/material';
import { ReactNode } from 'react';

type DialogProps = {
  children: ReactNode;
  handleClose: () => void;
  title: string;
} & MDialogProps;
const Dialog = ({ handleClose, children, open, title }: DialogProps) => {
  return (
    <MDialog
      PaperProps={{
        sx: {
          p: 4,
        },
      }}
      onClose={handleClose}
      open={open}
    >
      <DialogTitle sx={{ px: 0 }}>{title}</DialogTitle>
      {children}
    </MDialog>
  );
};

export default Dialog;
