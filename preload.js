import { contextBridge } from 'electron';
import fs from 'fs';

contextBridge.exposeInMainWorld('fsAPI', {
  readFile: (path, encoding = 'utf8') => fs.readFileSync(path, encoding),
  writeFile: (path, data) => fs.writeFileSync(path, data)
});
