/**
 * @file ConfirmDialog.tsx
 * @description Reusable confirmation dialog built on top of the shared AlertDialog
 * UI primitives. Supports both destructive (red) and default (primary green)
 * action variants, optional leading icon with themed background, and flexible
 * content slots for warnings or previews.
 *
 * Usage modes:
 *  1. **Trigger mode** — pass a `trigger` ReactNode; the dialog opens when clicked.
 *  2. **Controlled mode** — pass `open` / `onOpenChange` for programmatic control.
 *
 * @example
 * // Trigger mode (destructive)
 * <ConfirmDialog
 *   trigger={<button>Delete</button>}
 *   title="Delete Item?"
 *   description="This action cannot be undone."
 *   confirmLabel="Yes, Delete"
 *   variant="destructive"
 *   onConfirm={handleDelete}
 * />
 *
 * @example
 * // Controlled mode with icon
 * <ConfirmDialog
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   title="Remove Participant?"
 *   description={<>Are you sure you want to remove <strong>John</strong>?</>}
 *   icon={<Trash2 className="w-6 h-6" />}
 *   iconVariant="destructive"
 *   confirmLabel="Remove"
 *   variant="destructive"
 *   onConfirm={handleRemove}
 * >
 *   <WarningBanner />
 * </ConfirmDialog>
 */

import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/app/components/ui/alert-dialog';
import { cn } from '@/app/components/ui/utils';

// ---------------------------------------------------------------------------
// Icon wrapper variant styles
// ---------------------------------------------------------------------------

const ICON_VARIANT_STYLES = {
  destructive: 'bg-[#fef2f2] text-[#ef4444]',
  warning: 'bg-[#fffbeb] text-[#d97706]',
  info: 'bg-[#def2ee] text-[#177564]',
} as const;

// ---------------------------------------------------------------------------
// Confirm button variant styles
// ---------------------------------------------------------------------------

const ACTION_VARIANT_STYLES = {
  destructive: 'bg-red-600 hover:bg-red-700 text-white',
  default: 'bg-[#177564] hover:bg-[#136354] text-white',
} as const;

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

export interface ConfirmDialogProps {
  /** Controlled open state. */
  open?: boolean;
  /** Controlled open-state handler. */
  onOpenChange?: (open: boolean) => void;

  /** Uncontrolled trigger element — clicking it opens the dialog. */
  trigger?: React.ReactNode;

  /** Dialog title. */
  title: string;
  /** Dialog description — can be a string or rich JSX. */
  description: React.ReactNode;

  /**
   * Optional icon rendered above the title inside a circular badge.
   * Pass a Lucide icon element, e.g. `<Trash2 className="w-6 h-6" />`.
   */
  icon?: React.ReactNode;
  /** Visual variant for the icon badge. Defaults to `'destructive'`. */
  iconVariant?: keyof typeof ICON_VARIANT_STYLES;

  /** Label for the confirm/action button. Defaults to `'Confirm'`. */
  confirmLabel?: string;
  /** Label for the cancel button. Defaults to `'Cancel'`. */
  cancelLabel?: string;
  /** Visual variant for the confirm button. Defaults to `'destructive'`. */
  variant?: keyof typeof ACTION_VARIANT_STYLES;

  /** Callback fired when the user clicks the confirm button. */
  onConfirm: () => void;

  /**
   * Optional extra content rendered between the description and the
   * footer buttons — useful for warnings, previews, etc.
   */
  children?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ConfirmDialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  icon,
  iconVariant = 'destructive',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'destructive',
  onConfirm,
  children,
}: ConfirmDialogProps) {
  const hasIcon = !!icon;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}

      <AlertDialogContent>
        <AlertDialogHeader
          className={cn(hasIcon && 'items-center text-center sm:text-center')}
        >
          {/* Icon badge */}
          {hasIcon && (
            <div
              className={cn(
                'w-14 h-14 rounded-full flex items-center justify-center mb-1',
                ICON_VARIANT_STYLES[iconVariant],
              )}
            >
              {icon}
            </div>
          )}

          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="text-muted-foreground text-sm">{description}</div>
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* Extra content slot (warnings, previews, etc.) */}
        {children}

        <AlertDialogFooter>
          <AlertDialogCancel>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(ACTION_VARIANT_STYLES[variant])}
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}