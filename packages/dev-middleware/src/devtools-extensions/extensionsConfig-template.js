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
 * See react-native-devtools-frontend/front_end/core/host/InspectorFrontendHostAPI.ts
 */
type DevToolsExtensionDescriptor = $ReadOnly<{
  name: string,
  startPage: string,
}>;

function extensionsConfigScriptTemplate({
  extensions,
}: {
  extensions: $ReadOnlyArray<DevToolsExtensionDescriptor>,
}): string {
  return `globalThis.__DEVTOOLS_EXTENSIONS__ = ${JSON.stringify(
    extensions,
    null,
    2,
  )};
  `;
}

module.exports = extensionsConfigScriptTemplate;
