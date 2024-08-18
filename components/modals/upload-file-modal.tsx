"use client";

import { Dialog, DialogContent } from "../ui/dialog";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function UploadFileModal({
  isOpen,
  onClose,
  children,
}: ModalProps) {
  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onChange}>
      <DialogContent className="max-w-4xl h-96">
        <div className="py-10">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
