export interface ConditionalContainer<T, V> {
  data: T;
  isVisible?: (parameter: V) => boolean;
}
