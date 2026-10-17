# Testing checklist

PsychTabber has only been lightly tested. If you try it, these checks help find problems. Report anything odd in the Issues tab and include the **Diagnostics** text from the side panel.

**Safety first**
- [ ] Start with the **Light** preset and **Overall strength** low. Only turn it up slowly.
- [ ] Confirm you can stop it: the panel's **Start/Stop** button, the toolbar icon, and closing the tab.
- [ ] Alt+Shift+X is experimental. If it doesn't stop the filter on your computer, don't rely on it.

**Basics**
- [ ] Loads at `chrome://extensions` with no errors (click **Errors** if a red button shows).
- [ ] On a normal `https://` site, clicking the icon opens the panel and shows the **LITE** badge.
- [ ] The purple **Full shader** button works and the badge changes to **ON** after you choose *Share this tab*.
- [ ] You can still scroll, click and type on the page.
- [ ] Stopping removes every effect and the page looks normal again.

**Features**
- [ ] Each preset loads. Try Light, LSD, Mushrooms and Cosmic Mandala.
- [ ] Moving effect sliders changes the picture and the tick boxes switch effects off.
- [ ] Save a preset, reload the page, and check it is still there. Export it and import it again.
- [ ] Camera feedback: tick **Feedback on** and drag the 3D camera.
- [ ] Camera keys (Alt+Shift+C), then the arrow keys. Turn off and check the arrow keys scroll again.
- [ ] Chroma key and **Draw cut-out on page** make parts see-through. **Clear all** removes them.

**Performance**
- [ ] Watch temperature and fan noise on a laptop. Lower **Render scale** and **Frame rate cap** if it gets hot.
- [ ] Try a few different sites (a text site, a video site, a site with a dark theme).
- [ ] Reload the tab while it's on and check it behaves.

**Sites that may not work:** Chrome's own pages, the Web Store and plain `http://` pages.
