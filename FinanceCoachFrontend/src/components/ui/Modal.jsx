import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@radix-ui/react-dialog";

export function Modal({
  isOpen,
  onOpenChange,
  trigger,
  title,
  children,
  description,
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-md bg-white p-6 shadow-lg">
          {/* Use div instead of DialogHeader */}
          <div className="mb-4">
            <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
            {description && (
              <DialogDescription className="mt-1 text-sm text-gray-500">
                {description}
              </DialogDescription>
            )}
          </div>

          <div className="mt-4">{children}</div>

          <DialogClose asChild>
            <button className="mt-6 inline-flex justify-center rounded-md border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200">
              Close
            </button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
