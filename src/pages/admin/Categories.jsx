import React, { useState, useEffect } from "react";
import { Table, Input, Button, Popconfirm, message, Modal, Form } from "antd";
import Breadcrumb from "../../components/Breadcrumb";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import axiosClient from "../../constants/AXIOS_CONFIG";
import API_ENDPOINTS from "../../constants/API_ENDPOINTS";

const Categories = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  // Fetch categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosClient.get(API_ENDPOINTS.CATEGORIES);
        const categories = response.data.map((item) => ({
          ...item,
          key: item.id,
        }));
        setDataSource(categories);
      } catch (error) {
        console.error("Error fetching categories", error);
        message.error("Failed to fetch categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle delete category
  const handleDelete = async (key) => {
    try {
      await axiosClient.delete(`${API_ENDPOINTS.CATEGORIES}/${key}`);
      const newData = dataSource.filter((item) => item.key !== key);
      setDataSource(newData);
      message.success("Category deleted successfully");
    } catch (error) {
      console.error("Error deleting category", error);
      message.error("Failed to delete category");
    }
  };

  // Handle save after editing a row
  const handleSave = (key, value, column) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => key === item.key);
    if (index > -1) {
      const item = newData[index];
      newData.splice(index, 1, { ...item, [column]: value });
      setDataSource(newData);
    }
  };

  // Handle adding a new category
  const handleAddCategory = async () => {
    const newCategory = { name: "New Category", description: "New category description" };
    setLoading(true);
    try {
      const response = await axiosClient.post(API_ENDPOINTS.CATEGORIES, newCategory);
      const createdCategory = response.data;
      setDataSource([
        ...dataSource,
        { ...createdCategory, key: createdCategory.id },
      ]);
      message.success("Category added successfully");
    } catch (error) {
      console.error("Error adding category", error);
      message.error("Failed to add category");
    } finally {
      setLoading(false);
      setIsModalVisible(false);
    }
  };

  // Show the modal to add a new category
  const showModal = () => {
    setIsModalVisible(true);
  };

  // Handle modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Columns configuration
  const columns = [
    {
      title: "Category Name",
      dataIndex: "name",
      editable: true,
      render: (_, record) => {
        return editingKey === record.key ? (
          <Input
            defaultValue={record.name}
            onChange={(e) => handleSave(record.key, e.target.value, "name")}
          />
        ) : (
          record.name
        );
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      editable: true,
      render: (_, record) => {
        return editingKey === record.key ? (
          <Input
            defaultValue={record.description}
            onChange={(e) => handleSave(record.key, e.target.value, "description")}
          />
        ) : (
          record.description
        );
      },
    },
    {
      title: "Actions",
      render: (_, record) => (
        <span>
          <Button
            icon={<FaEdit />}
            onClick={() => setEditingKey(record.key)}
            size="small"
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure delete this category?"
            onConfirm={() => handleDelete(record.key)}
          >
            <Button icon={<FaTrashAlt />} size="small" danger />
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white">
      {/* Breadcrumb */}
      <Breadcrumb />

      {/* Dashboard Content */}
      <h1 className="text-2xl font-semibold mt-4">Categories</h1>

      {/* Table for Categories */}
      <Table
        components={{
          body: {
            cell: (props) => <EditableTableCell {...props} />,
          },
        }}
        bordered
        dataSource={dataSource}
        loading={loading}
        columns={columns}
        rowClassName="editable-row"
        pagination={false}
        title={() => (
          <div className="flex justify-between">
            <h2 className="text-lg font-semibold">Category List</h2>
            <Button
              type="primary"
              onClick={showModal}
              loading={loading}
            >
              Add Category
            </Button>
          </div>
        )}
      />

      {/* Modal for adding a new category */}
      <Modal
        title="Add New Category"
        visible={isModalVisible}
        onOk={handleAddCategory}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Category Name"
            name="name"
            rules={[{ required: true, message: "Please input category name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input category description!" }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// EditableTableCell Component
const EditableTableCell = ({
  editable,
  children,
  record,
  column,
  onSave,
  ...restProps
}) => {
  return editable ? (
    <td {...restProps}>
      <Input
        defaultValue={children}
        onChange={(e) => onSave(record.key, e.target.value, column)}
      />
    </td>
  ) : (
    <td {...restProps}>{children}</td>
  );
};

export default Categories;
