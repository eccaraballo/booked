# Booked

**Know exactly where you go off book.**

Booked is a browser-based tool that compares your real chess games against your actual opening
repertoire — pinpointing exactly where you deviate from known theory, whether it costs you, and
whether you're actually executing the middlegame plan the position calls for (not just following
the opening moves).

**Live demo:** https://eccaraballo.github.io/booked/

## What it actually does

Opening courses and coaches tell you *what* you're supposed to play and *why* a plan works. What
they don't easily tell you is whether any of that is actually showing up in your real games.
Booked reads your games, checks them against your repertoire move-by-move, and answers three
concrete questions:

- **Where do you actually leave the book?** Not "you should know theory" in the abstract — the
  exact move, in the exact line, that you keep deviating from.
- **Does that deviation cost you?** Ranked by how often it happens and how often it correlates
  with a loss, so you're studying what's actually hurting your results, not just whatever line is
  fresh in your memory.
- **Are you executing the plan, not just the moves?** Real opening theory is followed by a
  middlegame plan — a pawn break, a piece maneuver, a specific idea the position is asking for.
  Booked auto-classifies your games into 10 known pawn structures (IQP, Carlsbad, Hanging Pawns,
  Maroczy Bind/Hedgehog, Benoni/KID chains, and more) and checks whether the plan elements for
  that structure actually show up in your games.

## Features

- **Runs entirely in the browser.** No server, no account, no upload — a single self-contained
  HTML file. Your games never leave your device.
- **Load games your way.** Sync directly from a Chess.com or Lichess username, or upload a PGN
  from anywhere — OTB tournament software, a TD's export, a Lichess study, any standard export.
  Handles annotated PGNs (comments, NAGs, sub-variations) correctly, not just flat exports.
- **Bring your own repertoire.** Start from a built-in generic opening as a baseline, or import
  your own lines from a PGN where each "game" is one reference line (as most course/study tools
  can export).
- **Auto-detected pawn structures & plans.** No manual tagging required — games are clustered by
  opening and matched against known structures automatically, with a scorecard checking whether
  the actual plan elements showed up.
- **Opening-book context.** Every matched structure is labeled with its real opening name and ECO
  code (via the [Lichess `chess-openings`](https://github.com/lichess-org/chess-openings) database,
  CC0), plus general opening-family plan notes where available.
- **Optional engine analysis.** Runs Stockfish directly in your browser (via WASM) to get real
  centipawn-loss numbers for your top study-priority deviations — no server round-trip.
- **Deviation board viewer.** Click any deviation to see the exact position, with your move and
  the book move both shown as arrows.

## How to use it

1. Open the [live site](https://eccaraballo.github.io/booked/).
2. Go to **Sync** → **Load Games**, and either sync from your Chess.com/Lichess username or upload
   a PGN.
3. Go to **Repertoire** → **Manage Repertoire**, and either pick a starter opening or upload your
   own lines.
4. Check **Sync** → **Results** for your deviations, study priorities, and auto-detected
   structure/plan breakdown, or explore **White** / **Black vs 1.e4** / **Black vs 1.d4** /
   **Overview** for the same games sliced a different way.

Everything is recomputed live in your browser each time you load games — nothing is saved unless
you explicitly save a repertoire to your browser's local storage.

## Project structure

- `build_app.py` — generator script; assembles the single-page app (`HTML_TEMPLATE`) plus an
  embedded data payload into a finished HTML file. Two build modes:
  - `python3 build_app.py --public out.html` — the public demo build (no personal game history or
    course databases baked in).
  - `python3 build_app.py games.pgn out.html [history.json] [structures_progress.json]` — a
    private build with real game history embedded, for personal use.
- `course_lines.py`, `modern_course_lines.py`, `qid_course_lines.py` — reference repertoire lines
  used for the built-in course comparisons.
- `eco_openings_export.json` — the embedded Lichess opening-name database.
- `opening_plan_notes.json` — hand-written general plan notes for specific opening families,
  shown alongside the auto-detected structure plan.
- `cburnett_pieces.json`, `engine_assets.json` — board rendering and Stockfish WASM assets bundled
  into the build.

## Status

This is an actively-developed personal project, built and used to study my own games — feedback,
bug reports, and suggestions are very welcome. If something looks wrong or you have an idea for
what would make this more useful, open an issue or reach out.

## Credits

- Opening names and ECO codes from [lichess-org/chess-openings](https://github.com/lichess-org/chess-openings)
  (CC0 public domain).
- Chess piece set from [cburnett](https://github.com/lichess-org/lila/tree/master/public/piece/cburnett)
  (CC BY-SA 4.0 / GPL).
- Engine analysis powered by [Stockfish](https://stockfishchess.org/), compiled to WebAssembly.
