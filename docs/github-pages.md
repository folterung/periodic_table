# Publish Element Atlas on GitHub Pages

Element Atlas is a static website. Its WebGL scenes, element profiles, search, and electron-configuration tools run in the visitor's browser. The publishing workflow builds and verifies the site, then uploads only `dist/` to GitHub Pages. It does not need a server, a paid hosting service, or custom secrets.

GitHub Pages is free for this public repository. The expected address is:

**https://folterung.github.io/periodic_table/**

The workflow does not enable Pages automatically. Opening its pull request only runs the build, scientific checks, and artifact packaging; it does not publish the site.

## One-time setup for the repository administrator

Do these steps when you are ready for the site to become publicly accessible:

1. Open [the repository's Pages settings](https://github.com/folterung/periodic_table/settings/pages). You must have repository administrator access.
2. Under **Build and deployment**, set **Source** to **GitHub Actions**. The workflow is already included in this pull request, so you do not need to select a template or create another workflow.
3. Merge the GitHub Pages pull request into `main` after **Build and verify** passes. Keep the existing branch protection in place.
4. Open [Actions](https://github.com/folterung/periodic_table/actions), select **Publish Element Atlas**, and wait for the run on `main` to finish. Both **Build and verify** and **Deploy to GitHub Pages** should succeed.
5. Return to **Settings → Pages** and click **Visit site**. The expected address is [Element Atlas](https://folterung.github.io/periodic_table/).

If the pull request was merged before Pages was enabled, complete steps 1–2, then open **Actions → Publish Element Atlas → Run workflow**, choose **main**, and click **Run workflow**. This publishes the current `main` version without needing another commit.

Repository Actions are currently enabled. If they have since been disabled, an administrator must allow the publishing workflow under **Settings → Actions → General**.

## Future updates

Continue making changes on a separate branch and opening a pull request. Each pull request builds and verifies the site but skips deployment. Every successful build after a merge to `main` publishes the updated site automatically. A manual run on `main` can also republish it.

The workflow uses Node.js 24 and pnpm 11.19.0 with the existing lockfile. It checks out the full Git history because scientific verification reads the original source commit. Only the deployment job receives Pages publishing permissions, and it uses GitHub's built-in token. Official actions are pinned to exact commits.

The site's relative asset paths support the `/periodic_table/` address without changes to the WebGL application. The existing Sites hosting manifest remains available; this workflow publishes to GitHub Pages independently.

## Check the first publication

- Confirm the main Table view loads with all 118 elements and the colored block outlines.
- Click an element and check its profile. Switch between Table, Helix, Sphere, and Grid and try rotating and zooming.
- Open **Orbitals**, enter `[Ar] 4s2 3d6`, and check both Overall and Subshell views.
- Check the layout on a phone as well as a desktop.

If a publication fails, open the failed job in **Actions** to see the reason. A Pages configuration error usually means the Source has not been set to **GitHub Actions**. A successful build on a pull request with a skipped deployment is expected.

GitHub's documentation: [Configure a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [Use a custom publishing workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), and [About GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages).
