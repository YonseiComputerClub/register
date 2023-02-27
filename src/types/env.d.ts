declare module NodeJS {
  interface ProcessEnv {
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;

    IPA_SERVER_URL: string;
    IPA_SERVER_USERNAME: string;
    IPA_SERVER_PASSWORD: string;
  }
}
