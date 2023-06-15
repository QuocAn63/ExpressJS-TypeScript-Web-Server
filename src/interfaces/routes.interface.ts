import { Router } from "express";

// export interface Routes {
//   path: string;
//   isApiPath: boolean;
//   router: Router;
// }

export abstract class Routes {
  abstract path: string;
  abstract isApiPath: boolean;
  abstract router: Router;

  constructor() {
    this.initializeRoutes();
  }

  abstract initializeRoutes(): void;
}
