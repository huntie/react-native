/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 * @oncall react_native
 */

const {REPO_ROOT} = require('./consts');
const {parseArgs} = require('@pkgjs/parseargs');
const {execSync} = require('child_process');
const {promises: fs} = require('fs');
const path = require('path');

const config = {
  allowPositionals: true,
  options: {
    help: {type: 'boolean'},
  },
};

async function main() {
  const {
    positionals,
    values: {help},
  } = parseArgs(config);
  let {revision} = positionals;

  if (help) {
    console.log(`
  Usage: node ./scripts/update-hermes.js <revision>

  Update the Hermes submodule to the specified Git revision.

  If no Hermes revision is provided, updates to the latest commit on
  facebook/hermes.
    `);
    return;
  }

  if (revision == null) {
    console.log(
      'No revision provided, updating to latest commit on facebook/hermes.',
    );

    try {
      revision = getLatestHermesRevision();
    } catch (e) {
      console.error('Could not determine latest Hermes revision. Aborting.');
      process.exitCode = 1;
      return;
    }
  }

  if (revision === getCurrentHermesRevision()) {
    console.log('Hermes submodule is already up to date. Exiting.');
    return;
  }

  console.log(`Updating Hermes submodule to ${revision ?? 'latest'}`);

  if ((await fs.stat(path.join(REPO_ROOT, '.git'))).isDirectory()) {
    await updateSubmoduleUnderGit(revision);
  } else {
    await updateSubmoduleUnderHg(revision);
  }
}

function getCurrentHermesRevision() /*: string */ {
  const stdout = execFromRoot('git -C hermes log -n 1');

  return stdout.toString().split('\n')[0].split(' ')[1];
}

function getLatestHermesRevision() /*: string */ {
  const stdout = execFromRoot('git -C hermes log -n 1 origin/main');

  return stdout.toString().split('\n')[0].split(' ')[1];
}

async function updateSubmoduleUnderGit(revision /*: string */) {
  const commands = `
    git submodule update --remote hermes;
    git -C hermes checkout ${revision};
    git add hermes;
    git commit -m "Update Hermes to ${revision.slice(0, 8)}" -m "Changelog: [Internal]";
  `;
  commands.split(';').forEach(command => execFromRoot(command));
}

async function updateSubmoduleUnderHg(revision /*: string */) {
  await fs.writeFile(
    path.join(REPO_ROOT, 'hermes.submodule.txt'),
    `Subproject commit ${revision}\n`,
  );
  execFromRoot(
    `hg commit -m "[RN] Update Hermes to ${revision.slice(0, 8)}" -m "Changelog: [Internal]"`,
  );
}

function execFromRoot(command /*: string */, options = {}) {
  return execSync(command, {cwd: REPO_ROOT, ...options});
}

if (require.main === module) {
  // eslint-disable-next-line no-void
  void main();
}
