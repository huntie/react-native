/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

type ExtensionDefinition = Readonly<{
  /** Display name. */
  name: string,

  /**
   * Extension package name or other unique identifier
   * (e.g. '@company/devtools-extension').
   */
  packageName: string,

  /** Whether the extension is enabled. */
  enabled: boolean,

  /** Absolute path to extension package root. */
  basePath: string,

  /**
   * Path to devtools page (entry point) within package (relative to package
   * root).
   */
  devtoolsPage: string,

  /** Path to manifest.json within package (relative to package root). */
  manifestPath: string,
}>;

export type Extensions = Readonly<{
  extensions: ReadonlyArray<ExtensionDefinition>,
}>;

export type ExtensionsConfig = Partial<Extensions>;
