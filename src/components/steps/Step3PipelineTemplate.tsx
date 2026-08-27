'use client';

import { useState, useEffect } from 'react';
import { FineTuningWizardData } from '../ModelFineTuningWizard';
import { listAgents, listProjects } from '../../client';

interface Step3PipelineTemplateProps {
  data: FineTuningWizardData;
  onUpdate: (updates: Partial<FineTuningWizardData>) => void;
}

export function Step3PipelineTemplate({ data, onUpdate }: Step3PipelineTemplateProps) {
  const [agents, setAgents] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (data.pipelineTemplate.useTemplate && data.pipelineTemplate.templateType === 'agent') {
      loadAgents();
    } else if (data.pipelineTemplate.useTemplate && data.pipelineTemplate.templateType === 'project') {
      loadProjects();
    }
  }, [data.pipelineTemplate.useTemplate, data.pipelineTemplate.templateType]);

  const loadAgents = async () => {
    try {
      setLoading(true);
      const result = await listAgents();
      setAgents(result);
    } catch (error) {
      console.error('Error loading agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    try {
      setLoading(true);
      const result = await listProjects();
      setProjects(result);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Step 3: Pipeline Template (Optional)</h2>
        <p className="mt-1 text-sm text-gray-600">
          Use an existing Agent or Project as a template for your ETL pipeline, or create from scratch
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Use Template?
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="useTemplate"
                checked={!data.pipelineTemplate.useTemplate}
                onChange={() => onUpdate({
                  pipelineTemplate: {
                    useTemplate: false,
                    templateType: 'none',
                    selectedAgentId: undefined,
                    selectedProjectId: undefined,
                  },
                })}
                className="w-4 h-4 text-purple-600"
              />
              <span className="text-sm text-gray-700">Create from scratch</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="useTemplate"
                checked={data.pipelineTemplate.useTemplate}
                onChange={() => onUpdate({
                  pipelineTemplate: {
                    ...data.pipelineTemplate,
                    useTemplate: true,
                    templateType: data.pipelineTemplate.templateType || 'agent',
                  },
                })}
                className="w-4 h-4 text-purple-600"
              />
              <span className="text-sm text-gray-700">Use existing template</span>
            </label>
          </div>
        </div>

        {data.pipelineTemplate.useTemplate && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Template Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['agent', 'project'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onUpdate({
                      pipelineTemplate: {
                        ...data.pipelineTemplate,
                        templateType: type,
                        selectedAgentId: type === 'agent' ? data.pipelineTemplate.selectedAgentId : undefined,
                        selectedProjectId: type === 'project' ? data.pipelineTemplate.selectedProjectId : undefined,
                      },
                    })}
                    className={`p-3 rounded-lg border-2 transition-colors capitalize ${
                      data.pipelineTemplate.templateType === type
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {data.pipelineTemplate.templateType === 'agent' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Agent Template
                </label>
                {loading ? (
                  <div className="text-sm text-gray-500">Loading agents...</div>
                ) : (
                  <select
                    value={data.pipelineTemplate.selectedAgentId || ''}
                    onChange={(e) => onUpdate({
                      pipelineTemplate: {
                        ...data.pipelineTemplate,
                        selectedAgentId: e.target.value,
                      },
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select an agent...</option>
                    {agents.map((agent) => (
                      <option key={agent.id} value={agent.id}>
                        {agent.name || agent.attributes?.name || `Agent ${agent.id}`}
                      </option>
                    ))}
                  </select>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  The agent&apos;s pipeline YAML and PySpark code will be used as a starting point for your ETL pipeline.
                </p>
              </div>
            )}

            {data.pipelineTemplate.templateType === 'project' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Project Template
                </label>
                {loading ? (
                  <div className="text-sm text-gray-500">Loading projects...</div>
                ) : (
                  <select
                    value={data.pipelineTemplate.selectedProjectId || ''}
                    onChange={(e) => onUpdate({
                      pipelineTemplate: {
                        ...data.pipelineTemplate,
                        selectedProjectId: e.target.value,
                      },
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="">Select a project...</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name || project.attributes?.name || `Project ${project.id}`}
                      </option>
                    ))}
                  </select>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  The project&apos;s jobs and their associated pipelines will be used as a starting point for your ETL pipeline.
                </p>
              </div>
            )}
          </>
        )}

        {!data.pipelineTemplate.useTemplate && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Note:</strong> You&apos;ll configure the ETL pipeline from scratch in the next step.
              This gives you full control over data transformations.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
