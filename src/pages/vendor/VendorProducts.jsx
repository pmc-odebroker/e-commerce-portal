import React, { useState, useEffect } from "react";
import { Table, Input, Button, Popconfirm, message, Modal, Form, Select, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Breadcrumb from "../../components/Breadcrumb";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import axiosConfig from "../../constants/AXIOS_CONFIG";
import API from "../../constants/API";
import defaultProductImage from "../../assets/product-image.jpg";

const VendorProducts = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [editingKey, setEditingKey] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [imageSource, setImageSource] = useState("upload");
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productStatuses, setProductStatuses] = useState([]);
  const [pagination, setPagination] = useState({ pageSize: 5, current: 1 });

  const handleSourceChange = (value) => {
    setImageSource(value);
    setFile(null);
    form.setFieldsValue({ imageFile: undefined, imageUrl: undefined });
  };

  // Fetch Products and related data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, statusesRes] = await Promise.all([
          axiosConfig.get(API.VENDOR_PRODUCTS),
          axiosConfig.get(API.CATEGORIES),
          axiosConfig.get(API.PRODUCT_STATUSES),
        ]);
        console.log("productRes data are,", productsRes.data);

        const products = productsRes.data.map((item) => ({
          ...item,
          key: item.id,
        }));
        console.log("products are,", products);

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

  // Validate image uploaded
  const validateFile = (rule, value) => {
    if (!file) {
      return Promise.reject(new Error("Please upload an image!"));
    }
    if (file.type !== "image/png" && file.type !== "image/jpeg") {
      return Promise.reject(new Error("Only PNG or JPEG images are allowed!"));
    }
    if (file.size > 2 * 1024 * 1024) {
      return Promise.reject(new Error("File size must not exceed 2MB!"));
    }
    return Promise.resolve();
  };

  // Add new product
  const handleAddProduct = async () => {
    const values = await form.validateFields();
  
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("categoryId", values.categoryId);
    formData.append("productStatusId", values.productStatusId);
  
    if (values.imageSource === "upload" && file) {
      formData.append("imageFile", file);
    } else if (values.imageSource === "url") {
      formData.append("imageUrl", values.imageUrl);
    } else {
      message.error("Please provide a valid image source.");
      return;
    }

    console.log("the form data are", formData);
  
    try {
      const response = await axiosConfig.post(API.VENDOR_PRODUCTS, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      const createdProduct = response.data;
      const updatedData = [
        ...dataSource,
        { ...createdProduct, key: createdProduct.id },
      ];
      setDataSource(updatedData);
      setFilteredData(updatedData);
      message.success("Product added successfully");
      form.resetFields();
      setFile(null);
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
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (text) => {
        // Check if the imageUrl is null or empty
        if (!text) {
          return (
            <img
              src={defaultProductImage}
              alt="Default Placeholder"
              style={{ width: 50, height: 50, objectFit: "cover" }}
            />
          );
        }
    
        const isOnlineLink = text && text.startsWith("http");
        const imageSrc = isOnlineLink
          ? text
          : `http://localhost:8080/uploads/${text.split('/uploads/').pop()}`; // Ensure proper path
    
        return (
          <img
            src={imageSrc}
            alt="Product"
            style={{ width: 50, height: 50, objectFit: "cover" }}
            onError={(e) => {
              e.target.src = defaultProductImage;
            }}
          />
        );
      },
    },
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
          record.price
        ),
    },
    {
      title: "Category",
      dataIndex: ["categoryName"],
      render: (categoryName) => categoryName || "N/A",
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
          <Form.Item
            label="Image Source"
            name="imageSource"
            initialValue="upload"
            rules={[{ required: true, message: "Please select an image source!" }]}
          >
            <Select
              defaultValue="upload"
              options={[
                { label: "Upload File", value: "upload" },
                { label: "Provide URL", value: "url" },
              ]}
              onChange={handleSourceChange}
            />
          </Form.Item>

          {imageSource === "upload" ? (
            <Form.Item
              label="Product Image (Upload)"
              name="imageFile"
              rules={[
                { required: true, message: "Please upload an image!" },
                { validator: validateFile },
              ]}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
              <Input
                value={file ? file.name : ""}
                readOnly
                placeholder="No file selected"
                style={{ marginRight: "10px", flex: 1 }}
              />
              <Upload
                beforeUpload={(file) => {
                  setFile(file);
                  return false;
                }}
                showUploadList={false}
                accept="image/png,image/jpeg"
              >
                <Button icon={<UploadOutlined />}>Choose File</Button>
              </Upload>
            </div>
            </Form.Item>
          ) : (
            <Form.Item
              label="Product Image URL"
              name="imageUrl"
              rules={[
                {
                  type: "url",
                  message: "Please provide a valid URL!",
                  required: true,
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || /\.(jpg|jpeg|png|gif|bmp|webp|svg)$/i.test(value)) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("The URL must point to a valid image file (e.g., .jpg, .png)!")
                    );
                  },
                }),
              ]}
            >
          <Input placeholder="Enter image URL" />
          </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default VendorProducts;
