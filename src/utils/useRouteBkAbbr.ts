import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { BkAbbrFromLower } from "../data/bibleMetadata";

/** Read the book abbreviation from the ":abbr" route param. */
export function useRouteBkAbbr() {
  const maybeAbbr = useParams().abbr;
  const navigate = useNavigate();
  const abbr = maybeAbbr && BkAbbrFromLower[maybeAbbr.toLocaleLowerCase()];

  useEffect(() => {
    if (!abbr) void navigate("/404");
  }, [abbr, navigate]);

  return abbr;
}
