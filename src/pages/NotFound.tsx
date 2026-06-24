import { Space, Stack, Title } from "@mantine/core";
import { LinkButton } from "../components/LinkButton";
import { IconHome } from "@tabler/icons-react";

const NotFound: React.FC = () => {
  return (
    <Stack h="100%" flex={1} justify="center" align="center">
      <Title order={4} fw={500} ff="Georgia" ta="center">
        <div>Sorry we couldn&rsquo;t find that page, but our</div>
        <div>homepage is a great starting point.</div>
      </Title>
      <LinkButton
        to="/"
        style={{
          padding: "6px 20px",
          borderRadius: "12px",
          fontStyle: "italic",
        }}
      >
        <IconHome size={16} /> &nbsp;Take me home
      </LinkButton>
      <Space h="30vh" />
    </Stack>
  );
};

export default NotFound;
