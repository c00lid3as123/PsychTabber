# Privacy

PsychTabber does not collect, store off-device, or transmit any data.

- No analytics, tracking, accounts, ads or remote servers.
- The code makes no network requests (you can verify this: search the source for `fetch`, `XMLHttpRequest` and `WebSocket`).
- Settings, presets and the diagnostics text are stored only in your browser via `chrome.storage.local`.
- Tab pixels are processed on your own GPU inside the tab. Chrome shows its own "share this tab" prompt before any capture, and nothing is saved or uploaded.
- Exported preset files contain only slider values and settings.

## Permissions and why they are needed
| Permission | Why |
|---|---|
| `activeTab` | Lets the extension act on the tab you clicked it on |
| `scripting` | Injects the filter scripts into that tab |
| `storage` | Saves your settings and presets locally |
| `sidePanel` | Shows the controls panel |

It injects code only into a tab after you click the toolbar icon there. If you reload or navigate that same tab while the filter is on, it re-applies itself to that tab. Closing the tab, or stopping the filter, ends it.
