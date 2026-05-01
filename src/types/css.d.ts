// Allows TypeScript to accept CSS files as side-effect imports
// e.g. import './globals.css' in layout.tsx
declare module "*.css" {
  const content: Record<string, string>;
  export default content;
}
