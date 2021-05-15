export type Session = {
  credentials: {
    accessToken: string;
    expiry: number;
    client: string;
    tokenType: string;
    uid: string;
  };
  name?: string;
  identifier: string;
};
