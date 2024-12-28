import React, { useState, useEffect } from "react";
import { Table, Input, Button, Popconfirm, message, Modal, Form, Select } from "antd";
import Breadcrumb from "../../components/Breadcrumb";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import axiosConfig from "../../constants/AXIOS_CONFIG";
import API from "../../constants/API";

const VendorProducts = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productStatuses, setProductStatuses] = useState([]);
  const [pagination, setPagination] = useState({ pageSize: 5, current: 1 });

  // Fetch Products and related data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, statusesRes] = await Promise.all([
          axiosConfig.get(API.VENDOR_PRODUCTS),
          axiosConfig.get(API.CATEGORIES),
          axiosConfig.get(API.PRODUCT_STATUSES),
        ]);

        const products = productsRes.data.map((item) => ({
          ...item,
          key: item.id,
        }));
        setDataSource(products);
        setFilteredData(products);
        setCategories(categoriesRes.data);
        setProductStatuses(statusesRes.data);
      } catch (error) {
        message.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
  const saveEdit = async (key) => {
    const row = dataSource.find((item) => item.key === key);
    try {
      await axiosConfig.put(`${API.VENDOR_PRODUCTS}/${key}`, row);
      message.success("Product updated successfully");
      setEditingKey("");
    } catch (error) {
      message.error("Failed to update product");
    }
  };

  // Handle cell value change
  const handleInputChange = (key, column, value) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => item.key === key);
    if (index > -1) {
      newData[index][column] = value;
      setDataSource(newData);
    }
  };

  // Delete a product
  const handleDelete = async (key) => {
    try {
      await axiosConfig.delete(`${API.VENDOR_PRODUCTS}/${key}`);
      const newData = dataSource.filter((item) => item.key !== key);
      setDataSource(newData);
      setFilteredData(newData);
      message.success("Product deleted successfully");
    } catch (error) {
      message.error("Failed to delete product");
    }
  };

  // Add new product
  const handleAddProduct = async () => {
    const values = await form.validateFields();
    try {
      const response = await axiosConfig.post(API.VENDOR_PRODUCTS, values);
      const createdProduct = response.data;
      const updatedData = [
        ...dataSource,
        { ...createdProduct, key: createdProduct.id },
      ];
      setDataSource(updatedData);
      setFilteredData(updatedData);
      message.success("Product added successfully");
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      message.error("Failed to add product");
    }
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = dataSource.filter(
      (item) =>
        item.name.toLowerCase().includes(value.toLowerCase()) ||
        item.description.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // Handle pagination change
  const handlePaginationChange = (current, pageSize) => {
    setPagination({ current, pageSize });
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "name",
      render: (_, record) =>
        editingKey === record.key ? (
          <Input
            defaultValue={record.name}
            onChange={(e) =>
              handleInputChange(record.key, "name", e.target.value)
            }
          />
        ) : (
          record.name
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
      title: "Price",
      dataIndex: "price",
      render: (_, record) =>
        editingKey === record.key ? (
          <Input
            type="number"
            defaultValue={record.price}
            onChange={(e) =>
              handleInputChange(record.key, "price", parseFloat(e.target.value))
            }
          />
        ) : (
          `$${record.price.toFixed(2)}`
        ),
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      render: (name) => name || "N/A",
    },
    {
      title: "Vendor",
      dataIndex: ["vendor", "name"],
      render: (firstName) => firstName || "N/A",
    },
    {
      title: "Vendor",
      dataIndex: ["vendor", "user"],
      render: (user) => {
        if (user) {
          const { firstName, lastName } = user;
          return `${firstName} ${lastName}`;
        }
        return "N/A";
      },
    },
    {
      title: "Actions",
      render: (_, record) => {
        const editable = editingKey === record.key;
        return editable ? (
          <span>
            <Button
              type="link"
              onClick={() => saveEdit(record.key)}
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
              title="Are you sure to delete this product?"
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
        <h3 className="text-2xl font-semibold">Products</h3>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add Product
        </Button>
      </div>
      <div className="mt-2">
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
                placeholder="Search products"
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: 300 }}
              />
            </div>
          )}
        />
      </div>
      <Modal
        title="Add New Product"
        open={isModalVisible}
        onOk={handleAddProduct}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Product Name"
            name="name"
            rules={[{ required: true, message: "Please input product name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              { required: true, message: "Please input product description!" },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please input product price!" }]}
          >
            <Input type="number" />
          </Form.Item>
          <Form.Item
            label="Category"
            name="categoryId"
            rules={[{ required: true, message: "Please select a category!" }]}
          >
            <Select
              options={categories.map((cat) => ({
                label: cat.name,
                value: cat.id,
              }))}
            />
          </Form.Item>
          <Form.Item
            label="Product Status"
            name="productStatusId"
            rules={[
              { required: true, message: "Please select a product status!" },
            ]}
          >
            <Select
              options={productStatuses.map((status) => ({
                label: status.statusName,
                value: status.id,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VendorProducts;
