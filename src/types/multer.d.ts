// src/types/multer.d.ts
declare module '@koa/multer' {
  import * as Koa from 'koa';
  import * as multer from 'multer';

  // 1. 扩展我们自己的 options，允许 req 为 any 或 Koa.Request
  interface KoaDiskStorageOptions {
    destination?: (req: any, file: multer.File, callback: (error: Error | null, destination: string) => void) => void;
    filename?: (req: any, file: multer.File, callback: (error: Error | null, filename: string) => void) => void;
  }

  function Multer(options?: multer.Options): Multer.Instance;

  namespace Multer {
    // 2. 导出支持 Koa 的 diskStorage 方法
    export function diskStorage(options: KoaDiskStorageOptions): multer.StorageEngine;

    export interface Instance {
      single(fieldname: string): Koa.Middleware;
      array(fieldname: string, maxCount?: number): Koa.Middleware;
      fields(fields: readonly multer.Field[]): Koa.Middleware;
      none(): Koa.Middleware;
      any(): Koa.Middleware;
    }
  }

  export = Multer;
}

