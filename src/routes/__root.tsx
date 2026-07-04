import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-matte">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-matte">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-matte px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-matte/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-matte">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-matte px-4 py-2 text-sm font-medium text-cream transition-colors hover:bg-matte/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-cream px-4 py-2 text-sm font-medium text-matte transition-colors hover:bg-muted"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Toulmin Projects — From Concept to Flawless Execution | Taupō, NZ" },
      {
        name: "description",
        content:
          "Independent events and marketing consultancy led by Louise Toulmin. Event management for luxury incentive partners and strategic marketing for corporate clients. From concept to flawless execution.",
      },
      { name: "author", content: "Toulmin Projects" },
      { property: "og:title", content: "Toulmin Projects — From concept to flawless execution" },
      {
        property: "og:description",
        content:
          "Event management and delivery for luxury incentive partners. Marketing strategy and execution for corporate clients. Based in Taupō, New Zealand.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Toulmin Projects" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@100..700,400;100..700,500;100..700,600;100..700,700&family=Playfair+Display:ital,wght@0,400..900;0,700;1,400..900&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ProfessionalService",
          name: "Toulmin Projects",
          description:
            "Independent events and marketing consultancy led by Louise Toulmin. Event management for luxury incentive partners and strategic marketing for corporate clients.",
          founder: { "@type": "Person", name: "Louise Toulmin" },
          areaServed: "New Zealand",
          address: {
            "@type": "PostalAddress",
            addressLocality: "Taupō",
            addressCountry: "NZ",
          },
          email: "louise@toulminprojects.co.nz",
          url: "https://www.toulminprojects.co.nz",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
