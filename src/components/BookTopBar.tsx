import { BkAbbr } from "../data/bibleMetadata";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { Group } from "@mantine/core";
import { LinkButton } from "../components/LinkButton";
import { useLocale } from "../data/useLocale";
import { useBookNames } from "../data/useBookNames";
import { getNextBook, getPrevBook, linkTo } from "../utils/links";

export const BookTopBar: React.FC<{
  abbr: BkAbbr;
}> = ({ abbr }) => {
  const { locale } = useLocale();
  const bookNames = useBookNames(locale);

  const prevAbbr = getPrevBook(abbr);
  const nextAbbr = getNextBook(abbr);

  return (
    <Group justify="space-between" opacity={0.7}>
      <LinkButton
        style={{
          fontSize: "80%",
          borderRadius: 12,
          padding: "2px 7px 2px 4px",
          gap: 4,
          color: "#292",
          border: "1px solid #eee",
        }}
        to={linkTo(prevAbbr)}
      >
        <IconArrowLeft size={16} />
        {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
        {bookNames?.[prevAbbr]?.ref}
      </LinkButton>

      <LinkButton
        style={{
          fontSize: "80%",
          borderRadius: 12,
          padding: "2px 4px 2px 7px",
          gap: 4,
          color: "#292",
          border: "1px solid #eee",
        }}
        to={linkTo(nextAbbr)}
      >
        {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition */}
        {bookNames?.[nextAbbr]?.ref}
        <IconArrowRight size={16} />
      </LinkButton>
    </Group>
  );
};
