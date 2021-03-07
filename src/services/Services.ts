import { HttpService } from "./HttpService";
import { AuthService } from "./AuthService";

class ServicesSingleton {
  public httpService: HttpService;
  public authService: AuthService;

  constructor() {
    this.httpService = new HttpService();
    this.authService = new AuthService(this.httpService);
  }
}

export const Services = new ServicesSingleton();
