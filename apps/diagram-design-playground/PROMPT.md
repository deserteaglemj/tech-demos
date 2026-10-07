# Prompt given to the agent

> Use the **diagram-design** skill installed in this project.
>
> Keep the default Diagram Design skin (style-guide defaults — option **e**).
>
> Make me an **architecture** diagram of a single-user tech-demo pipeline:
>
> - Owner bookmarks a public tech on X
> - Cursor cloud agent picks it up from this sticky monorepo
> - Agent installs the real tool (not a lookalike playground)
> - Agent runs a real prompt against the tool
> - Self-contained HTML artifact lands in `apps/<slug>/output/`
> - PR opens with screenshot + video of that real usage
>
> Focal node should be the **Cursor cloud agent**. Density target ~4/10. Minimal light variant. Write the file to `output/tech-demo-pipeline.html`.
