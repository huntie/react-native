/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

export default function sanitizePackageNameForUrl(
  packageName: string,
): string {
  return packageName
    .replace(/^@/, '')
    .replace(/\//g, '-')
    .replace(/[^a-z0-9-_]/gi, '')
    .toLowerCase();
}
