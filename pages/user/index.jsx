import { Input } from "@chakra-ui/input";
import { Container } from "@chakra-ui/layout";
import {
  Button,
  FormControl,
  FormLabel,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ModalComponent from "../../components/modal";
import { useFormik } from "formik";

const UserPage = () => {
  const [usersData, setUsersData] = useState([]);
  const [isModalShow, setIsModalShow] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editedId, setEditedId] = useState(null);
  const [userToken, setToken] = useState(null);

  useEffect(() => {
    const token = window.localStorage.getItem("tokentahu");
    setToken(token);
  }, []);

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      role: "",
      password: "",
    },
    onSubmit: async (values) => {
      // alert(JSON.stringify(values, null, 2));
      if (isEdit) {
        await updateUser(editedId, values);
      } else {
        await createUser(values);
      }
      return closeModal();
    },
  });

  const showModal = () => {
    setIsEdit(false);
    setIsModalShow(true);
  };

  const closeModal = () => {
    setIsModalShow(false);
    formik.resetForm();
  };

  const getUsers = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/users", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      setUsersData(data.users);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const createUser = async (data) => {
    try {
      const config = {
        "Content-type": "Application/json",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };
      const response = await axios.post(
        "http://localhost:5000/users",
        data,
        config
      );

      console.log(response);
      setUsersData((prev) => {
        return [...prev, response.data.user];
      });

      formik.resetForm();
    } catch (error) {
      console.log(error);
    }
  };

  const getUserById = async (id) => {
    try {
      setIsEdit(true);
      const { data } = await axios.get(`http://localhost:5000/users/${id}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      formik.setValues({
        fullName: data?.user?.fullName,
        email: data?.user?.email,
        role: data?.user?.role,
        password: data?.user?.password,
      });

      setEditedId(data?.user?.id);
      // console.log(data);
      setIsModalShow(true);
    } catch (error) {
      console.log(error);
    }
  };

  const updateUser = async (id, form) => {
    try {
      const config = {
        "Content-type": "Application/json",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      };

      //update data diserver
      await axios.patch(`http://localhost:5000/users/${id}`, form, config);

      //update data di frontend
      const newUpdatedUser = usersData.map((user) =>
        user.id === id
          ? {
              ...user,
              ...form,
            }
          : user
      );

      setUsersData(newUpdatedUser);

      closeModal();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/users/${id}`);

      const filterUsers = usersData.filter((user) => user.id !== id);

      setUsersData(filterUsers);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!userToken) return;
    getUsers();
  }, [userToken]);

  return (
    <>
      <Container maxW="container.xl" py={10}>
        <Button size="md" onClick={showModal} mb={5}>
          Create User
        </Button>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Fullnae</Th>
              <Th>Email</Th>
              <Th>Role</Th>
              <Th>Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {usersData.map((user) => (
              <Tr key={user.id}>
                <Td>{user.fullName}</Td>
                <Td>{user.email}</Td>
                <Td>{user.role}</Td>
                <Td>
                  <Button
                    colorScheme="green"
                    type="button"
                    onClick={() => {
                      getUserById(user.id);
                    }}
                    mr={2}
                  >
                    Edit
                  </Button>
                  <Button
                    colorScheme="red"
                    type="button"
                    onClick={() => {
                      const result = confirm("Want to delete");

                      result && deleteUser(user.id);
                    }}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <ModalComponent
          isOpen={isModalShow}
          onClose={closeModal}
          title={isEdit ? "Update User Form" : "Create User Form"}
        >
          <form onSubmit={formik.handleSubmit}>
            <FormControl isRequired>
              <FormLabel>Fullname</FormLabel>
              <Input
                placeholder="Input Fullname"
                name="fullName"
                onChange={formik.handleChange}
                value={formik.values.fullName}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="Input Email"
                type="email"
                name="email"
                onChange={formik.handleChange}
                value={formik.values.email}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Role</FormLabel>
              <Input
                placeholder="Input Role"
                variant=""
                name="role"
                onChange={formik.handleChange}
                value={formik.values.role}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                placeholder="Input Password"
                type="password"
                name="password"
                onChange={formik.handleChange}
                value={formik.values.password}
              />
            </FormControl>

            <Button
              colorScheme="whatsapp"
              my={5}
              width="100%"
              type="submit"
              isLoading={formik.isSubmitting}
            >
              {isEdit ? "Update" : "Save"} User
            </Button>
          </form>
        </ModalComponent>
      </Container>
    </>
  );
};

export default UserPage;
