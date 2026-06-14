# Changesets

This monorepo uses [Changesets](https://github.com/changesets/changesets) to version and publish `better-react-media`.

## Adding a changeset

When your PR includes user-facing changes to the library, add a changeset:

```sh
bun changeset
```

Choose the semver bump (`patch`, `minor`, or `major`) and write a short summary for the changelog.

## Release flow

1. Changes merge to `main` with one or more changeset files.
2. The **Release** workflow opens a **Version Packages** pull request that bumps the version and updates `CHANGELOG.md`.
3. Merging that PR triggers an npm publish and creates a GitHub release.

No manual version bumps in `package.json` are required.
