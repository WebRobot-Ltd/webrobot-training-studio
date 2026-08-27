'use client';

import { FineTuningWizardData } from '../ModelFineTuningWizard';

interface Step1ModelSelectionProps {
  data: FineTuningWizardData;
  onUpdate: (updates: Partial<FineTuningWizardData>) => void;
}

export function Step1ModelSelection({ data, onUpdate }: Step1ModelSelectionProps) {
  const baseModels = [
    { id: 'llama-3-8b', name: 'Llama 3 8B', type: 'llm' },
    { id: 'llama-3-70b', name: 'Llama 3 70B', type: 'llm' },
    { id: 'mistral-7b', name: 'Mistral 7B', type: 'llm' },
    { id: 'phi-3', name: 'Phi-3', type: 'llm' },
    { id: 'bert-base', name: 'BERT Base', type: 'embedding' },
    { id: 'sentence-transformers', name: 'Sentence Transformers', type: 'embedding' },
    { id: 'custom', name: 'Custom Model', type: 'custom' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Step 1: Model Selection</h2>
        <p className="mt-1 text-sm text-gray-600">
          Choose the base model you want to fine-tune and provide basic information
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {(['llm', 'embedding', 'classification', 'custom'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onUpdate({ modelType: type })}
                className={`p-3 rounded-lg border-2 transition-colors ${
                  data.modelType === type
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-sm font-medium capitalize">{type}</div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Base Model
          </label>
          <select
            value={data.baseModel}
            onChange={(e) => onUpdate({ baseModel: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select a base model...</option>
            {baseModels
              .filter((m) => data.modelType === 'custom' || m.type === data.modelType || m.type === 'llm')
              .map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
          </select>
        </div>

        {data.baseModel === 'custom' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Model Path/URL
            </label>
            <input
              type="text"
              placeholder="e.g., huggingface.co/model-name or local path"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={data.modelName}
            onChange={(e) => onUpdate({ modelName: e.target.value })}
            placeholder="e.g., my-fine-tuned-llama"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model Description
          </label>
          <textarea
            value={data.modelDescription}
            onChange={(e) => onUpdate({ modelDescription: e.target.value })}
            placeholder="Describe what this fine-tuned model will do..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>
    </div>
  );
}























