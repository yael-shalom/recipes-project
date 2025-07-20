import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

export default function ConfirmDeleteDialog({ open, onClose, onConfirm, recipeName }) {
  const handleDialogClose = (ev) => {
    ev.stopPropagation();
    onClose();
  };
  const handleConfirmDelete = (ev) => {
    ev.stopPropagation();
    onConfirm();
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} aria-labelledby="confirm-delete-dialog-title">
      <DialogTitle sx={{ color: 'var(--primary-color)' }}>אישור מחיקה</DialogTitle>
      <DialogContent>
        האם אתה בטוח שברצונך למחוק את המתכון "{recipeName}"?
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDialogClose} color="inherit">ביטול</Button>
        <Button onClick={handleConfirmDelete} sx={{ color: 'var(--primary-color)' }}>מחק</Button>
      </DialogActions>
    </Dialog>
  );
}