import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Title, Grid, Card, Badge, Group, Space, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";

function Items() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/items")
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const filterItem = async (priority = "") => {
    try {
      const response = await axios.get(
        "http://localhost:5000/items?priority=" + priority
      );
      setItems(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const filterItem1 = async (purchased = "") => {
    try {
      const response = await axios.get(
        "http://localhost:5000/items?purchased=" + purchased
      );
      setItems(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleItemDelete = async (item_id) => {
    try {
      await axios({
        method: "DELETE",
        url: "http://localhost:5000/items/" + item_id,
      });
      // show movie is delete message
      notifications.show({
        title: "Item Deleted",
        color: "green",
      });
      // method 1 (modify the state) - filter out the deleted movie
      const newItems = items.filter((m) => m._id !== item_id);
      setItems(newItems);
    } catch (error) {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    }
  };

  const updatePurchased = async (item_id) => {
    try {
      await axios.put(`http://localhost:5000/items/${item_id}`, {
        purchased: true,
      });

      notifications.show({
        title: "Purchase Updated",
        color: "green",
      });

      const updatedItems = items.filter((m) => m._id !== item_id);
      setItems(updatedItems);
    } catch (error) {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    }
  };

  return (
    <>
      <Group position="apart">
        <Title order={3} align="center">
          Lists
        </Title>
        <Button component={Link} to="/item_add" color="red">
          Add New
        </Button>
      </Group>
      <Space h="20px" />
      <Group>
        <Button
          onClick={() => {
            filterItem("");
          }}
        >
          All
        </Button>
        <Button
          onClick={() => {
            filterItem("Low");
          }}
        >
          Low
        </Button>
        <Button
          onClick={() => {
            filterItem("Medium");
          }}
        >
          Medium
        </Button>
        <Button
          onClick={() => {
            filterItem("High");
          }}
        >
          High
        </Button>
        <Button
          onClick={() => {
            filterItem1("no");
          }}
        >
          Not Purchased
        </Button>
        <Button
          onClick={() => {
            filterItem1("yes");
          }}
        >
          Purchased
        </Button>
      </Group>
      <Space h="20px" />
      <Grid>
        {items
          ? items.map((item) => {
              return (
                <Grid.Col key={item._id} span={4}>
                  <Card withBorder shadow="sm">
                    <Title order={5}>{item.name}</Title>
                    <Space h="20px" />
                    <Group position="center" spacing="5px">
                      <Badge
                        variant="gradient"
                        gradient={{ from: "indigo", to: "purple" }}
                      >
                        {item.quantity}
                      </Badge>
                      <Badge
                        variant="gradient"
                        gradient={{ from: "red", to: "blue" }}
                      >
                        {item.unit}
                      </Badge>
                      <Badge color="yellow">{item.priority}</Badge>
                    </Group>
                    <Space h="20px" />
                    <Group position="apart">
                      <Button
                        component={Link}
                        to={"/items/" + item._id}
                        color="blue"
                        size="xs"
                        radius="50px"
                      >
                        Edit
                      </Button>
                      <Button
                        color="dark"
                        size="xs"
                        radius="50px"
                        onClick={() => {
                          updatePurchased(item._id);
                        }}
                      >
                        Purchased
                      </Button>
                      <Button
                        color="red"
                        size="xs"
                        radius="50px"
                        onClick={() => {
                          handleItemDelete(item._id);
                        }}
                      >
                        Delete
                      </Button>
                    </Group>
                  </Card>
                </Grid.Col>
              );
            })
          : null}
      </Grid>
    </>
  );
}

export default Items;
