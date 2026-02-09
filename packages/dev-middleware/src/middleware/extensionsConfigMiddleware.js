/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 */

import type {Extensions} from '../devtools-extensions/ExtensionsConfig';
import type {ReadonlyURL} from '../types/ReadonlyURL';
import type {NextHandleFunction} from 'connect';

import sanitizePackageNameForUrl from '../utils/sanitizePackageNameForUrl';

const extensionsConfigTemplate = require('../devtools-extensions/extensionsConfig-template');

type Options = Readonly<{
  serverBaseUrl: ReadonlyURL,
  extensionsConfig: Extensions,
}>;

/**
 * Serves the `extensionsConfig.js` script, which will be read by the DevTools
 * frontend to load configured user extensions.
 */
export default function extensionsConfigMiddleware({
  serverBaseUrl,
  extensionsConfig: {extensions},
}: Options): NextHandleFunction {
  return (_req, res) => {
    res.setHeader('Content-Type', 'application/javascript');

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
            startPage: new URL(
              `/devtools-extensions/${sanitizePackageNameForUrl(ext.packageName)}` +
                '/' +
                ext.devtoolsPage,
              serverBaseUrl,
            ).toString(),
          })),
      }),
    );
  };
}
