/// <reference types="node" />
import fs from 'fs';
declare const writeFile: typeof fs.writeFile.__promisify__;
export { writeFile };
