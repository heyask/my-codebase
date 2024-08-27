import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 h-full min-h-[50vh] pb-48">
      <h1 className="text-6xl font-bold">404</h1>
      <p>Page not found</p>
      <Link href="/">Home</Link>
    </div>
  );
}
