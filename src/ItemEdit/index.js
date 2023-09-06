import { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Title,
  Space,
  Card,
  TextInput,
  NumberInput,
  Divider,
  Button,
  Group,
} from "@mantine/core";
import { Link, useNavigate, useParams } from "react-router-dom";
import { notifications } from "@mantine/notifications";
import { useQuery, useMutation } from "@tanstack/react-query";

const getItem = async (id) => {
  const response = await axios.get("http://localhost:5000/items/" + id);
  return response.data;
};

const updateItem = async ({ id, data }) => {
  const response = await axios({
    method: "PUT",
    url: "http://localhost:5000/items/" + id,
    headers: { "Content-Type": "application/json" },
    data: data,
  });
  return response.data;
};

function ItemEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [priority, setPriority] = useState("");
  const [purchased, setPurchased] = useState("");
  const { data } = useQuery({
    queryKey: ["items", id],
    queryFn: () => getItem(id),
    onSuccess: (data) => {
      setName(data.name);
      setPriority(data.priority);
      setUnit(data.unit);
      setQuantity(data.quantity);
      setPurchased(data.purchased);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateItem,
    onSuccess: () => {
      notifications.show({
        title: "Item Edited",
        color: "green",
      });
      //redirect back to home page
      navigate("/");
    },
    onError: (error) => {
      notifications.show({
        title: error.response.data.message,
        color: "red",
      });
    },
  });

  const handleUpdateItem = async (event) => {
    event.preventDefault();
    updateMutation.mutate({
      id: id,
      data: JSON.stringify({
        name: name,
        quantity: quantity,
        unit: unit,
        priority: priority,
        purchased: purchased,
      }),
    });
  };
  return (
    <Container>
      <Space h="50px" />
      <Title order={2} align="center">
        Update Item
      </Title>
      <Space h="50px" />
      <Card withBorder shadow="md" p="20px">
        <TextInput
          value={name}
          placeholder="Enter the list name here"
          label="Name"
          description="The name of the list"
          withAsterisk
          onChange={(event) => setName(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <NumberInput
          value={quantity}
          placeholder="Enter the quantity here"
          label="Quantity"
          description="The quantity of the list"
          withAsterisk
          onChange={setQuantity}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={unit}
          placeholder="Enter the unit here"
          label="Unit"
          description="The unit of the list"
          withAsterisk
          onChange={(event) => setUnit(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={priority}
          placeholder="Enter the priority here"
          label="Genre"
          description="The priority of the list"
          withAsterisk
          onChange={(event) => setPriority(event.target.value)}
        />
        <Space h="20px" />
        <Divider />
        <Space h="20px" />
        <TextInput
          value={purchased}
          placeholder="Enter the purchased here"
          label="Purchased"
          description="Is the list already purchased?"
          withAsterisk
          onChange={(event) => setPurchased(event.target.value)}
        />
        <Space h="20px" />
        <Button fullWidth onClick={handleUpdateItem}>
          Update Item
        </Button>
      </Card>
      <Space h="20px" />
      <Group position="center">
        <Button component={Link} to="/" variant="subtle" size="xs" color="gray">
          Go back to Home
        </Button>
      </Group>
      <Space h="100px" />
    </Container>
  );
}
export default ItemEdit;
