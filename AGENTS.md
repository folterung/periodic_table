# Repository workflow

The GitHub repository is https://github.com/folterung/periodic_table and its default branch is `main`.

The initial repository upload is authorized to go directly to `main`. All subsequent work must use a separate branch and a pull request. Do not push changes directly to `main`, merge a pull request, bypass branch protection, or force-push unless the user explicitly authorizes that action.

Before opening a pull request, run `node scripts/build.mjs`, `node scripts/verify.mjs`, and `node scripts/verify-orbitals.mjs`. Keep the existing Git history: the scientific-data verification reads a historical source commit. For visual or interaction changes, also run the browser QA described in `README.md` and inspect the affected layouts.
