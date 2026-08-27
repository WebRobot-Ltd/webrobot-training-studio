'use client';

// Training Studio — Model Fine-Tuning Wizard. Author a complete fine-tuning plan across 8 steps:
// base model → data source (existing dataset or external URL) → optional pipeline template →
// ETL pipeline → training hyperparameters → AI provider (TogetherAI/OpenAI/Runpod) →
// Hugging Face publishing → review & submit. Ported from the WebRobot dashboard; only the app
// couplings are removed: API calls go through the injected client (configureTrainingStudio),
// the JWT comes from that client's token provider, and navigation after submit is delegated to
// the host via onJobCreated (defaulting to same-app navigation).

import { useState } from 'react';
import { WizardProgress } from './WizardProgress';
import { WizardNavigation } from './WizardNavigation';
import { Step1ModelSelection } from './steps/Step1ModelSelection';
import { Step2DataSource } from './steps/Step2DataSource';
import { Step3PipelineTemplate } from './steps/Step3PipelineTemplate';
import { Step4ETLPipeline } from './steps/Step4ETLPipeline';
import { Step5TrainingConfig } from './steps/Step5TrainingConfig';
import { Step6AIProvider } from './steps/Step6AIProvider';
import { Step7HuggingFace } from './steps/Step7HuggingFace';
import { Step8Review } from './steps/Step8Review';
import { createFineTuningJob } from '../client';

export interface FineTuningWizardData {
  // Step 1: Model Selection
  baseModel: string;
  modelType: 'llm' | 'embedding' | 'classification' | 'custom';
  modelName: string;
  modelDescription: string;

  // Step 2: Data Source (only raw data sources)
  dataSourceType: 'dataset' | 'external';
  selectedDatasetId?: string;
  externalDataSource?: {
    url?: string;
    format?: 'json' | 'csv' | 'parquet';
  };

  // Step 3: Pipeline Template (optional - use existing Agent/Project as template)
  pipelineTemplate: {
    useTemplate: boolean;
    templateType?: 'agent' | 'project' | 'none';
    selectedAgentId?: string;
    selectedProjectId?: string;
  };

  // Step 4: ETL Pipeline Configuration
  etlPipeline: {
    enabled: boolean;
    transformations: Array<{
      type: 'filter' | 'map' | 'aggregate' | 'join' | 'custom';
      config: any;
    }>;
    outputFormat: 'jsonl' | 'csv' | 'parquet';
    outputPath?: string;
  };

  // Step 4: Training Configuration
  trainingConfig: {
    epochs: number;
    learningRate: number;
    batchSize: number;
    validationSplit: number;
    hyperparameters: Record<string, any>;
  };

  // Step 5: AI Provider (TogetherAI)
  aiProvider: {
    provider: 'togetherai' | 'openai' | 'runpod' | 'anthropic';
    apiKey?: string;
    endpoint?: string;
    modelEndpoint?: string;
  };

  // Step 6: Hugging Face Publishing
  huggingFace: {
    enabled: boolean;
    repositoryName: string;
    repositoryType: 'model' | 'dataset';
    private: boolean;
    token?: string;
    description?: string;
    tags?: string[];
  };
}

export interface ModelFineTuningWizardProps {
  /**
   * Called with the created job once submit succeeds. The host decides what to do — e.g. route to
   * the job detail page. When omitted, the wizard navigates to the app's job detail route via
   * window.location, preserving the original dashboard behaviour.
   */
  onJobCreated?: (job: { id: string; [k: string]: unknown }) => void;
  /** Href for the Cancel button. Defaults to the dashboard's models page. */
  cancelHref?: string;
}

const TOTAL_STEPS = 8;

export default function ModelFineTuningWizard({ onJobCreated, cancelHref }: ModelFineTuningWizardProps = {}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [wizardData, setWizardData] = useState<FineTuningWizardData>({
    baseModel: '',
    modelType: 'llm',
    modelName: '',
    modelDescription: '',
    dataSourceType: 'dataset',
    pipelineTemplate: {
      useTemplate: false,
      templateType: 'none',
    },
    etlPipeline: {
      enabled: true,
      transformations: [],
      outputFormat: 'jsonl',
    },
    trainingConfig: {
      epochs: 3,
      learningRate: 0.0001,
      batchSize: 4,
      validationSplit: 0.2,
      hyperparameters: {},
    },
    aiProvider: {
      provider: 'togetherai',
    },
    huggingFace: {
      enabled: false,
      repositoryName: '',
      repositoryType: 'model',
      private: false,
      tags: [],
    },
  });

  const updateWizardData = (updates: Partial<FineTuningWizardData>) => {
    setWizardData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepChange = (step: number) => {
    if (step <= currentStep + 1) {
      setCurrentStep(step);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      // Map the wizard's camelCase shape to the API's snake_case contract. The HF token is
      // forwarded but never persisted — the route uses it once for whoami + createRepo, then
      // drops it.
      const payload = {
        model_name: wizardData.modelName,
        model_description: wizardData.modelDescription,
        base_model: wizardData.baseModel,
        model_type: wizardData.modelType,
        ai_provider: wizardData.aiProvider.provider,
        training_config: wizardData.trainingConfig,
        etl_pipeline: wizardData.etlPipeline,
        data_source: {
          type: wizardData.dataSourceType,
          dataset_id: wizardData.selectedDatasetId,
          external: wizardData.externalDataSource,
        },
        pipeline_template: wizardData.pipelineTemplate,
        huggingFace: wizardData.huggingFace,
      };
      const job = await createFineTuningJob(payload);
      // Hand the created job to the host (which sees the persisted plan + training progress).
      if (onJobCreated) {
        onJobCreated(job);
      } else if (typeof window !== 'undefined') {
        window.location.assign(`/dashboard/models/fine-tuning/${job.id}`);
      }
    } catch (e: any) {
      setSubmitError(e?.message || 'Submit failed');
      setSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1ModelSelection data={wizardData} onUpdate={updateWizardData} />;
      case 2:
        return <Step2DataSource data={wizardData} onUpdate={updateWizardData} />;
      case 3:
        return <Step3PipelineTemplate data={wizardData} onUpdate={updateWizardData} />;
      case 4:
        return <Step4ETLPipeline data={wizardData} onUpdate={updateWizardData} />;
      case 5:
        return <Step5TrainingConfig data={wizardData} onUpdate={updateWizardData} />;
      case 6:
        return <Step6AIProvider data={wizardData} onUpdate={updateWizardData} />;
      case 7:
        return <Step7HuggingFace data={wizardData} onUpdate={updateWizardData} />;
      case 8:
        return <Step8Review data={wizardData} onSubmit={handleSubmit} />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Model Fine-Tuning Wizard</h1>
        <p className="mt-2 text-gray-600">
          Create a complete fine-tuning pipeline from data preparation to model publishing
        </p>
      </div>

      <WizardProgress
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onStepChange={handleStepChange}
      />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
        {renderStep()}
      </div>

      {submitError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-800">
          Submit failed: {submitError}
        </div>
      )}

      <WizardNavigation
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        onNext={handleNext}
        onPrev={handlePrev}
        onSubmit={handleSubmit}
        submitting={submitting}
        cancelHref={cancelHref}
      />
    </div>
  );
}
