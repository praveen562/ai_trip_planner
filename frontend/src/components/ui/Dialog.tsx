import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import type { ButtonVariant } from './Button';
import { cn } from '../../utils/cn';

export interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  confirmVariant?: ButtonVariant;
  isConfirming?: boolean;
  tone?: 'neutral' | 'danger';
}

/**
 * Confirmation-style prompt (delete trip, discard changes, sign out).
 * For anything richer than a title/description/two-buttons, reach for
 * Modal directly instead of stretching this component to fit.
 */
export function Dialog({
  isOpen,
  onClose,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  confirmVariant = 'primary',
  isConfirming = false,
  tone = 'neutral'
}: DialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-start gap-4">
        {tone === 'danger' && (
          <div className="flex size-11 items-center justify-center rounded-full bg-error/10 text-error">
            <AlertTriangle className="size-5" />
          </div>
        )}

        <div>
          <h2 className={cn('font-display text-xl font-semibold text-dark')}>{title}</h2>
          {description && <p className="mt-1.5 text-sm text-gray-500">{description}</p>}
        </div>

        <div className="mt-2 flex w-full justify-end gap-3">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isConfirming}>
            {cancelLabel}
          </Button>
          {onConfirm && (
            <Button
              variant={tone === 'danger' ? 'danger' : confirmVariant}
              size="sm"
              onClick={onConfirm}
              isLoading={isConfirming}
            >
              {confirmLabel}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}
