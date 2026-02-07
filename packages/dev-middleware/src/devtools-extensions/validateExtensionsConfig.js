/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {Logger} from '../types/Logger';
import type {Extensions, ExtensionsConfig} from './ExtensionsConfig';

import fs from 'fs';
import path from 'path';

/**
 * Validates the given extensions config, filtering out extensions with
 * invalid paths or manifests.
 */
export default function validateExtensionsConfig(
  config: ?ExtensionsConfig,
  logger?: ?Logger,
): Extensions {
  const extensions = config?.extensions ?? [];
  const seenPackageNames = new Set<string>();

  return {
    extensions: extensions.filter(ext => {
      if (seenPackageNames.has(ext.packageName)) {
        logger?.error(
          'Extension "%s" skipped: duplicate packageName "%s"',
          ext.name,
          ext.packageName,
        );
        return false;
      }
      seenPackageNames.add(ext.packageName);

      if (!fs.existsSync(ext.basePath)) {
        logger?.error(
          'Extension "%s" skipped: basePath does not exist: %s',
          ext.name,
          ext.basePath,
        );
        return false;
      }

      const manifestFullPath = path.join(ext.basePath, ext.manifestPath);
      if (!fs.existsSync(manifestFullPath)) {
        logger?.error(
          'Extension "%s" skipped: manifest not found at: %s',
          ext.name,
          manifestFullPath,
        );
        return false;
      }

      try {
        const manifest = JSON.parse(fs.readFileSync(manifestFullPath, 'utf8'));
        if (
          manifest.manifest_version !== 2 &&
          manifest.manifest_version !== 3
        ) {
          logger?.error(
            'Extension "%s" skipped: unsupported manifest_version %s (expected 2 or 3)',
            ext.name,
            String(manifest.manifest_version),
          );
          return false;
        }
      } catch (e) {
        logger?.error(
          'Extension "%s" skipped: failed to read manifest: %s',
          ext.name,
          (e as Error).message,
        );
        return false;
      }

      const devtoolsPagePath = path.join(ext.basePath, ext.devtoolsPage);
      if (!fs.existsSync(devtoolsPagePath)) {
        logger?.error(
          'Extension "%s" skipped: devtools page not found at: %s',
          ext.name,
          devtoolsPagePath,
        );
        return false;
      }

      return true;
    }),
  };
}
