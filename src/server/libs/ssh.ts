import os from 'os';
import fs from 'fs';
import sshFingerprint from 'ssh-fingerprint';

export const getPublicKeyFingerprintsSync = (): string[] => {
  const publicKeys = [];

  const homeDir = os.homedir();
  const idRsaPub = homeDir + '/.ssh/id.rsa';
  if (fs.existsSync(idRsaPub)) {
    publicKeys.push(fs.readFileSync(idRsaPub, 'utf-8').trim());
  }

  const authorizedKeys = homeDir + '/.ssh/authorized_keys';
  if (fs.existsSync(authorizedKeys)) {
    fs.readFileSync(authorizedKeys, 'utf-8')
      .split('\n')
      .filter((l) => l)
      .forEach((l) => {
        publicKeys.push(l.trim());
      });
  }

  return publicKeys.map(sshFingerprint);
};
