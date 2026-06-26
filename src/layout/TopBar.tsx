import { Link } from "react-router";
import styles from "./TopBar.module.css";
import { IconMenu2, IconMinus, IconPlus } from "@tabler/icons-react";
import clsx from "clsx";
import { useLocale } from "../data/useLocale";
import { useStrings } from "../data/useStrings";
import { usePageZoom } from "../utils/usePageZoom";
import { useBilingual } from "../utils/useBilingual";
import { SmoothTooltip } from "../components/SmoothTooltip";
import { useDisclosure } from "@mantine/hooks";
import { Collapse, Divider, Group } from "@mantine/core";
import { BkAbbr } from "../data/bibleMetadata";
import { useBookNames } from "../data/useBookNames";
import type { LocaleBookNames } from "../data/localeTypes";

const ICON_SIZE = 17;

/** Book groupings with different colors. */
const BkAbbrGroup: Record<BkAbbr, number> = {
  Gen: 1,
  Exo: 1,
  Lev: 1,
  Num: 1,
  Deu: 1,
  Jos: 2,
  Jdg: 2,
  Rut: 2,
  "1Sa": 2,
  "2Sa": 2,
  "1Ki": 2,
  "2Ki": 2,
  "1Ch": 2,
  "2Ch": 2,
  Ezr: 2,
  Neh: 2,
  Est: 2,
  Job: 3,
  Psa: 3,
  Prv: 3,
  Ecc: 3,
  SoS: 3,
  Isa: 4,
  Jer: 4,
  Lam: 4,
  Ezk: 4,
  Dan: 4,
  Hos: 5,
  Joe: 5,
  Amo: 5,
  Oba: 5,
  Jon: 5,
  Mic: 5,
  Nah: 5,
  Hab: 5,
  Zep: 5,
  Hag: 5,
  Zec: 5,
  Mal: 5,
  Mat: 6,
  Mrk: 6,
  Luk: 6,
  Joh: 6,
  Act: 7,
  Rom: 8,
  "1Co": 8,
  "2Co": 8,
  Gal: 8,
  Eph: 8,
  Phi: 8,
  Col: 8,
  "1Th": 8,
  "2Th": 8,
  "1Ti": 8,
  "2Ti": 8,
  Tit: 8,
  Phm: 8,
  Heb: 9,
  Jam: 9,
  "1Pe": 9,
  "2Pe": 9,
  "1Jo": 9,
  "2Jo": 9,
  "3Jo": 9,
  Jud: 9,
  Rev: 10,
};

export const TopBar: React.FC = () => {
  const { locale } = useLocale();
  const bookNames = useBookNames(locale);
  const strings = useStrings();
  const [opened, { toggle, close }] = useDisclosure();

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
          </div>
        </div>

        {/* Main website title */}
        <div>
          <Link className={styles.title} to="/">
            {strings?.websiteShortTitle} 2026
          </Link>
        </div>

        {/* Take up the same space as on the left side */}
        <div className={clsx(styles.buttonsGroup, styles.rightAlign)}>
          <div className={styles.buttonsGroupInnerWrapper}>
            <div
              className={styles.button}
              style={{
                borderColor: "transparent",
                background: "transparent",
                color: "transparent",
                cursor: "default",
              }}
            >
              <IconMenu2 stroke={2} size={ICON_SIZE} />
            </div>
          </div>
        </div>
      </div>
      <div className={styles.menu}>
        <Collapse expanded={opened}>
          <div className={styles.menuContent} onClick={close}>
            <MenuTable />

            <Divider color="#555" />

            <b>{strings?.oldTestament}</b>
            <BookLinks abbrs={BkAbbr.slice(0, 39)} bookNames={bookNames} />

            <Divider color="#555" mt={6} />

            <b>{strings?.newTestament}</b>
            <BookLinks abbrs={BkAbbr.slice(39)} bookNames={bookNames} />
          </div>
        </Collapse>
      </div>
    </>
  );
};

const MenuTable: React.FC = () => {
  const { zoomIn, zoomOut, zoomPercent, setZoomPercent } = usePageZoom();
  const { locale, setLocale } = useLocale();
  const [bilingual, setBilingual] = useBilingual();
  const strings = useStrings();

  return (
    <table cellPadding={0} cellSpacing={0} border={0}>
      <tbody>
        <tr>
          <th>{strings?.fontZoom}</th>
          <td>
            <Group gap={5}>
              <SmoothTooltip label={strings?.zoomOut}>
                <div
                  className={styles.button}
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    zoomOut();
                  }}
                >
                  <IconMinus stroke={2} size={ICON_SIZE} />
                </div>
              </SmoothTooltip>
              <SmoothTooltip label={strings?.zoomIn}>
                <div
                  className={styles.button}
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    zoomIn();
                  }}
                >
                  <IconPlus stroke={2} size={ICON_SIZE} />
                </div>
              </SmoothTooltip>
              <SmoothTooltip label={strings?.resetZoom}>
                <div
                  className={clsx(
                    styles.button,
                    styles.percent,
                    styles.textButtonLong,
                  )}
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setZoomPercent(100);
                  }}
                >
                  {zoomPercent}%
                </div>
              </SmoothTooltip>
            </Group>
          </td>
        </tr>
        <tr>
          <th>{strings?.language}</th>
          <td>
            <Group gap={5}>
              <SmoothTooltip label="Switch to English">
                <div
                  className={clsx(
                    styles.button,
                    styles.textButton,
                    locale === "en-US" && !bilingual && styles.on,
                  )}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setLocale("en-US");
                    setBilingual(false);
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
                    locale === "zh-CN" && !bilingual && styles.on,
                  )}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setLocale("zh-CN");
                    setBilingual(false);
                  }}
                >
                  中
                </div>
              </SmoothTooltip>
              <SmoothTooltip label={strings?.englishMainChineseSub}>
                <div
                  className={clsx(
                    styles.button,
                    styles.textButtonLong,
                    locale === "en-US" && bilingual && styles.on,
                  )}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setLocale("en-US");
                    setBilingual(true);
                  }}
                >
                  EN + 中
                </div>
              </SmoothTooltip>
              <SmoothTooltip label={strings?.chineseMainEnglishSub}>
                <div
                  className={clsx(
                    styles.button,
                    styles.textButtonLong,
                    locale === "zh-CN" && bilingual && styles.on,
                  )}
                  role="button"
                  tabIndex={0}
                  onClick={() => {
                    setLocale("zh-CN");
                    setBilingual(true);
                  }}
                >
                  中 + EN
                </div>
              </SmoothTooltip>
            </Group>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

const BookLinks: React.FC<{
  abbrs: BkAbbr[];
  bookNames: LocaleBookNames | undefined;
}> = ({ abbrs, bookNames }) => {
  return (
    <Group gap="6px 8px">
      {abbrs.map((abbr) => {
        return (
          <Link
            className={clsx(
              styles.bookButton,
              styles[`grp${String(BkAbbrGroup[abbr])}`],
            )}
            key={abbr}
            to={`/${abbr}`}
          >
            {bookNames?.[abbr].ref}
          </Link>
        );
      })}
    </Group>
  );
};
