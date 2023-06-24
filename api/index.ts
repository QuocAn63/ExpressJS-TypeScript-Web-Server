import { App } from "../src/app";
import AuthRoute from "../src/router/auth";
import ProductRoute from "../src/router/product";
import PromotionRoute from "../src/router/promotion";
import UserRoute from "../src/router/user";

const app = new App(
  new AuthRoute(),
  new UserRoute(),
  new ProductRoute(),
  new PromotionRoute()
);

app.listen();
