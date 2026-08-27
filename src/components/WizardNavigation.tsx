'use client';

import { Button } from './Button';

interface WizardNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
  submitting?: boolean;
  /** Href for the Cancel link. Defaults to the dashboard's models page. */
  cancelHref?: string;
}

export function WizardNavigation({ currentStep, totalSteps, onNext, onPrev, onSubmit, submitting, cancelHref = '/dashboard/models' }: WizardNavigationProps) {
  return (
    <div className="mt-6 flex justify-between items-center">
      <div>
        {currentStep > 1 && (
          <button
            type="button"
            onClick={onPrev}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 border border-purple-300 rounded-lg hover:bg-purple-100 transition-colors"
          >
            ← Previous Step
          </button>
        )}
      </div>

      <div className="flex gap-3">
        <a
          href={cancelHref}
          className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
        >
          Cancel
        </a>

        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={onNext}
            className="flex items-center gap-2 px-6 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-lg hover:bg-purple-700 transition-colors"
          >
            Next Step →
          </button>
        ) : (
          <Button
            type="button"
            onClick={onSubmit}
            disabled={!!submitting}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Submitting…' : '🚀 Generate Fine-Tuning Pipeline'}
          </Button>
        )}
      </div>
    </div>
  );
}
