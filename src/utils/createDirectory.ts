import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const createDir = promisify(fs.mkdir);

const createDirectory = async (dir:string) => {
  if (!fs.existsSync(path.join(process.cwd(), dir))) {
    await createDir(path.join(process.cwd(), dir));
  }
};

export { createDirectory };
