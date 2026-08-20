import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { IoClose } from "react-icons/io5";


export function Modal({
  open,
  onClose,
  title,
  children,
  className = "w-full max-w-4xl",
}: {
  open: boolean;
  onClose: () => void;

  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else if (!open && dialog.open) {
      dialog.close();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      aria-label={title}
      onClose={onClose}
      onCancel={onClose}

      onClick={(event) => {
        if (event.target === dialogRef.current) onClose();
      }}
      className="max-h-[90dvh] w-full max-w-none bg-transparent p-0 backdrop:bg-black/80 open:flex open:items-center open:justify-center"
    >
      {}
      {open && (
        <div className={`relative mx-auto ${className} p-4`}>
          <button
            type="button"
            onClick={onClose}
            aria-label={`Close ${title}`}
            className="absolute right-6 top-6 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-gray-900/90 text-white transition hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-light-blue-400"
          >
            <IoClose className="h-5 w-5" aria-hidden="true" />
          </button>
          {children}
        </div>
      )}
    </dialog>,
    document.body,
  );
}
