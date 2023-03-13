export interface CredentialsResponseData {
  readonly accessToken: string;
  readonly emailVerified: boolean;
  readonly refreshToken: string;
  readonly id: string;
}
