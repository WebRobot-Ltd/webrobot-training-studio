'use client';

interface WizardProgressProps {
  currentStep: number;
  totalSteps: number;
  onStepChange: (step: number) => void;
}

export function WizardProgress({ currentStep, totalSteps, onStepChange }: WizardProgressProps) {
  const steps = [
    { step: 1, label: 'Model', icon: '🤖', desc: 'Select base model' },
    { step: 2, label: 'Data Source', icon: '📊', desc: 'Choose training data' },
    { step: 3, label: 'ETL Pipeline', icon: '⚙️', desc: 'Generate data pipeline' },
    { step: 4, label: 'Training', icon: '🎓', desc: 'Configure training' },
    { step: 5, label: 'AI Provider', icon: '🔌', desc: 'Setup TogetherAI' },
    { step: 6, label: 'Publishing', icon: '📤', desc: 'Hugging Face setup' },
    { step: 7, label: 'Review', icon: '✅', desc: 'Review & generate' }
  ];

  const getCurrentStepDescription = (step: number) => {
    switch (step) {
      case 1:
        return 'Select the base model you want to fine-tune and configure basic model information';
      case 2:
        return 'Choose your data source: existing dataset, agent output, project data, or external source';
      case 3:
        return 'Generate and configure the ETL pipeline to prepare your training dataset';
      case 4:
        return 'Configure training hyperparameters: epochs, learning rate, batch size, and more';
      case 5:
        return 'Set up TogetherAI integration for model training and inference';
      case 6:
        return 'Configure Hugging Face repository for model publishing and sharing';
      default:
        return 'Review your complete fine-tuning configuration and generate the pipeline';
    }
  };

  return (
    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-purple-800">🎯 Model Fine-Tuning Pipeline</h3>
        <div className="text-sm text-purple-600">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      <div className="flex items-center space-x-2 mb-3 overflow-x-auto pb-2">
        {steps.map((item, index) => (
          <div key={item.step} className="flex items-center flex-shrink-0">
            <button
              type="button"
              onClick={() => onStepChange(item.step)}
              disabled={item.step > currentStep + 1}
              className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                currentStep >= item.step
                  ? 'bg-purple-500 text-white shadow-md'
                  : item.step === currentStep + 1
                  ? 'bg-purple-100 text-purple-600 border-2 border-purple-300 hover:bg-purple-200'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              title={item.desc}
            >
              {currentStep > item.step ? '✓' : item.icon}
            </button>
            <div className="ml-2 text-xs">
              <div className={`font-medium ${currentStep >= item.step ? 'text-purple-700' : 'text-gray-500'}`}>
                {item.label}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-6 h-0.5 mx-2 ${
                currentStep > item.step ? 'bg-purple-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      <div className="text-sm text-purple-700 bg-purple-100 rounded-md p-3">
        💡 <strong>Current Step:</strong> {getCurrentStepDescription(currentStep)}
      </div>
    </div>
  );
}
