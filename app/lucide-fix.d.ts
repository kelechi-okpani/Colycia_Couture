// app/lucide-fix.d.ts or src/lucide-fix.d.ts

declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react';
  
  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    color?: string;
    strokeWidth?: string | number;
  }

  export type LucideIcon = ComponentType<LucideProps>;

  // Explicitly force declare the missing chevron components
  export const ChevronRight: LucideIcon;
  export const ChevronLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const Scissors: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Globe: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const Bell: LucideIcon;
  export const Home: LucideIcon;
  export const Users: LucideIcon;
  export const ShoppingBag: LucideIcon;
  export const Package: LucideIcon;
  export const Settings: LucideIcon;
  export const LogOut: LucideIcon;



  
  // Dynamic fallback to catch any other unmapped exports safely
  const content: Record<string, LucideIcon>;
  export default content;
}

