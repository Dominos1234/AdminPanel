export class FileUtils {
  static readFile(
    input: HTMLInputElement
  ): Promise<[ArrayBuffer, File] | null> {
    const files = input.files;

    return new Promise(resolve => {
      if (files !== null && files.length === 1) {
        const fileReader = new FileReader();

        fileReader.onloadend = () => {
          const { result } = fileReader;

          if (result instanceof ArrayBuffer) {
            resolve([result, files[0]]);
          } else {
            resolve(null);
          }

          input.value = "";
        };

        fileReader.readAsArrayBuffer(files[0]);
      } else {
        resolve(null);
      }
    });
  }

  static readFileAsBase64(file: File): Promise<string | null> {
    return new Promise(resolve => {
      const fileReader = new FileReader();

      fileReader.onloadend = () => {
        const { result } = fileReader;

        if (typeof result === "string") {
          resolve(result);
        } else {
          resolve(null);
        }
      };

      fileReader.readAsDataURL(file);
    });
  }
}
