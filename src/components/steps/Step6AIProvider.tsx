'use client';

import { useState, useEffect } from 'react';
import { FineTuningWizardData } from '../ModelFineTuningWizard';
import { listTogetherAiCredentials } from '../../client';

interface Step6AIProviderProps {
  data: FineTuningWizardData;
  onUpdate: (updates: Partial<FineTuningWizardData>) => void;
}

export function Step6AIProvider({ data, onUpdate }: Step6AIProviderProps) {
  const [credentials, setCredentials] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      setLoading(true);
      const result = await listTogetherAiCredentials();
      setCredentials(result);
    } catch (error) {
      console.error('Error loading credentials:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Step 6: AI Provider Integration</h2>
        <p className="mt-1 text-sm text-gray-600">
          Configure TogetherAI integration for model training and inference
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AI Provider
          </label>
          <select
            value={data.aiProvider.provider}
            onChange={(e) => onUpdate({
              aiProvider: {
                ...data.aiProvider,
                provider: e.target.value as 'togetherai' | 'openai' | 'runpod' | 'anthropic',
              },
            })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="togetherai">TogetherAI (Recommended — managed fine-tune)</option>
            <option value="openai">OpenAI (managed fine-tune)</option>
            <option value="runpod">Runpod (GPU Pod orchestrator — axolotl LoRA → push to HF)</option>
            <option value="anthropic" disabled>Anthropic (no public fine-tune API)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Credential (optional - will use default if not selected)
          </label>
          {loading ? (
            <div className="text-sm text-gray-500">Loading credentials...</div>
          ) : (
            <select
              value={data.aiProvider.apiKey || ''}
              onChange={(e) => onUpdate({
                aiProvider: {
                  ...data.aiProvider,
                  apiKey: e.target.value,
                },
              })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Use default credential</option>
              {credentials.map((cred) => (
                <option key={cred.id} value={cred.apiKey || cred.attributes?.apiKey}>
                  {cred.name || cred.attributes?.name || `Credential ${cred.id}`}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Endpoint (optional)
          </label>
          <input
            type="text"
            value={data.aiProvider.endpoint || ''}
            onChange={(e) => onUpdate({
              aiProvider: {
                ...data.aiProvider,
                endpoint: e.target.value,
              },
            })}
            placeholder="https://api.together.xyz (default for TogetherAI)"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Model Endpoint (optional)
          </label>
          <input
            type="text"
            value={data.aiProvider.modelEndpoint || ''}
            onChange={(e) => onUpdate({
              aiProvider: {
                ...data.aiProvider,
                modelEndpoint: e.target.value,
              },
            })}
            placeholder="Leave empty to use base model endpoint"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>🔌 Integration:</strong> The wizard will generate integration code that connects
            your ETL pipeline with TogetherAI for model training. The training will be executed
            using the configured credentials and settings.
          </p>
        </div>
      </div>
    </div>
  );
}
