'use client';

import { useState } from 'react';
import { FineTuningWizardData } from '../ModelFineTuningWizard';
import { validateHfToken } from '../../client';

interface Step7HuggingFaceProps {
  data: FineTuningWizardData;
  onUpdate: (updates: Partial<FineTuningWizardData>) => void;
}

interface ValidationState {
  status: 'idle' | 'validating' | 'ok' | 'error';
  message?: string;
  username?: string;
  type?: 'user' | 'org';
  orgs?: string[];
}

export function Step7HuggingFace({ data, onUpdate }: Step7HuggingFaceProps) {
  const [tags, setTags] = useState<string[]>(data.huggingFace.tags || []);
  const [validation, setValidation] = useState<ValidationState>({ status: 'idle' });

  const validateToken = async () => {
    const token = (data.huggingFace.token || '').trim();
    if (!token) {
      setValidation({ status: 'error', message: 'Enter a token first.' });
      return;
    }
    setValidation({ status: 'validating' });
    try {
      const { ok, status, body: j } = await validateHfToken(token);
      if (!ok || !j?.valid) {
        setValidation({
          status: 'error',
          message: j?.error || `HTTP ${status}`,
        });
        return;
      }
      setValidation({
        status: 'ok',
        username: j.name,
        type: j.type,
        orgs: j.orgs ?? [],
      });
    } catch (e: any) {
      setValidation({ status: 'error', message: e?.message || 'Network error' });
    }
  };

  const addTag = (tag: string) => {
    if (tag && !tags.includes(tag)) {
      const newTags = [...tags, tag];
      setTags(newTags);
      onUpdate({
        huggingFace: {
          ...data.huggingFace,
          tags: newTags,
        },
      });
    }
  };

  const removeTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    onUpdate({
      huggingFace: {
        ...data.huggingFace,
        tags: newTags,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Step 7: Hugging Face Publishing</h2>
        <p className="mt-1 text-sm text-gray-600">
          Configure publishing settings for your fine-tuned model on Hugging Face
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Enable Hugging Face Publishing
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Automatically publish your fine-tuned model to Hugging Face Hub
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.huggingFace.enabled}
              onChange={(e) => onUpdate({
                huggingFace: {
                  ...data.huggingFace,
                  enabled: e.target.checked,
                },
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {data.huggingFace.enabled && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repository Name <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">huggingface.co/</span>
                <input
                  type="text"
                  value={data.huggingFace.repositoryName}
                  onChange={(e) => onUpdate({
                    huggingFace: {
                      ...data.huggingFace,
                      repositoryName: e.target.value,
                    },
                  })}
                  placeholder="username/model-name"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Format: username/model-name (e.g., myorg/my-fine-tuned-llama)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repository Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="model"
                    checked={data.huggingFace.repositoryType === 'model'}
                    onChange={(e) => onUpdate({
                      huggingFace: {
                        ...data.huggingFace,
                        repositoryType: 'model',
                      },
                    })}
                    className="mr-2"
                  />
                  <span>Model</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="dataset"
                    checked={data.huggingFace.repositoryType === 'dataset'}
                    onChange={(e) => onUpdate({
                      huggingFace: {
                        ...data.huggingFace,
                        repositoryType: 'dataset',
                      },
                    })}
                    className="mr-2"
                  />
                  <span>Dataset</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hugging Face Token
              </label>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={data.huggingFace.token || ''}
                  onChange={(e) => {
                    onUpdate({
                      huggingFace: {
                        ...data.huggingFace,
                        token: e.target.value,
                      },
                    });
                    if (validation.status !== 'idle') setValidation({ status: 'idle' });
                  }}
                  placeholder="hf_xxxxxxxxxxxxx"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={validateToken}
                  disabled={validation.status === 'validating' || !data.huggingFace.token}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm whitespace-nowrap"
                >
                  {validation.status === 'validating' ? 'Validating…' : 'Validate token'}
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Personal access token with <strong>write</strong> scope (created at{' '}
                <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                  huggingface.co/settings/tokens
                </a>). The token is sent to the API only at submit — we never persist it.
              </p>
              {validation.status === 'ok' && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                  ✓ Logged in as <strong>{validation.username}</strong> ({validation.type})
                  {validation.orgs && validation.orgs.length > 0 && (
                    <> · member of {validation.orgs.length} org{validation.orgs.length === 1 ? '' : 's'}: {validation.orgs.join(', ')}</>
                  )}
                </div>
              )}
              {validation.status === 'error' && (
                <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                  ✗ {validation.message}
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={data.huggingFace.private}
                onChange={(e) => onUpdate({
                  huggingFace: {
                    ...data.huggingFace,
                    private: e.target.checked,
                  },
                })}
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-700">
                Make repository private
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={data.huggingFace.description || ''}
                onChange={(e) => onUpdate({
                  huggingFace: {
                    ...data.huggingFace,
                    description: e.target.value,
                  },
                })}
                placeholder="Describe your fine-tuned model..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-purple-500 hover:text-purple-700"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                placeholder="Add a tag and press Enter"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag(e.currentTarget.value.trim());
                    e.currentTarget.value = '';
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Press Enter to add tags (e.g., nlp, fine-tuning, llm)
              </p>
            </div>
          </>
        )}

        {!data.huggingFace.enabled && (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600">
              You can skip Hugging Face publishing and publish your model manually later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
