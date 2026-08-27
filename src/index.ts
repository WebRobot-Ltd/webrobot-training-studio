/**
 * webrobot-training-studio — the WebRobot fine-tuning wizard as host-agnostic React.
 *
 * An 8-step wizard to fine-tune a small model on your data: pick a base model, choose a data
 * source (an existing dataset or an external URL), optionally template + shape it with an ETL
 * pipeline, set training hyperparameters, choose an AI provider (TogetherAI/OpenAI/Runpod),
 * optionally publish to Hugging Face, then submit a fine-tuning job.
 *
 * configureTrainingStudio() once with an apiBase + token provider, then mount
 * <ModelFineTuningWizard />.
 */
export * from './client';

export { default as ModelFineTuningWizard } from './components/ModelFineTuningWizard';
export type { FineTuningWizardData, ModelFineTuningWizardProps } from './components/ModelFineTuningWizard';

export { WizardProgress } from './components/WizardProgress';
export { WizardNavigation } from './components/WizardNavigation';
export { Button } from './components/Button';

export { Step1ModelSelection } from './components/steps/Step1ModelSelection';
export { Step2DataSource } from './components/steps/Step2DataSource';
export { Step3PipelineTemplate } from './components/steps/Step3PipelineTemplate';
export { Step4ETLPipeline } from './components/steps/Step4ETLPipeline';
export { Step5TrainingConfig } from './components/steps/Step5TrainingConfig';
export { Step6AIProvider } from './components/steps/Step6AIProvider';
export { Step7HuggingFace } from './components/steps/Step7HuggingFace';
export { Step8Review } from './components/steps/Step8Review';
