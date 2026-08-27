'use client';

import { useState, useEffect } from 'react';
import { FineTuningWizardData } from '../ModelFineTuningWizard';
import { listDatasets } from '../../client';

interface Step2DataSourceProps {
  data: FineTuningWizardData;
  onUpdate: (updates: Partial<FineTuningWizardData>) => void;
}

export function Step2DataSource({ data, onUpdate }: Step2DataSourceProps) {
  const [datasets, setDatasets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data.dataSourceType === 'dataset') {
      loadDatasets();
    }
  }, [data.dataSourceType]);

  const loadDatasets = async () => {
    try {
      setLoading(true);
      const result = await listDatasets();
      setDatasets(result);
    } catch (error) {
      console.error('Error loading datasets:', error);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Step 2: Data Source</h2>
        <p className="mt-1 text-sm text-gray-600">
          Select where your training data comes from
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Data Source Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(['dataset', 'external'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => onUpdate({ dataSourceType: type })}
                className={`p-3 rounded-lg border-2 transition-colors capitalize ${
                  data.dataSourceType === type
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {type === 'external' ? 'External URL' : 'Dataset'}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Select the raw data source for training. You can use an existing Agent or Project as a pipeline template in the next step.
          </p>
        </div>

        {data.dataSourceType === 'dataset' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Dataset
            </label>
            {loading ? (
              <div className="text-sm text-gray-500">Loading datasets...</div>
            ) : (
              <select
                value={data.selectedDatasetId || ''}
                onChange={(e) => onUpdate({ selectedDatasetId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select a dataset...</option>
                {datasets.map((dataset) => (
                  <option key={dataset.id} value={dataset.id}>
                    {dataset.name || dataset.attributes?.name || `Dataset ${dataset.id}`}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}


        {data.dataSourceType === 'external' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                External Data URL
              </label>
              <input
                type="url"
                value={data.externalDataSource?.url || ''}
                onChange={(e) => onUpdate({
                  externalDataSource: {
                    ...data.externalDataSource,
                    url: e.target.value,
                  },
                })}
                placeholder="https://example.com/data.json"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Format
              </label>
              <select
                value={data.externalDataSource?.format || 'json'}
                onChange={(e) => onUpdate({
                  externalDataSource: {
                    ...data.externalDataSource,
                    format: e.target.value as 'json' | 'csv' | 'parquet',
                  },
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="json">JSON</option>
                <option value="csv">CSV</option>
                <option value="parquet">Parquet</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
