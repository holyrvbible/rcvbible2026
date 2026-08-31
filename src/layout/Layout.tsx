import styles from "./Layout.module.css";
import { TopBar } from "./TopBar";
import { Outlet } from "react-router";
import { MantineProvider } from "@mantine/core";
import { AutoScrollToHash } from "../components/AutoScrollToHash";
import { useInitLocale } from "../data/useLocale";
import { useRecallLastPathname } from "../utils/useRecallLastPathname";

export const Layout: React.FC = () => {
  useInitLocale();
  useRecallLastPathname();

  return (
    <MantineProvider>
      <div className={styles.root}>
        <div className={styles.topBar}>
          <TopBar />
        </div>
        <main className={styles.content}>
          <Outlet />
          <AutoScrollToHash />
        </main>
      </div>
    </MantineProvider>
  );
};
