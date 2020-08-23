import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const tmpRoot = '/tmp/runselfhosted';

export const getTmpDirSync = (prefix: string) => {
  if (!fs.existsSync(tmpRoot)) {
    fs.mkdirSync(tmpRoot);
  }

  return tmpRoot + `/${prefix}-${uuidv4()}`;
};
