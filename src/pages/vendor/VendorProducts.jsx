import React, { useState, useEffect } from "react";
import { Table, Input, Button, Popconfirm, message, Modal, Form, Select, Upload, Row, Col } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Breadcrumb from "../../components/Breadcrumb";
import { FaEdit, FaTrashAlt, FaEye } from "react-icons/fa";
import axiosConfig from "../../constants/AXIOS_CONFIG";
import API from "../../constants/API";
import { PATH } from "../../constants/PATH";
import defaultProductImage from "../../assets/product-image.jpg";
import { useNavigate } from "react-router-dom";

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
  const [subCategories, setSubCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingSubCategories, setLoadingSubCategories] = useState(false);
  const [productStatuses, setProductStatuses] = useState([]);
  const [specifications, setSpecifications] = useState([]);
  const [loadingSpecifications, setLoadingSpecifications] = useState(false);
  const [pagination, setPagination] = useState({ pageSize: 5, current: 1 });
  const navigate = useNavigate();


  const handleSourceChange = (value) => {
    setImageSource(value);
    setFile(null);
    form.setFieldsValue({ imageFile: undefined, imageUrl: undefined });
  };

  // Fetch Products and related data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes, subCategoriesRes, statusesRes] = await Promise.all([
          axiosConfig.get(API.VENDOR_PRODUCTS),
          axiosConfig.get(API.CATEGORIES),
          axiosConfig.get(API.ADMIN_SUBCATEGORIES),
          axiosConfig.get(API.PRODUCT_STATUSES),
          axiosConfig.get(API.ADMIN_SPECIFICATIONS)
        ]);

        const products = productsRes.data.map((item) => ({
          ...item,
          key: item.id,
        }));

        setDataSource(products);
        setFilteredData(products);
        setCategories(categoriesRes.data);
        setSubCategories(subCategoriesRes.data.result);
        setProductStatuses(statusesRes.data);
      } catch (error) {
        message.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [specificationsRes] = await Promise.all([
          axiosConfig.get(API.ADMIN_SPECIFICATIONS),
        ]);
  
        const specs = specificationsRes.data.result.map((spec) => ({
          id: spec.id,
          name: spec.name,
        }));
  
        form.setFieldsValue({ specifications: specs });
        setSpecifications(specs);
      } catch (error) {
        message.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [form]);

  // Handle category change event
  const handleCategoryChange = async (value) => {
    setSelectedCategory(value);
    setSubCategories([]);
    setLoadingSubCategories(true);
    try {
      const response = await axiosConfig.get(API.ADMIN_CATEGORY_SUBCATEGORIES(value));
      setSubCategories(response.data.result);
    } catch (error) {
      message.error("Failed to fetch sub-categories");
    } finally {
      setLoadingSubCategories(false);
    }
  };

  // Handle fetch specifications dynamically
  const handleSubCategoryChange = async (value) => {
    setLoadingSpecifications(true);
    form.setFieldsValue({ specifications: [] });
    try {
      const response = await axiosConfig.get(API.ADMIN_SUBCATEGORY_SPECIFICATIONS(value));
      const specs = response.data.result.map((spec) => ({
        id: spec.id,
        name: spec.name,
        value: "",
      }));
      setSpecifications(specs);
    } catch (error) {
      message.error("Failed to fetch specifications");
    } finally {
      setLoadingSpecifications(false);
    }
  };
  
  
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
    setLoading(true);
  
    try {
      await axiosConfig.put(`${API.VENDOR_PRODUCTS}/${key}`, row, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      message.success("Product updated successfully");
      setEditingKey("");
    } catch (error) {
      if (error.response && error.response.data) {
        message.error(error.response.data.message || "Failed to update product");
      } else {
        message.error("Network error or server unreachable.");
      }
    } finally {
      setLoading(false);
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
    formData.append("subCategoryId", values.subCategoryId);
    formData.append("productStatusId", values.productStatusId);
  
    if (values.imageSource === "upload" && file) {
      formData.append("imageFile", file);
    } else if (values.imageSource === "url") {
      formData.append("imageUrl", values.imageUrl);
    } else {
      message.error("Please provide a valid image source.");
      return;
    }

    values.specifications.forEach((spec, index) => {
      formData.append(`specifications[${index}].specificationId`, spec.id);
      formData.append(`specifications[${index}].specificationName`, spec.name);
      formData.append(`specifications[${index}].value`, spec.value);
    });    

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
          : `${import.meta.env.VITE_URL}${import.meta.env.VITE_PATH}${text.split(import.meta.env.VITE_PATH).pop()}`;
    
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
      dataIndex: "categoryId",
      render: (categoryId, record) =>
        editingKey === record.key ? (
          <Select
            defaultValue={categoryId}
            onChange={(value) =>
              handleInputChange(record.key, "categoryId", value)
            }
            options={categories.map((category) => ({
              value: category.id,
              label: category.name,
            }))}
          />
        ) : (
          categories.find((category) => category.id === categoryId)?.name || "-"
        ),
    },
    {
      title: "Sub Category",
      dataIndex: "subCategoryId",
      render: (subCategoryId, record) =>
        editingKey === record.key ? (
          <Select
            defaultValue={subCategoryId}
            onChange={(value) =>
              handleInputChange(record.key, "subCategoryId", value)
            }
            options={subCategories.map((subCategory) => ({
              value: subCategory.id,
              label: subCategory.name,
            }))}
          />
        ) : (
          subCategories.find((subCategory) => subCategory.id === subCategoryId)?.name || "-"
        ),
    },
    {
      title: "Product Status",
      dataIndex: "productStatusId",
      render: (productStatusId, record) =>
        editingKey === record.key ? (
          <Select
            defaultValue={productStatusId}
            onChange={(value) =>
              handleInputChange(record.key, "productStatusId", value)
            }
            options={productStatuses.map((status) => ({
              value: status.id,
              label: status.statusName,
            }))}
          />
        ) : (
          productStatuses.find((status) => status.id === productStatusId)?.statusName || "-"
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
              icon={<FaEye />}
              onClick={() => navigate(PATH.VENDOR_PRODUCT(record.id))}
              size="small"
              style={{ marginRight: 8 }}
            >
              View
            </Button>
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
        width={800}

      >
        <Form form={form} layout="vertical" initialValues={{imageSource: "upload",}}
        >
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
              onChange={handleCategoryChange}
            />
          </Form.Item>
          <Form.Item
            label="Sub Category"
            name="subCategoryId"
            rules={[{ required: true, message: "Please select a sub category!" }]}
          >
            <Select
              options={subCategories.map((subCat) => ({
                label: subCat.name,
                value: subCat.id,
              }))}
              loading={loadingSubCategories}
              disabled={!selectedCategory || loadingSubCategories}
              onChange={handleSubCategoryChange}
            />
          </Form.Item>
          <Form.List name="specifications" initialValue={specifications}>
            {(fields, { add, remove }) => (
              <>
                <Row gutter={[16, 16]} style={{ marginBottom: "10px" }}>
                  <Col span={10}>
                    <strong>Specification</strong>
                  </Col>
                  <Col span={10}>
                    <strong>Value</strong>
                  </Col>
                  <Col span={4}>
                    <strong>Action</strong>
                  </Col>
                </Row>
                {fields.map(({ key, name, ...restField }) => (
                  <Row
                    gutter={[16, 16]}
                    key={key}
                    align="middle"
                    style={{ marginBottom: "10px" }}
                  >
                    <Col span={10}>
                      <Form.Item {...restField} name={[name, "name"]}>
                        <Input
                          value={specifications[key]?.name}
                          disabled
                          style={{ backgroundColor: "#f5f5f5" }}
                        />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, "id"]}
                        hidden
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                    <Col span={10}>
                      <Form.Item
                        {...restField}
                        name={[name, "value"]}
                        rules={[{ required: true, message: "Please enter a value!" }]}
                      >
                        <Input placeholder="Enter value" />
                      </Form.Item>
                    </Col>
                    <Col span={4}>
                      <Button type="link" danger onClick={() => remove(name)}>
                        Remove
                      </Button>
                    </Col>
                  </Row>
                ))}
                <Button
                  type="dashed"
                  onClick={() => add({ id: "", name: "", value: "" })}
                  block
                  style={{ marginTop: "10px" }}
                >
                  Add Specification
                </Button>
              </>
            )}
          </Form.List>
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
            rules={[{ required: true, message: "Please select an image source!" }]}
          >
            <Select
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
