/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {ExtensionsConfig} from '../devtools-extensions/ExtensionsConfig';
import type {NextHandleFunction} from 'connect';

import sanitizePackageNameForUrl from '../utils/sanitizePackageNameForUrl';

const extensionsConfigTemplate = require('../devtools-extensions/extensionsConfig-template');

/**
 * Serves the `extensionsConfig.js` script, which will be read by the DevTools
 * frontend to load configured user extensions.
 */
export default function extensionsConfigMiddleware(
  extensionsConfig: ?ExtensionsConfig,
): NextHandleFunction {
  return (_req, res) => {
    res.setHeader('Content-Type', 'application/javascript');

    const extensions = extensionsConfig?.extensions ?? [];

    if (extensions.length === 0) {
      res.end('');
      return;
    }

    res.end(
      extensionsConfigTemplate({
        extensions: extensions
          .filter(ext => ext.enabled)
          .map(ext => ({
            name: ext.name,
            startPage:
              `/devtools-extensions/${sanitizePackageNameForUrl(ext.packageName)}` +
              '/' +
              ext.devtoolsPage,
          })),
      }),
    );
  };
}
