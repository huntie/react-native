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
import type {NextHandleFunction} from 'connect';

import sanitizePackageNameForUrl from '../utils/sanitizePackageNameForUrl';
import connect from 'connect';
import serveStaticMiddleware from 'serve-static';

/**
 * Serves frontend assets for configured DevTools extensions.
 */
export default function extensionsAssetsMiddleware(
  extensionsConfig: Extensions,
): NextHandleFunction {
  const app = connect();

  for (const ext of extensionsConfig.extensions) {
    if (!ext.enabled) {
      continue;
    }

    app.use(
      '/' + sanitizePackageNameForUrl(ext.packageName),
      serveStaticMiddleware(ext.basePath, {fallthrough: false}),
    );
  }

  return app;
}
