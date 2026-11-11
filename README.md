# zafiirah-website

Personal biography site and blog for **Dr Zafiirah Hosenie**. It's pure HTML/CSS/JS with no build step, no framework and nothing to pay for.

## Preview locally
```powershell
cd zafiirah-website
python -m http.server 8000   # then open http://127.0.0.1:8000
```

## Publish for free (GitHub Pages)
1. Copy everything in this folder, including the hidden `.nojekyll` file, into the repo `Zafiirah13/zafiirah-hosenie`, replacing the old Jekyll files. You can also use a new repo named `Zafiirah13.github.io`.
2. Commit & push. In **Settings → Pages**, choose *Deploy from a branch*, select your branch and `/ (root)`.

## Editing content
| What | Where |
|---|---|
| Blog posts and scorecards (agentic evals, Quant learning log, Gaussian splats, earlier research) | `assets/js/posts.js` |
| Timeline, publications, repos, Sharpe scoreboard, awards, mentorship, events | `assets/js/data.js` |
| Static text (hero, story, VLM evaluation, prompt engineering, contact) | `index.html` |
| Colours, fonts, layout | `assets/css/style.css` (`:root` variables) |
| Images / video | `assets/img/`, `assets/media/` |

**Adding a blog post:** add an object to `POSTS` in `posts.js` with `id`, `series` (`agentic`, `quant`, `splats` or `research`), `title`, `card` (one line), `chips` (2 to 3 key numbers) and `sections` (`{ h, p }`, `{ h, list }`, `{ h, table }`, optional `img`/`cap`). It then appears automatically on its tab, in the Blog, and in the agent's search index.

Deep links work for every view, e.g. `#quant/log`, `#research/splats`, `#blog/agentic`, `#post/gs-results`.

## Ask-my-agent
Everything runs in the visitor's browser, with no keys, backend or tracking:
1. **Site search:** a small keyword index over every page, timeline entry, publication and blog post.
2. **Web lookup:** Wikipedia and DuckDuckGo Instant Answers, both free and browser-friendly.
3. **AI answer:** the free [Pollinations.ai](https://pollinations.ai) text API writes a short reply grounded in the search results. Its free tier allows about one reply every 45 seconds per visitor. In between, or if the service is down, the agent shows the search results directly.

A few fixed answers (greeting, contact, origin, the Klopp quote) live in `INTENTS` in `assets/js/main.js`.

## Style rule
No long dashes (em or en dash) anywhere in the text. Use commas, colons or "to".
