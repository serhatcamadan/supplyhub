import { cn } from '@/lib/utils'

interface StepIndicatorProps {
  totalSteps: number
  currentStep: number
}

export function StepIndicator({ totalSteps, currentStep }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-4">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center gap-4">
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-300',
              currentStep >= step
                ? 'bg-primary text-on-primary'
                : 'bg-surface-container text-on-surface-variant'
            )}
          >
            <span className="text-xs font-semibold">{step}</span>
          </div>
          {step < totalSteps && (
            <div
              className={cn(
                'w-12 h-0.5 transition-colors duration-300',
                currentStep > step ? 'bg-primary' : 'bg-surface-container'
              )}
            />
          )}
        </div>
      ))}
    </div>
  )
}
