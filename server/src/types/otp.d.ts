declare module '*/services/otp' {
  export const sendOtpEmail: (...args: any[]) => Promise<any>;
  export class OtpService {
    static sendOtp: (...args: any[]) => Promise<any>;
    static generateOtpForStaff: (...args: any[]) => Promise<any>;
    [key: string]: any;
  }
  const defaultExport: any;
  export default defaultExport;
}

declare module '@/services/otp' {
  export * from '*/services/otp';
  import def from '*/services/otp';
  export default def;
}
