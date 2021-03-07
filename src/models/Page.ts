export interface Page {
  title: string;
  icon: string;
  sourcePage?: string;

  isVisible?(): boolean;
  action?(): void;
}
