export interface Response<T = never> {
  code: string;
  data: T;
}
