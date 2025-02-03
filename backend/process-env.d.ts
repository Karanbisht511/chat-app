declare namespace NodeJS {
  interface ProcessEnv {
    [key: string]: string | undefined;
    PORT: string;
    DATABASE_URL: string;
    JWT_SECRET:string;
    MONGO_URI:string;
    admin:string;
    adminPass:string;
    clientURL:string;
    PORT:number;
    NODE_ENV:string
    // add more environment variables and their types here
  }
}
