# FormatThoughts Agent Lab

A public-safe sandbox for demonstrating **architecture-aware change review** using a small React-based frontend.

This repository is intentionally scoped as a **teaching and replay environment**. It is used to generate bounded, reviewable change proposals through GitHub agent workflows, which can then be evaluated privately and turned into curated case studies.

## What this repo is

This repo is a **demo lab** built from the current FormatThoughts frontend foundation.

Its purpose is to support:

* small, scoped frontend architecture tasks
* GitHub issue → agent → pull request workflows
* replayable case-study generation
* educational examples of structural improvement

This repository is meant to be:

* simple
* understandable
* safe to inspect
* useful for demonstrating architectural lessons

## What this repo is not

This repo is **not** the private governance engine.

It does **not** include:

* proprietary ingest logic
* internal policy engines
* private rule grammars
* raw architectural evaluation artifacts
* hidden enforcement mechanics

This repository exists only as a **public-safe proposal sandbox**.

## Why this exists

Modern AI coding workflows make it easy to generate code changes.

The harder problem is deciding:

* whether a change should be accepted
* whether it respects structural boundaries
* whether it increases future complexity
* whether it is safe to merge

This repo helps demonstrate that difference by serving as a small environment where proposed changes can be made, reviewed, and later transformed into replayable educational scenarios.

## How it is used

The typical flow for this repository is:

1. A small, bounded issue is created.
2. A GitHub coding agent (or similar workflow) proposes a change.
3. A pull request is opened.
4. The proposed change is reviewed privately outside this repository.
5. A sanitized, public-safe lesson may later be derived from that workflow.

This means the repository is part of a broader **proposal → review → replay** process.

## Scope of changes

Good tasks for this repo include:

* frontend shell refactors
* route organization
* page/component separation
* display-layer cleanup
* small structural improvements
* safe demo-oriented backend additions (later, if needed)

This repo is intentionally **not** used for open-ended or arbitrary repository analysis.

## Current focus

The current focus is preparing the frontend for structured growth, including:

* route-capable application structure
* cleaner separation between page logic and display logic
* room for future lab/replay surfaces
* stronger architectural clarity as the project expands

## Local development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Notes

* This repository is intentionally curated and bounded.
* It is designed for clarity, not maximum feature breadth.
* If you are looking for the educational walkthroughs built from this work, those belong in the broader FormatThoughts publishing layer, not in this repo alone.

## License

This repository is licensed under the MIT License.
