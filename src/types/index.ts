export interface IRequestWithOauthCallback extends Request {
  loginMethod: "google" | "github" | "facebook";
  user: string;
}
