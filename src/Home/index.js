import { Container, Title, Space, Divider } from "@mantine/core";

import Items from "../Items";

function Home() {
  return (
    <Container>
      <Space h="50px" />
      <Title align="center" color="red">
        Personal Shopping List
      </Title>
      <Space h="20px" />
      <Title order={2} align="center">
        List
      </Title>
      <Space h="30px" />
      <Divider />
      <Space h="30px" />
      {/* list all the movies here */}
      <Items />
    </Container>
  );
}

export default Home;
