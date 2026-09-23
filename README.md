# AI Groceries Optimizer — Frontend

Plain HTML/CSS/JS demo of the two core features:
1. **Grocery List Input** — pick items + quantities from the seed catalog
2. **Cost & Nutrition Optimization Engine** — greedy algorithm picks the combo that fits your budget while maximizing protein per rupee

No build step, no dependencies — just static files.

## Run in VS Code

1. Open this folder in VS Code (`File > Open Folder…`)
2. Install the **Live Server** extension (by Ritwick Dey) if you don't have it
3. Right-click `index.html` → **Open with Live Server**

Or, without any extension, just double-click `index.html` to open it directly in your browser — it works fine that way too since everything is self-contained (only the Google Fonts stylesheet is loaded externally).

## Run in Google Colab

Colab is built for Python/notebooks, not static frontend apps, so there's no true "run" equivalent — but you can preview the page inline in a notebook cell:

```python
from IPython.display import IFrame

# Upload index.html, style.css, script.js to Colab's file panel first (or mount Drive),
# then serve them so relative links (style.css, script.js) resolve:
import subprocess, threading
def serve():
    subprocess.run(["python3", "-m", "http.server", "8000"])
threading.Thread(target=serve, daemon=True).start()

IFrame(src="http://localhost:8000/index.html", width=900, height=700)
```

This starts a tiny local web server inside the Colab VM and embeds the page in an iframe so you can click around it right there in the notebook.

## Files

- `index.html` — page structure
- `style.css` — styling (green/clay grocery-market theme)
- `script.js` — seed product catalog + optimization logic

## Next steps for the real project

Swap `CATALOG` in `script.js` for a real API call to your backend partner's endpoint once it's ready — the rendering and optimization logic can stay mostly as-is if the response shape matches `{ name, price, cal, protein }` per item.
