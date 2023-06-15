import { App } from "./app";
import AuthRoute from "./router/authenticate";
import UserRoute from "./router/user";

const app = new App(new AuthRoute(), new UserRoute());

app.listen();
