'use client';

import { FineTuningWizardData } from '../ModelFineTuningWizard';

interface Step8ReviewProps {
  data: FineTuningWizardData;
  onSubmit: () => void;
}

export function Step8Review({ data, onSubmit }: Step8ReviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Step 8: Review & Generate</h2>
        <p className="mt-1 text-sm text-gray-600">
          Review your configuration and generate the complete fine-tuning pipeline
        </p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Model Configuration</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Model Name:</span>
              <span className="font-medium">{data.modelName || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Model Type:</span>
              <span className="font-medium capitalize">{data.modelType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Base Model:</span>
              <span className="font-medium">{data.baseModel || 'Not set'}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Data Source</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Source Type:</span>
              <span className="font-medium capitalize">{data.dataSourceType}</span>
            </div>
            {data.selectedDatasetId && (
              <div className="flex justify-between">
                <span className="text-gray-600">Dataset ID:</span>
                <span className="font-medium">{data.selectedDatasetId}</span>
              </div>
            )}
            {data.pipelineTemplate.selectedAgentId && (
              <div className="flex justify-between">
                <span className="text-gray-600">Agent ID:</span>
                <span className="font-medium">{data.pipelineTemplate.selectedAgentId}</span>
              </div>
            )}
            {data.pipelineTemplate.selectedProjectId && (
              <div className="flex justify-between">
                <span className="text-gray-600">Project ID:</span>
                <span className="font-medium">{data.pipelineTemplate.selectedProjectId}</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">ETL Pipeline</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Enabled:</span>
              <span className="font-medium">{data.etlPipeline.enabled ? 'Yes' : 'No'}</span>
            </div>
            {data.etlPipeline.enabled && (
              <>
                <div className="flex justify-between">
                  <span className="text-gray-600">Output Format:</span>
                  <span className="font-medium uppercase">{data.etlPipeline.outputFormat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transformations:</span>
                  <span className="font-medium">{data.etlPipeline.transformations.length}</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Training Configuration</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Epochs:</span>
              <span className="font-medium">{data.trainingConfig.epochs}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Learning Rate:</span>
              <span className="font-medium">{data.trainingConfig.learningRate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Batch Size:</span>
              <span className="font-medium">{data.trainingConfig.batchSize}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Validation Split:</span>
              <span className="font-medium">{data.trainingConfig.validationSplit}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 mb-3">AI Provider</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Provider:</span>
              <span className="font-medium capitalize">{data.aiProvider.provider}</span>
            </div>
          </div>
        </div>

        {data.huggingFace.enabled && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Hugging Face</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Repository:</span>
                <span className="font-medium">{data.huggingFace.repositoryName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium capitalize">{data.huggingFace.repositoryType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Private:</span>
                <span className="font-medium">{data.huggingFace.private ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>
        )}

        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <h4 className="font-semibold text-green-800 mb-2">What will be generated:</h4>
          <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
            <li>Complete ETL pipeline YAML for training set preparation</li>
            <li>Training configuration file with all hyperparameters</li>
            <li>TogetherAI integration code for model training</li>
            {data.huggingFace.enabled && (
              <li>Hugging Face publishing script and configuration</li>
            )}
            <li>Project and agent setup for automated fine-tuning workflow</li>
          </ul>
        </div>
      </div>
    </div>
  );
}


