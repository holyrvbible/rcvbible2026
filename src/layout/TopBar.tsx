import { useNavigate } from "react-router";
import styles from "./TopBar.module.css";
import {
  IconArrowLeft,
  IconArrowRight,
  IconHome,
  IconMenu2,
} from "@tabler/icons-react";
import clsx from "clsx";
import { TopBarSearch } from "../search/TopBarSearch";
import { useDisclosure } from "@mantine/hooks";
import { useRef } from "react";
import { TopBarMenu } from "./TopBarMenu";

const ICON_SIZE = 17;

export const TopBar: React.FC = () => {
  const [opened, { toggle, close }] = useDisclosure();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const closeSearchOverlayRef = useRef<(() => void) | null>(null);
  const navigate = useNavigate();

  return (
    <>
      <div className={styles.root}>
        {/* Menu toggle button */}
        <div className={styles.buttonsGroup}>
          <div className={styles.buttonsGroupInnerWrapper}>
            <div
              className={styles.button}
              role="button"
              tabIndex={0}
              onClick={toggle}
            >
              <IconMenu2 stroke={2} size={ICON_SIZE} />
            </div>
            <div
              className={styles.button}
              role="button"
              tabIndex={0}
              onClick={() => {
                if (window.history.length > 1) {
                  void navigate(-1);
                } else {
                  void navigate("/"); // fallback route
                }
              }}
            >
              <IconArrowLeft stroke={2} size={ICON_SIZE} />
            </div>
          </div>
        </div>

        <TopBarSearch
          searchInputRef={searchInputRef}
          closeSearchOverlayRef={closeSearchOverlayRef}
        />

        {/* Take up the same space as on the left side */}
        <div className={clsx(styles.buttonsGroup, styles.rightAlign)}>
          <div className={styles.buttonsGroupInnerWrapper}>
            <div
              className={styles.button}
              role="button"
              tabIndex={0}
              onClick={() => {
                void navigate(1);
              }}
            >
              <IconArrowRight stroke={2} size={ICON_SIZE} />
            </div>
            <div
              className={styles.button}
              role="button"
              tabIndex={0}
              onClick={() => {
                void navigate("/");
                closeSearchOverlayRef.current?.();
              }}
            >
              <IconHome stroke={2} size={ICON_SIZE} />
            </div>
          </div>
        </div>
      </div>
      <TopBarMenu
        opened={opened}
        onClose={close}
        searchInputRef={searchInputRef}
      />
    </>
  );
};
