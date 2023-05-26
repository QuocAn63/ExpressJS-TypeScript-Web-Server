import { Request, Response } from "express";
import { google } from "googleapis";
import userModel from "../models/user";

export const oauth2Client = new google.auth.OAuth2(
  "743433801669-j169dda6jeac7uu97a1rgrpqev40jmhm.apps.googleusercontent.com",
  "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",
  "http://localhost:3001/api/auth/google/callback"
);
let userCredential = null;

export const login = async (req: Request, res: Response) => {};

export const register = async (req: Request, res: Response) => {};

export const handleGoogleLoginRequest = async (req: Request, res: Response) => {
  const scope = "https://www.googleapis.com/auth/userinfo.profile";

  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope,
    include_granted_scopes: true,
  });

  res.status(301).redirect(authorizationUrl);
};

export const handleGoogleLoginCallback = async (
  req: Request,
  res: Response
) => {
  let q = req.query;

  if (q.error) {
    console.log(q.error);
  } else {
    let { tokens } = (await oauth2Client.getToken(q.code as string)) as any;
    oauth2Client.setCredentials(tokens);
    userCredential = tokens;

    const auth = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data } = await auth.userinfo.get();

    if (data.id) {
      const userResponse = await userModel.findOne({ googleId: data.id });

      if (userResponse !== null) {
        res.render("todo/index", { user: userResponse });
      } else {
        const userCreationResult = await userModel.create({
          googleId: data.id,
          name: data.name,
        });

        res.render("todo/index", { user: userCreationResult });
      }
    } else {
      res.redirect("todo/index");
    }
  }
};
