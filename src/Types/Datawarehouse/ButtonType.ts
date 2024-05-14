export type ButtonType = {
  identifier: string;
  type?: 'button';
  testIdPrefix: string;
  url?: (e: any) => string | string;
  hint: string;
  cssClasses: (e: any, identifier: any) => string;
  onClick: (e: any) => void;
  visible?: (e: any) => boolean;
  disabled?: (e: any) => boolean;
};
