import React, { useState, useEffect } from "react";
import { Table, Input, Button, Popconfirm, message, Modal, Form, Select } from "antd";
import Breadcrumb from "../../components/Breadcrumb";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import axiosConfig from "../../constants/AXIOS_CONFIG";
import API from "../../constants/API";

const ProductStatus = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [pagination, setPagination] = useState({ pageSize: 5, current: 1 });

  // Fetch product statuses on mount
  useEffect(() => {
    const fetchProductStatuses = async () => {
      try {
        const response = await axiosConfig.get(API.PRODUCT_STATUSES);
        const productStatuses = response.data.map((item) => ({
          ...item,
          key: item.id,
        }));
        setDataSource(productStatuses);
        setFilteredData(productStatuses);
      } catch (error) {
        message.error("Failed to fetch product statuses");
      } finally {
        setLoading(false);
      }
    };

    fetchProductStatuses();
  }, []);

  // Start editing a row
  const startEditing = (record) => {
    setEditingKey(record.key);
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingKey("");
  };

  // Save edited changes
  const handleUpdateProductStatus = async (key) => {
    const row = dataSource.find((item) => item.key === key);
    try {
      await axiosConfig.put(`${API.PRODUCT_STATUSES}/${key}`, row);
      message.success("Product status updated successfully");
      setEditingKey("");
    } catch (error) {
      message.error("Failed to update product status");
    }
  };

  const handleInputChange = (key, column, value) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => item.key === key);
    if (index > -1) {
      newData[index][column] = value;
      setDataSource(newData);
    }
  };

  // Add new category
  const handleAddProductStatus = async () => {
    const values = await form.validateFields();
    try {
      const response = await axiosConfig.post(API.PRODUCT_STATUSES, values);
      const createdProductStatus = response.data;
      const updatedData = [
        ...dataSource,
        { ...createdProductStatus, key: createdProductStatus.id },
      ];
      setDataSource(updatedData);
      setFilteredData(updatedData);
      message.success("Product status added successfully");
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to add product status");
    }
  };
  

  // Delete a product status
  const handleDelete = async (key) => {
    try {
      await axiosConfig.delete(`${API.PRODUCT_STATUSES}/${key}`);
      const newData = dataSource.filter((item) => item.key !== key);
      setDataSource(newData);
      setFilteredData(newData);
      message.success("Product status deleted successfully");
    } catch (error) {
      message.error("Failed to delete product status");
    }
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = dataSource.filter(
      (item) =>
        item.statusName.toLowerCase().includes(value.toLowerCase()) ||
        item.description.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Handle pagination change
  const handlePaginationChange = (current, pageSize) => {
    setPagination({ current, pageSize });
  };

  // Columns definition
  const columns = [
    {
      title: "Name",
      dataIndex: "statusName",
      render: (_, record) =>
        editingKey === record.key ? (
            <Input
            defaultValue={record.statusName}
            onChange={(e) =>
              handleInputChange(record.key, "statusName", e.target.value)
            }
          />
        ) : (
          record.statusName
        ),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (_, record) =>
        editingKey === record.key ? (
            <Input
            defaultValue={record.description}
            onChange={(e) =>
              handleInputChange(record.key, "description", e.target.value)
            }
          />
        ) : (
          record.description
        ),
    },
    {
      title: "Actions",
      render: (_, record) => {
        const editable = editingKey === record.key;
        return editable ? (
          <span>
            <Button
              type="link"
              onClick={() => handleUpdateProductStatus(record.key)}
              style={{ marginRight: 8 }}
            >
              Save
            </Button>
            <Button type="link" onClick={cancelEditing}>
              Cancel
            </Button>
          </span>
        ) : (
          <span>
            <Button
              icon={<FaEdit />}
              onClick={() => startEditing(record)}
              size="small"
              style={{ marginRight: 8 }}
            />
            <Popconfirm
              title="Are you sure to delete this product status?"
              onConfirm={() => handleDelete(record.key)}
            >
              <Button icon={<FaTrashAlt />} size="small" danger />
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  return (
    <div className="p-6 bg-white">
      <Breadcrumb />
      <div className="row flex justify-between mt-2">
        <h3 className="text-2xl font-semibold">Product Statuses</h3>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add Product Status
        </Button>
      </div>
      <Table
        dataSource={filteredData}
        loading={loading}
        columns={columns}
        rowClassName="editable-row"
        pagination={{
          pageSize: pagination.pageSize,
          current: pagination.current,
          onChange: handlePaginationChange,
        }}
        title={() => (
            <div className="flex justify-between">
            <Select
              defaultValue={5}
              onChange={(value) => handlePaginationChange(pagination.current, value)}
              options={[
                { label: "5", value: 5 },
                { label: "10", value: 10 },
                { label: "20", value: 20 },
              ]}
              style={{ marginRight: 10, width: 100 }}
            />
            <Input.Search
              placeholder="Search status"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
            />
          </div>
        )}
      />
      <Modal
        title="Add Product Status"
        open={isModalVisible}
        onOk={handleAddProductStatus}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Name"
            name="statusName"
            rules={[{ required: true, message: "Please input name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input description!" }]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductStatus;
