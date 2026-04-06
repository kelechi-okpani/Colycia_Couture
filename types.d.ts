declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';
  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
  }
  export type Icon = FC<IconProps>;
  // Add these explicitly to stop the "Export doesn't exist" error
  export const Facebook: Icon;
  export const Twitter: Icon;
  export const Instagram: Icon;
  export const Youtube: Icon;
  export const Linkedin: Icon;
  export const Search: Icon;
  export const ShoppingBag: Icon;
  export const User: Icon;
  export const Menu: Icon;
  export const X: Icon;
  export const ArrowRight: Icon;
  export const ShoppingCart: Icon;
}