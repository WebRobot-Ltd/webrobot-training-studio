/**
 * Host-agnostic client for the WebRobot Training Studio.
 *
 * The studio authors a fine-tuning plan — base model, data source (an existing dataset or an
 * external URL, optionally shaped by an ETL pipeline), training hyperparameters, AI provider
 * (TogetherAI/OpenAI/Runpod) and optional Hugging Face publishing — and submits it as a
 * fine-tuning job. This client carries the API calls the wizard needs, injected rather than
 * imported, so the studio can run outside the Next app (e.g. a WordPress plugin): the host
 * calls configureTrainingStudio() once with an apiBase and a token provider.
 *
 * Paths are kept as the app used them (relative BFF routes). The host decides via apiBase
 * whether those resolve to its own BFF proxy or straight to the backend.
 */
export interface TrainingStudioConfig {
  /** Prefixes every request path. '' keeps the app's relative BFF routes; a full origin points elsewhere. */
  apiBase: string;
  /** Returns the current bearer token (or null). A function, so a rotated token is picked up. */
  getToken: () => string | null;
}

let _config: TrainingStudioConfig | null = null;

export function configureTrainingStudio(cfg: TrainingStudioConfig): void {
  _config = { ...cfg, apiBase: cfg.apiBase.replace(/\/$/, '') };
}

function config(): TrainingStudioConfig {
  if (!_config) {
    // Default: same-origin BFF relative paths + JWT from localStorage — the Next app's behaviour.
    _config = {
      apiBase: '',
      getToken: () =>
        typeof localStorage !== 'undefined' ? localStorage.getItem('jwt') : null,
    };
  }
  return _config;
}

export class TrainingStudioError extends Error {
  constructor(public status: number, message: string, public body?: unknown) {
    super(message);
    this.name = 'TrainingStudioError';
  }
}

async function call<T>(method: string, path: string, body?: unknown): Promise<T> {
  const { apiBase, getToken } = config();
  const token = getToken();
  const res = await fetch(`${apiBase}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  const j = await res.json().catch(() => null);
  if (!res.ok) throw new TrainingStudioError(res.status, (j as any)?.error || `HTTP ${res.status}`, j);
  return j as T;
}

// Same as call<T>, but does NOT throw on a non-2xx: it returns the parsed body along with the
// HTTP status. Used where the wizard renders the API's own { valid, error } contract inline
// rather than surfacing an exception.
async function callRaw<T>(
  method: string,
  path: string,
  body?: unknown,
): Promise<{ ok: boolean; status: number; body: T }> {
  const { apiBase, getToken } = config();
  const token = getToken();
  const res = await fetch(`${apiBase}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  const j = (await res.json().catch(() => ({}))) as T;
  return { ok: res.ok, status: res.status, body: j };
}

// The listing endpoints return either a bare array or a JSON:API-ish { data: [...] } — the app
// normalised at each call site; we normalise once here so components receive a plain array.
function asArray(result: any): any[] {
  return Array.isArray(result) ? result : result?.data || [];
}

// ── Data sources ─────────────────────────────────────────────────────────────

// Datasets available to use as the raw training data source (Step 2, dataset mode).
export const listDatasets = () => call<any>('GET', '/api/datasets').then(asArray);

// ── Pipeline template sources (Step 3) ───────────────────────────────────────

// Existing agents, used as an ETL pipeline template (pipeline YAML + PySpark starting point).
export const listAgents = () => call<any>('GET', '/api/agents').then(asArray);
// Existing projects, used as an ETL pipeline template (their jobs' pipelines).
export const listProjects = () => call<any>('GET', '/api/projects').then(asArray);

// ── AI provider (Step 6) ─────────────────────────────────────────────────────

// TogetherAI cloud credentials the tenant has stored (optional credential picker).
export const listTogetherAiCredentials = () =>
  call<any>('GET', '/api/cloud-credentials?provider=TOGETHERAI').then(asArray);

// ── Hugging Face (Step 7) ────────────────────────────────────────────────────

export interface HfTokenValidation {
  valid?: boolean;
  name?: string;
  type?: 'user' | 'org';
  orgs?: string[];
  error?: string;
}

// Validate a Hugging Face token (whoami). The token is sent only for this check and never
// persisted. Returns the raw contract + HTTP status so the step can render valid/error inline.
export const validateHfToken = (token: string) =>
  callRaw<HfTokenValidation>('POST', '/api/fine-tuning/hf/validate-token', { token });

// ── Submit (Step 8) ──────────────────────────────────────────────────────────

// Submit the fine-tuning job. The wizard maps its camelCase state to this snake_case payload;
// the HF token (inside huggingFace) is forwarded but never persisted by the route.
export const createFineTuningJob = (payload: unknown) =>
  call<{ id: string; [k: string]: unknown }>('POST', '/api/fine-tuning/jobs', payload);
