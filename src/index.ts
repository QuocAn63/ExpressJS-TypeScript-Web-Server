import { App } from "./app";
import AuthRoute from "./router/auth";
import ProductRoute from "./router/product";
import PromotionRoute from "./router/promotion";
import UserRoute from "./router/user";

const app = new App(
  new AuthRoute(),
  new UserRoute(),
  new ProductRoute(),
  new PromotionRoute()
);

app.listen();
