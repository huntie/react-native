/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

const {REACT_NATIVE_PACKAGE_DIR} = require('../../../shared/consts');
const path = require('node:path');

const REACT_PRIVATE_INTERFACE_IMPORT = 'react-native/react-private-interface';

const REACT_PRIVATE_INTERFACE_FILES: Set<string> = new Set([
  path.join(REACT_NATIVE_PACKAGE_DIR, 'src/react-private-interface.js'),
  path.join(REACT_NATIVE_PACKAGE_DIR, 'src/react-private-interface.js.flow'),
]);

const FEATURE_FLAGS_PREFIX =
  'src' + path.sep + 'private' + path.sep + 'featureflags' + path.sep;

function isReactPrivateInterfaceImport(importPath: string): boolean {
  return importPath === REACT_PRIVATE_INTERFACE_IMPORT;
}

function isReactPrivateInterfaceFile(filePath: string): boolean {
  return REACT_PRIVATE_INTERFACE_FILES.has(path.resolve(filePath));
}

function isFeatureFlagsSourceDependency(depFile: string): boolean {
  const relativeFromPackage = path.relative(
    REACT_NATIVE_PACKAGE_DIR,
    path.resolve(depFile),
  );

  if (relativeFromPackage === '' || relativeFromPackage.startsWith('..')) {
    return false;
  }

  return (
    relativeFromPackage ===
      'src' + path.sep + 'private' + path.sep + 'featureflags' ||
    relativeFromPackage.startsWith(FEATURE_FLAGS_PREFIX)
  );
}

/**
 * `react-private-interface` exposes `ReactNativeFeatureFlags` at runtime only.
 * Do not expand its feature-flags dependencies into generated types.
 */
function shouldExpandDependency(fromFile: string, depFile: string): boolean {
  if (!isReactPrivateInterfaceFile(fromFile)) {
    return true;
  }
  return !isFeatureFlagsSourceDependency(depFile);
}

module.exports = {
  isReactPrivateInterfaceFile,
  isReactPrivateInterfaceImport,
  shouldExpandDependency,
};
