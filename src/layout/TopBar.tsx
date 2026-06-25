import { Link } from "react-router";
import styles from "./TopBar.module.css";
import { IconLanguage, IconMinus, IconPlus } from "@tabler/icons-react";
import clsx from "clsx";
import { useLocale } from "../data/useLocale";
import { useStrings } from "../data/useStrings";
import { usePageZoom } from "../utils/usePageZoom";
import { useBilingual } from "../utils/useBilingual";
import { SmoothTooltip } from "../components/SmoothTooltip";

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
          <SmoothTooltip label={strings?.zoomOut}>
            <div
              className={styles.button}
              role="button"
              tabIndex={0}
              onClick={zoomOut}
            >
              <IconMinus stroke={2} size={ICON_SIZE} />
            </div>
          </SmoothTooltip>
          <SmoothTooltip label={strings?.zoomIn}>
            <div
              className={styles.button}
              role="button"
              tabIndex={0}
              onClick={zoomIn}
            >
              <IconPlus stroke={2} size={ICON_SIZE} />
            </div>
          </SmoothTooltip>
          <div className={styles.percent}>{zoomPercent}%</div>
        </div>
      </div>
      <div>
        <Link className={styles.title} to="/">
          {strings?.websiteShortTitle} 2026
        </Link>
      </div>
      <div className={clsx(styles.buttonsGroup, styles.rightAlign)}>
        <div
          className={clsx(styles.buttonsGroupInnerWrapper, styles.rightAlign)}
        >
          <SmoothTooltip label="Switch to English">
            <div
              className={clsx(
                styles.button,
                styles.textButton,
                locale === "en-US" && styles.on,
              )}
              role="button"
              tabIndex={0}
              onClick={() => {
                setLocale("en-US");
              }}
            >
              EN
            </div>
          </SmoothTooltip>
          <SmoothTooltip label="使用中文">
            <div
              className={clsx(
                styles.button,
                styles.textButton,
                locale === "zh-CN" && styles.on,
              )}
              role="button"
              tabIndex={0}
              onClick={() => {
                setLocale("zh-CN");
              }}
              style={{
                paddingLeft: 9,
                paddingRight: 9,
              }}
            >
              中
            </div>
          </SmoothTooltip>
          <SmoothTooltip label={strings?.toggleBilingualMode}>
            <div
              className={clsx(styles.button, bilingual && styles.on)}
              role="button"
              tabIndex={0}
              onClick={() => {
                setBilingual((v) => !v);
              }}
            >
              <IconLanguage stroke={2} size={ICON_SIZE} />
            </div>
          </SmoothTooltip>
        </div>
      </div>
    </div>
  );
};
