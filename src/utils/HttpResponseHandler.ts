import { AxiosResponse } from "axios";
import { Response } from "@/models/Response";
import { ISnackbar } from "@/models/ISnackbar";

export class HttpResponseHandler {
  private parent: Vue | null = null;
  private snackbar: ISnackbar | null = null;

  private showMessage(code: string) {
    if (this.parent !== null && this.snackbar !== null) {
      const message = this.parent.$t(`http.${code}`).toString();

      this.snackbar.show(message);
    }
  }

  public init(parent: Vue, snackbar: ISnackbar) {
    this.parent = parent;
    this.snackbar = snackbar;
  }

  public handle<T>(
    request: Promise<AxiosResponse<Response<T>>>
  ): Promise<T | null> {
    return new Promise(resolve => {
      request
        .then((value: AxiosResponse<Response<T>>) => {
          const code = value.data.code;

          if (code === "correct") {
            resolve(value.data.data);
          } else {
            this.showMessage(code);

            resolve(null);
          }
        })
        .catch(() => {
          this.showMessage("unknownError");

          resolve(null);
        });
    });
  }
}
