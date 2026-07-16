# PhD Research Day — Poster Evaluation

A static poster-evaluation website prepared for GitHub Pages. It has no build step or package dependencies.

## Deploy with GitHub Pages

1. Create a new GitHub repository.
2. Upload everything in this folder, preserving the `assets/css` and `assets/js` directories.
3. Commit the files to the `main` branch.
4. Open the repository's **Settings → Pages**.
5. Under **Build and deployment**, choose **Deploy from a branch**.
6. Select the `main` branch and `/(root)` folder, then save.

GitHub will show the public site URL after the deployment completes. Because `index.html` is in the repository root, it is used as the site entry page.

See GitHub's official [publishing-source guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) if the Pages controls differ for your account or organization.

## Important data-storage limitation

This static version stores evaluations in the current browser's `localStorage`.

- Scores survive page refreshes on the same browser and device.
- Different devices and browsers do not share scores.
- The organizer dashboard only aggregates submissions made in that same browser.

For live scoring by jurors on separate devices, connect the site to a shared database or API before the event.

## Organizer passcode

The organizer passcode is defined by `ORG_PASSCODE` in `assets/js/script.js`. Its current value is `PRD2026`.

This is only a visual gate. Static JavaScript is publicly readable, so the passcode is not secure authentication.

## Files

```text
.
├── index.html
├── README.md
└── assets
    ├── css
    │   └── styles.css
    └── js
        └── script.js
```
