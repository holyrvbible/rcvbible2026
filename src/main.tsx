import "./main.css";
import "@mantine/core/styles.css";

import { registerSW } from "virtual:pwa-register";
import { createBrowserRouter, RouterProvider } from "react-router";
import { installPreloadErrorHandler } from "./utils/installPreloadErrorHandler";

registerSW({ immediate: true });
installPreloadErrorHandler();

import { StrictMode, Suspense, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Home } from "./pages/Home";
import { PageSpinner } from "./components/PageSpinner";
import { BookLazy } from "./pages/BookLazy";
import { NotFoundLazy } from "./pages/NotFoundLazy";
import { BookChapterLazy } from "./pages/BookChapterLazy";
import { Layout } from "./layout/Layout";
import { useIsMobile } from "./utils/useIsMobile";
import { useStrings } from "./data/useStrings";
import { SupportedLocales } from "./data/localeTypes";
import { RedirectToNotFound } from "./pages/RedirectToNotFound";

const SuspenseFallback: React.FC = () => {
  const strings = useStrings();
  return strings ? <div>{strings.loading}</div> : <PageSpinner />;
};

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing root element");
}

const router = createBrowserRouter([
  // Don't lazy load the home page.
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "index.html", element: <Home /> },

      // Used for debugging only.
      {
        path: "spin",
        element: (
          <Suspense>
            <PageSpinner />
          </Suspense>
        ),
      },

      ...SupportedLocales.flatMap((locale) => [
        // Add locale home page.
        {
          path: locale,
          element: (
            <Suspense>
              <Home />
            </Suspense>
          ),
        },

        // Add locale book overviews.
        {
          path: `${locale}/:abbr`,
          element: (
            <Suspense>
              <BookLazy />
            </Suspense>
          ),
        },

        // Add locale book chapters.
        {
          path: `${locale}/:abbr/:chapter`,
          element: (
            <Suspense>
              <BookChapterLazy />
            </Suspense>
          ),
        },
      ]),

      // --- Make sure to put all named routes above this line. ---

      // Add book overviews.
      {
        path: `:abbr`,
        element: (
          <Suspense>
            <BookLazy />
          </Suspense>
        ),
      },

      // Add book chapters.
      {
        path: `:abbr/:chapter`,
        element: (
          <Suspense>
            <BookChapterLazy />
          </Suspense>
        ),
      },

      // Locale 404 pages.
      ...SupportedLocales.map((locale) => ({
        path: `${locale}/404`,
        element: (
          <Suspense>
            <NotFoundLazy />
          </Suspense>
        ),
      })),

      // Catch-all route - must be last.
      {
        path: "*",
        element: (
          <Suspense>
            <RedirectToNotFound />
          </Suspense>
        ),
      },
    ],
  },
]);

// Exporting only to suppress the fast refresh error.
export const Root: React.FC = () => {
  // Apply a global class name for mobile sizes.
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      root.classList.remove("desktop");
      root.classList.add("mobile");
    } else {
      root.classList.remove("mobile");
      root.classList.add("desktop");
    }
  }, [isMobile]);

  return (
    <StrictMode>
      <Suspense fallback={<SuspenseFallback />}>
        <RouterProvider router={router} />
      </Suspense>
    </StrictMode>
  );
};

createRoot(root).render(<Root />);
