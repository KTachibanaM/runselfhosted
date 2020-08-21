#!/usr/bin/env bash
set -e

DUMMY_REPO_DIR=/tmp/runselfhosted/dummy-repo
rm -rf ${DUMMY_REPO_DIR}
git clone https://github.com/DIYgod/RSSHub.git ${DUMMY_REPO_DIR}

pushd ${DUMMY_REPO_DIR}
git checkout master
popd

echo "Please add an app with git url 'file://${DUMMY_REPO_DIR}' and git branch 'master'"
