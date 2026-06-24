import { Link } from "react-router";
import styles from "./TopBar.module.css";
import { IconLanguage, IconMinus, IconPlus } from "@tabler/icons-react";
import clsx from "clsx";
import { useLocale } from "../data/useLocale";
import { useStrings } from "../data/useStrings";
import { usePageZoom } from "../utils/usePageZoom";
import { useBilingual } from "../utils/useBilingual";
import { Tooltip } from "@mantine/core";

const ICON_SIZE = 17;

export const TopBar: React.FC = () => {
  const { zoomIn, zoomOut, zoomPercent } = usePageZoom();
  const { locale, setLocale } = useLocale();
  const [bilingual, setBilingual] = useBilingual();
  const strings = useStrings();

  return (
    <div className={styles.root}>
      <div className={styles.buttonsGroup}>
        <div className={styles.buttonsGroupInnerWrapper}>
          <Tooltip label="Zoom out">
            <div
              className={styles.button}
              role="button"
              tabIndex={0}
              onClick={zoomOut}
            >
              <IconMinus stroke={2} size={ICON_SIZE} />
            </div>
          </Tooltip>
          <Tooltip label="Zoom in">
            <div
              className={styles.button}
              role="button"
              tabIndex={0}
              onClick={zoomIn}
            >
              <IconPlus stroke={2} size={ICON_SIZE} />
            </div>
          </Tooltip>
          <div className={styles.percent}>{zoomPercent}%</div>
        </div>
      </div>
      <div>
        <Link className={styles.title} to="/">
          <span className={styles.longTitle}>{strings?.websiteTitle}</span>
          <span className={styles.shortTitle}>
            {strings?.websiteShortTitle}
          </span>
        </Link>
      </div>
      <div className={clsx(styles.buttonsGroup, styles.rightAlign)}>
        <div
          className={clsx(styles.buttonsGroupInnerWrapper, styles.rightAlign)}
        >
          <Tooltip label="Switch to English">
            <div
              className={clsx(styles.button, locale === "en-US" && styles.on)}
              role="button"
              tabIndex={0}
              onClick={() => {
                setLocale("en-US");
              }}
            >
              EN
            </div>
          </Tooltip>
          <Tooltip label="使用中文">
            <div
              className={clsx(styles.button, locale === "zh-CN" && styles.on)}
              role="button"
              tabIndex={0}
              onClick={() => {
                setLocale("zh-CN");
              }}
            >
              中
            </div>
          </Tooltip>
          <Tooltip label="Toggle bilingual mode">
            <div
              className={clsx(styles.button, bilingual && styles.on)}
              role="button"
              tabIndex={0}
              onClick={() => {
                setBilingual((v) => !v);
              }}
            >
              <IconLanguage stroke={2} />
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
