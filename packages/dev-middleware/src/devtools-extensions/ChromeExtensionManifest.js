/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

/**
 * The subset of Chrome extension manifest.json properties that are considered
 * by extensions support in React Native DevTools.
 */
export type ExtensionManifest = Readonly<{
  /** Manifest format version (2 or 3). */
  manifest_version: 2 | 3,

  /** Extension name. */
  name: string,

  /** Extension version. */
  version: string,

  /** Path to devtools HTML page. */
  devtools_page: string,
}>;
