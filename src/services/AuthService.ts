import { Store } from "vuex";
import { HttpService } from "./HttpService";
import { User } from "@/models/data/User";

export class AuthService {
  private readonly httpService: HttpService;

  private store: Store<unknown> | null = null;

  private user: User | null = null;
  private masterAdminSessionId = false;

  constructor(httpService: HttpService) {
    this.httpService = httpService;
  }

  public setStore(store: Store<unknown>) {
    this.store = store;
  }

  public setLoggedUser(user: User | null, masterAdmin = false) {
    const sessionId = user !== null ? user.password : null;

    this.user = user;
    this.masterAdminSessionId = masterAdmin;

    this.httpService.setSessionId(sessionId);

    if (this.store !== null) {
      this.store.commit("setLoggedUser", {
        isLogged: this.isLogged,
        isMasterAdminLogged: this.isMasterAdminLogged
      });
    }
  }

  get isLogged() {
    return this.user !== null;
  }
  get isMasterAdminLogged() {
    return this.isLogged && this.masterAdminSessionId;
  }

  get loggedUser() {
    return this.user;
  }
}
