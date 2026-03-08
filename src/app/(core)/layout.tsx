/**
 * Public route group: home, search, property listing/detail.
 * URLs unchanged: /, /search, /properties/[id]
 */
export default function PublicLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <>{children}</>;
}
