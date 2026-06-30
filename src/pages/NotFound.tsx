import { Space, Stack, Title } from "@mantine/core";
import { LinkButton } from "../components/LinkButton";
import { IconHome } from "@tabler/icons-react";
import { PageSpinner } from "../components/PageSpinner";
import { useStrings } from "../data/useStrings";
import { useSearchParams } from "react-router";

const NotFound: React.FC = () => {
  const strings = useStrings();
  const [searchParams] = useSearchParams();

  if (!strings) {
    return <PageSpinner />;
  }

  // This will update on every route change
  const fromUrl = searchParams.get("url");

  return (
    <Stack h="100%" flex={1} justify="center" align="center">
      <Title order={4} fw={500} ff="Georgia" ta="center">
        <div>{strings.notFoundLine1}</div>
        <div>{strings.notFoundLine2}</div>
      </Title>
      <LinkButton
        to="/"
        style={{
          padding: "6px 20px",
          borderRadius: "12px",
          fontStyle: "italic",
        }}
      >
        <IconHome size={16} /> &nbsp;{strings.takeMeHome}
      </LinkButton>
      {!!fromUrl && (
        <div style={{ fontStyle: "italic", fontSize: "85%" }}>
          <span style={{ fontWeight: 550 }}>Requested URL:</span> {fromUrl}
        </div>
      )}
      <Space h="30vh" />
    </Stack>
  );
};

export default NotFound;
