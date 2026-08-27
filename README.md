# webrobot-training-studio

The **WebRobot fine-tuning wizard** as a host-agnostic React component: an 8-step wizard to
fine-tune a small model on your data — either an existing dataset or one generated via an ETL
pipeline. Extracted from the WebRobot dashboard so the same wizard can be embedded elsewhere
(for example a WordPress plugin), the same way as
[`webrobot-agentic-studio`](https://github.com/WebRobot-Ltd/webrobot-agentic-studio).

## What it does

Walk through the full fine-tuning plan and submit it as a job:

1. **Model** — pick a base model (Llama, Mistral, Phi, BERT, custom) and name it.
2. **Data Source** — an existing **dataset** or an **external URL** (json/csv/parquet).
3. **Pipeline Template** — optionally seed the ETL from an existing Agent or Project.
4. **ETL Pipeline** — enable + configure transformations and output format (JSONL/CSV/Parquet).
5. **Training** — epochs, learning rate, batch size, validation split, extra hyperparameters.
6. **AI Provider** — TogetherAI (default), OpenAI, or Runpod; optional stored credential.
7. **Hugging Face** — optional publishing, with live token validation (whoami).
8. **Review** — confirm and submit the job.

## Install

```bash
npm install webrobot-training-studio react lucide-react
```

`react` and `lucide-react` are peer dependencies.

## Configure

Host-agnostic: inject the API base and a token provider once. The core imports neither a token
helper nor `process.env`.

```ts
import { configureTrainingStudio } from 'webrobot-training-studio';

configureTrainingStudio({
  apiBase: '',                                   // '' keeps same-origin BFF paths; a full origin points elsewhere
  getToken: () => localStorage.getItem('jwt'),   // a function, so a rotated token is picked up
});
```

## Use

```tsx
import { ModelFineTuningWizard } from 'webrobot-training-studio';

export function TrainingStudio() {
  return (
    <ModelFineTuningWizard
      // optional — the host decides what to do once the job is created
      onJobCreated={(job) => router.push(`/dashboard/models/fine-tuning/${job.id}`)}
      cancelHref="/dashboard/models"
    />
  );
}
```

With no `onJobCreated`, the wizard navigates to `/dashboard/models/fine-tuning/:id` via
`window.location`, preserving the original dashboard behaviour.

## Endpoints

Prefixed with the configured `apiBase`, sent with `Authorization: Bearer <token>`:

- `GET /api/datasets` — dataset picker (Step 2)
- `GET /api/agents`, `GET /api/projects` — ETL pipeline template sources (Step 3)
- `GET /api/cloud-credentials?provider=TOGETHERAI` — provider credential picker (Step 6)
- `POST /api/fine-tuning/hf/validate-token` — Hugging Face token whoami (Step 7)
- `POST /api/fine-tuning/jobs` — submit the fine-tuning job (Step 8)

## Build

```bash
npm run build      # tsc → dist/
npm run typecheck
```

The core (`configureTrainingStudio` + the client) typechecks with no React present; the
components need `react`.

## License

MIT © WebRobot Ltd
