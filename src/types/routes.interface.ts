import { Router } from "express";

export interface Routes {
  path: string;
  isApiPath: boolean;
  router: Router;
}
