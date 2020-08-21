#!/usr/bin/env bash
set -e

DUMMY_REPO_DIR=/tmp/runselfhosted/dummy-repo

pushd ${DUMMY_REPO_DIR}
git checkout master
echo "foobar" >> dummy.txt
git add dummy.txt
git commit -m "foobar"
git rev-parse --verify master
popd
