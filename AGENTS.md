<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- Medical images are previewed only via in-browser object URLs (src/lib/image-session.ts, in-memory); never upload or persist image data — privacy requirement of the prototype.
- Demo history persists only non-sensitive metadata (type, date, format, size) in localStorage via src/lib/history.ts — no file names or image data.
- Analysis screens (ECG/X-ray upload panel, /results/$sessionId) render only the fixed prototype-preview copy from src/lib/exams.ts (DEMO_RESULT), independent of the uploaded image — the app must never imply real interpretation.
- All lessons, anatomy guides, glossaries and example cases live only in /learning-lab (data in src/lib/learning-lab.ts); analysis screens never render or link to them — keeps analysis and education clearly separate.
- The AI Experiment Lab (/ai-experiment-lab) is the only place that runs a real model: the Teachable Machine classifier in public/ai-model, loaded lazily in the browser via src/lib/ai-model.ts (@teachablemachine/image + @tensorflow/tfjs 1.x, the version the model was exported with); it never writes history and stays separate from the prototype analysis screens.
