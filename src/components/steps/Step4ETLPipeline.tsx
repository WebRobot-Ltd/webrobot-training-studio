'use client';

import { FineTuningWizardData } from '../ModelFineTuningWizard';

interface Step4ETLPipelineProps {
  data: FineTuningWizardData;
  onUpdate: (updates: Partial<FineTuningWizardData>) => void;
}

export function Step4ETLPipeline({ data, onUpdate }: Step4ETLPipelineProps) {
  const addTransformation = (type: 'filter' | 'map' | 'aggregate' | 'join' | 'custom') => {
    const newTransform = {
      type,
      config: {},
    };
    onUpdate({
      etlPipeline: {
        ...data.etlPipeline,
        transformations: [...data.etlPipeline.transformations, newTransform],
      },
    });
  };

  const removeTransformation = (index: number) => {
    const newTransforms = data.etlPipeline.transformations.filter((_, i) => i !== index);
    onUpdate({
      etlPipeline: {
        ...data.etlPipeline,
        transformations: newTransforms,
      },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Step 4: ETL Pipeline Configuration</h2>
        <p className="mt-1 text-sm text-gray-600">
          Configure the data transformation pipeline to prepare your training dataset
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Enable ETL Pipeline
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Generate a complete ETL pipeline to process and prepare your training data
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={data.etlPipeline.enabled}
              onChange={(e) => onUpdate({
                etlPipeline: {
                  ...data.etlPipeline,
                  enabled: e.target.checked,
                },
              })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </label>
        </div>

        {data.etlPipeline.enabled && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Output Format
              </label>
              <select
                value={data.etlPipeline.outputFormat}
                onChange={(e) => onUpdate({
                  etlPipeline: {
                    ...data.etlPipeline,
                    outputFormat: e.target.value as 'jsonl' | 'csv' | 'parquet',
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="jsonl">JSONL (JSON Lines) - Recommended for LLM training</option>
                <option value="csv">CSV</option>
                <option value="parquet">Parquet</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Output Path (optional)
              </label>
              <input
                type="text"
                value={data.etlPipeline.outputPath || ''}
                onChange={(e) => onUpdate({
                  etlPipeline: {
                    ...data.etlPipeline,
                    outputPath: e.target.value,
                  },
                })}
                placeholder="s3://bucket/path or local path"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Data Transformations
                </label>
                <div className="flex gap-2">
                  {(['filter', 'map', 'aggregate', 'join', 'custom'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => addTransformation(type)}
                      className="px-3 py-1 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded hover:bg-purple-100"
                    >
                      + {type}
                    </button>
                  ))}
                </div>
              </div>

              {data.etlPipeline.transformations.length === 0 ? (
                <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center text-sm text-gray-500">
                  No transformations added. Click the buttons above to add transformation steps.
                </div>
              ) : (
                <div className="space-y-2">
                  {data.etlPipeline.transformations.map((transform, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-700 rounded">
                          {transform.type}
                        </span>
                        <span className="text-sm text-gray-600">
                          Transformation {index + 1}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeTransformation(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>💡 Tip:</strong> The ETL pipeline will be automatically generated as a YAML configuration
                that can be used with your WebRobot ETL system. This pipeline will process your data source
                and output a training-ready dataset in the specified format.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}


