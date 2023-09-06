import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Title, Grid, Card, Badge, Group, Space, Button } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

const fetchItems = async (priority, purchased) => {
  if (priority !== "") {
    const response = await axios.get(
      "http://localhost:5000/items?priority=" + priority
    );
    return response.data;
  } else if (purchased !== "") {
    const response = await axios.get(
      "http://localhost:5000/items?purchased=" + purchased
    );
    return response.data;
  } else {
    const response = await axios.get("http://localhost:5000/items");
    return response.data;
  }
};

export const deleteItem = async (item_id = "") => {
  const response = await axios({
    method: "DELETE",
    url: "http://localhost:5000/items/" + item_id,
  });
  return response.data;
};

function Items() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [purchased, setPurchased] = useState("");
  const [priority, setPriority] = useState("");
  const {
    isLoading,
    isError,
    data: items,
    error,
  } = useQuery({
    queryKey: ["items", priority, purchased],
    queryFn: () => fetchItems(priority, purchased),
  });

  console.log(items);

  const memoryItems = queryClient.getQueryData(["items", "", ""]);
  const priorityOptions = useMemo(() => {
    let options = [];
    if (items && items.length > 0) {
      items.forEach((item) => {
        if (!options.includes(item.priority)) {
          options.push(item.priority);
        }
      });
    }
    // console.log(options);
    return options;
  }, [memoryItems]);

  // const handleItemDelete = async (item_id) => {
  //   try {
  //     await axios({
  //       method: "DELETE",
  //       url: "http://localhost:5000/items/" + item_id,
  //     });
  //     // show movie is delete message
  //     notifications.show({
  //       title: "Item Deleted",
  //       color: "green",
  //     });
  //     // method 1 (modify the state) - filter out the deleted movie
  //     const newItems = items.filter((m) => m._id !== item_id);
  //     setItems(newItems);
  //   } catch (error) {
  //     notifications.show({
  //       title: error.response.data.message,
  //       color: "red",
  //     });
  //   }
  // };

  const updateMutation = useMutation({
    mutationFn: updateItem,
    onSuccess: () => {
      //triggered when API successfully executed
      queryClient.invalidateQueries({
        //ask React query to retrigger the API
        queryKey: ["items", priority, purchased],
      });

      notifications.show({
        title: "Updated Purchase",
        color: "green",
      });
    },
  });

  // delete mutation
  const deleteMutation = useMutation({
    mutationFn: deleteItem,
    onSuccess: () => {
      // this will be triggered when API is successfully executed
      queryClient.invalidateQueries({
        queryKey: ["items"],
      });
      // show movie is deleted message
      notifications.show({
        title: "Item Deleted",
        color: "green",
      });
    },
  });

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
                          deleteMutation.mutate(item._id);
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
