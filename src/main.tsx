import "./main.css";
import "@mantine/core/styles.css";

import { createBrowserRouter, RouterProvider } from "react-router";
import { StrictMode, Suspense, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Home } from "./pages/Home";
import { BkAbbr } from "./data/bibleMetadata";
import { PageSpinner } from "./components/PageSpinner";
import { BookLazy } from "./pages/BookLazy";
import { NotFoundLazy } from "./pages/NotFoundLazy";
import { BooChapterLazy } from "./pages/BookChapterLazy";
import { Layout } from "./layout/Layout";
import { useIsMobile } from "./utils/useIsMobile";
import { useStrings } from "./data/useStrings";

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

      // Add one page per book.
      ...BkAbbr.map((abbr) => ({
        path: abbr.toLowerCase(),
        element: (
          <Suspense>
            <BookLazy abbr={abbr} />
          </Suspense>
        ),
      })),

      // Add book chapters.
      ...BkAbbr.map((abbr) => ({
        path: `${abbr.toLowerCase()}/:chapter`,
        element: (
          <Suspense>
            <BooChapterLazy abbr={abbr} />
          </Suspense>
        ),
      })),

      // Used for debugging only.
      {
        path: "spin",
        element: (
          <Suspense>
            <PageSpinner />
          </Suspense>
        ),
      },

      // Catch-all route - must be last.
      {
        path: "*",
        element: (
          <Suspense>
            <NotFoundLazy />
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
