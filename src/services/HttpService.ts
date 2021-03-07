import axios, { AxiosRequestConfig } from "axios";

export class HttpService {
  private sessionId: string | null = null;

  private get config() {
    const config: AxiosRequestConfig = {};

    if (this.sessionId !== null) {
      config.headers = { "session-id": this.sessionId };
    }

    return config;
  }

  public setSessionId(sessionId: string | null) {
    this.sessionId = sessionId;
  }

  public get(url: string) {
    return axios.get(url, this.config);
  }
  public post(url: string, data: unknown) {
    return axios.post(url, data, this.config);
  }
  public delete(url: string) {
    return axios.delete(url, this.config);
  }
}
