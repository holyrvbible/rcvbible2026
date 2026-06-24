import { Space, Stack, Title } from "@mantine/core";
import { LinkButton } from "../components/LinkButton";
import { IconHome } from "@tabler/icons-react";
import { PageSpinner } from "../components/PageSpinner";
import { useStrings } from "../data/useStrings";

const NotFound: React.FC = () => {
  const strings = useStrings();

  if (!strings) {
    return <PageSpinner />;
  }

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
      <Space h="30vh" />
    </Stack>
  );
};

export default NotFound;
