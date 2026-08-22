# AGENTS.md

## Cursor Cloud specific instructions

This is the React Native monorepo (`facebook/react-native`). It contains JavaScript/Flow/TypeScript,
plus native Android (Java/Kotlin/C++) and iOS (Obj-C/Swift) source. The Cloud VM is Linux, so only the
**JavaScript/TypeScript** developer surface is set up and verified here. Native builds are out of scope
on this VM: iOS requires macOS/Xcode, and Android requires the full Android SDK/NDK + a heavy C++ build
(CI builds it inside the `reactnativecommunity/react-native-android` Docker image, not on a plain VM).

### Environment
- Node, Yarn (v1, pinned via `packageManager`), Java, and Python are preinstalled. The startup update
  script runs `yarn install` to refresh workspace dependencies.
- `yarn install` runs a `preinstall` hook (`scripts/try-set-hermes-compiler-prebuilt.js`) that resolves
  the `hermes-compiler` placeholder in `packages/react-native/package.json` (`0.0.0` → a real version)
  and touches `yarn.lock`. This working-tree churn after install is expected — do NOT commit it.

### Standard commands (run from repo root; defined in root `package.json`)
- Lint: `yarn lint` (ESLint, `--max-warnings 0`), `yarn flow-check` (Flow), `yarn test-typescript` (tsc),
  `yarn format-check` (Prettier), `yarn lint-markdown`.
- Test: `yarn test` (Jest) or `yarn test-ci` (`jest --maxWorkers=2`, used in CI). ~274 suites / ~5.6k tests.
- The `test_js` and `lint` jobs in `.github/workflows/test-all.yml` are the source of truth for JS CI.

### Running the app (Metro dev server for RNTester)
- `yarn start` launches Metro on `http://localhost:8081` (serves `packages/rn-tester`).
- Non-obvious prerequisite: before Metro can bundle, build the codegen package once so its compiled
  output exists — `yarn --cwd packages/react-native-codegen build`. Without it, bundling fails with
  `Cannot find module '@react-native/codegen/lib/parsers/flow/parser'` (the Babel plugin
  `packages/babel-plugin-codegen` loads codegen from its built `lib/`, and Flow `src/` can't be
  `require()`d by plain Node). This is a build step, so it is intentionally NOT in the update script.
- Verify the dev server by requesting a bundle, e.g.
  `curl "http://localhost:8081/js/RNTesterApp.bundle?platform=ios&dev=true"` (expect HTTP 200, a multi-MB
  JS bundle). The entry points are `packages/rn-tester/js/RNTesterApp.{ios,android}.js`.

### Notes
- Most JS/TS packages run from source; `yarn build` is generally NOT needed for development (see
  `scripts/build/README.md`). The `react-native-codegen` `lib/` build above is the notable exception
  needed to run Metro.
