'use client';

import { FineTuningWizardData } from '../ModelFineTuningWizard';

interface Step5TrainingConfigProps {
  data: FineTuningWizardData;
  onUpdate: (updates: Partial<FineTuningWizardData>) => void;
}

export function Step5TrainingConfig({ data, onUpdate }: Step5TrainingConfigProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Step 5: Training Configuration</h2>
        <p className="mt-1 text-sm text-gray-600">
          Configure hyperparameters and training settings for your model
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Epochs
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={data.trainingConfig.epochs}
            onChange={(e) => onUpdate({
              trainingConfig: {
                ...data.trainingConfig,
                epochs: parseInt(e.target.value) || 3,
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="mt-1 text-xs text-gray-500">Number of training epochs (1-100)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Learning Rate
          </label>
          <input
            type="number"
            step="0.0001"
            min="0.00001"
            max="0.1"
            value={data.trainingConfig.learningRate}
            onChange={(e) => onUpdate({
              trainingConfig: {
                ...data.trainingConfig,
                learningRate: parseFloat(e.target.value) || 0.0001,
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="mt-1 text-xs text-gray-500">Learning rate (e.g., 0.0001)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Batch Size
          </label>
          <input
            type="number"
            min="1"
            max="128"
            value={data.trainingConfig.batchSize}
            onChange={(e) => onUpdate({
              trainingConfig: {
                ...data.trainingConfig,
                batchSize: parseInt(e.target.value) || 4,
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="mt-1 text-xs text-gray-500">Batch size (1-128)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Validation Split
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="0.5"
            value={data.trainingConfig.validationSplit}
            onChange={(e) => onUpdate({
              trainingConfig: {
                ...data.trainingConfig,
                validationSplit: parseFloat(e.target.value) || 0.2,
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <p className="mt-1 text-xs text-gray-500">Validation split ratio (0-0.5)</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Hyperparameters (JSON)
        </label>
        <textarea
          value={JSON.stringify(data.trainingConfig.hyperparameters, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              onUpdate({
                trainingConfig: {
                  ...data.trainingConfig,
                  hyperparameters: parsed,
                },
              });
            } catch (err) {
              // Invalid JSON, ignore
            }
          }}
          placeholder='{"warmup_steps": 100, "weight_decay": 0.01, ...}'
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Optional: Add custom hyperparameters as JSON (e.g., warmup_steps, weight_decay, etc.)
        </p>
      </div>

      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>⚠️ Note:</strong> These settings will be used when training your model with TogetherAI.
          Adjust based on your dataset size and computational resources.
        </p>
      </div>
    </div>
  );
}


