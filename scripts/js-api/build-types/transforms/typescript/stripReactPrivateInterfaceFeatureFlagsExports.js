/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {PluginObj} from '@babel/core';

function isFeatureFlagsModuleSpecifier(specifier: string): boolean {
  return (
    specifier.startsWith('./private/featureflags/') ||
    specifier.startsWith('../private/featureflags/')
  );
}

/**
 * `ReactNativeFeatureFlags` is exposed from `react-private-interface` at
 * runtime only. Strip its re-export from the generated `.d.ts` when we skip
 * translating `src/private/featureflags/*`.
 */
const stripReactPrivateInterfaceFeatureFlagsExports: PluginObj<unknown> = {
  visitor: {
    ImportDeclaration(nodePath) {
      if (isFeatureFlagsModuleSpecifier(nodePath.node.source.value)) {
        nodePath.remove();
      }
    },
    ExportNamedDeclaration(nodePath) {
      if (
        nodePath.node.source != null &&
        isFeatureFlagsModuleSpecifier(nodePath.node.source.value)
      ) {
        nodePath.remove();
      }
    },
    ExportAllDeclaration(nodePath) {
      if (isFeatureFlagsModuleSpecifier(nodePath.node.source.value)) {
        nodePath.remove();
      }
    },
  },
};

module.exports = stripReactPrivateInterfaceFeatureFlagsExports;
