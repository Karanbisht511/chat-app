declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
    PORT: string;
    DATABASE_URL: string;
    JWT_SECRET:string;
    MONGO_URI:string;
    // add more environment variables and their types here
  }
}
