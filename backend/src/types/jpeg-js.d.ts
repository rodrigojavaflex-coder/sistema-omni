declare module 'jpeg-js' {
  export function decode(
    jpegData: Buffer | Uint8Array,
    opts?: {
      useTArray?: boolean;
      formatAsRGBA?: boolean;
      maxMemoryUsageInMB?: number;
    },
  ): { data: Buffer | Uint8Array; width: number; height: number };
}
