import React, { useState, useEffect } from "react";
import { Table, Input, Button, Popconfirm, message, Modal, Form, DatePicker, Switch, Row, Col, Select } from "antd";
import Breadcrumb from "../../components/Breadcrumb";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import axiosConfig from "../../constants/AXIOS_CONFIG";
import API from "../../constants/API";
import moment from "moment";

const Banners = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [pagination, setPagination] = useState({ pageSize: 5, current: 1 });

  // Fetch banners on mount
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axiosConfig.get(API.ADMIN_BANNERS);
        console.log(response.data)
        const banners = response.data.map((item) => ({
          ...item,
          key: item.bannerId,
        }));
        setDataSource(banners);
        setFilteredData(banners);
      } catch (error) {
        message.error(error.response.data);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
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
  const handleUpdateBanner = async (key) => {
    const row = dataSource.find((item) => item.key === key);
    try {
      await axiosConfig.put(`${API.ADMIN_BANNERS_UPDATE}/${key}`, row);
      message.success("Banner updated successfully");
      setEditingKey("");
    } catch (error) {
      message.error("Failed to update banner");
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

  // Add new banner
  const handleAddBanner = async () => {
    const values = await form.validateFields();
    
    try {
      const response = await axiosConfig.post(API.ADMIN_BANNERS, values);
      const createdBanner = response.data;
      console.log(response);
      const updatedData = [
        ...dataSource,
        { ...createdBanner, key: createdBanner.bannerId },
      ];
      setDataSource(updatedData);
      setFilteredData(updatedData);
      message.success("Banner added successfully");
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
        if (error.response && error.response.msg) {
            message.error(error.response.msg);
          } else {
            message.error("An unexpected error occurred");
          }
    }
  };

  // Delete a banner
  const handleDelete = async (key) => {
    try {
      await axiosConfig.delete(`${API.ADMIN_BANNERS}/${key}`);
      const newData = dataSource.filter((item) => item.key !== key);
      setDataSource(newData);
      setFilteredData(newData);
      message.success("Banner deleted successfully");
    } catch (error) {
      message.error("Failed to delete banner");
    }
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = dataSource.filter(
      (item) =>
        item.bannerTitle.toLowerCase().includes(value.toLowerCase())
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
      title: "Banner Title",
      dataIndex: "bannerTitle",
      render: (_, record) =>
        editingKey === record.key ? (
          <Input
            defaultValue={record.bannerTitle}
            onChange={(e) =>
              handleInputChange(record.key, "bannerTitle", e.target.value)
            }
          />
        ) : (
          record.bannerTitle
        ),
    },
    {
      title: "Banner Image",
      dataIndex: "bannerImageUrl",
      render: (url) => <img src={url} alt="Banner" style={{ width: 100 }} />,
    },
    {
        title: "Category",
        dataIndex: "category",
        render: (_, record) =>
          editingKey === record.key ? (
            <Select
              defaultValue={record.caategory}
              onChange={(value) =>
                handleInputChange(record.key, "category", value)
              }
            >
              <Select.Option value="homepage">Homepage</Select.Option>
              <Select.Option value="category-pages">Category Pages</Select.Option>
              <Select.Option value="promotions">Promotions</Select.Option>
              <Select.Option value="product">Product</Select.Option>
              <Select.Option value="featured">Featured</Select.Option>
              <Select.Option lue="promotions">Promotions</Select.Option>
              <Select.Option value="seasonal">Seasonal</Select.Option>
            </Select>
          ) : (
            record.bannerType
          ),
      },
    {
        title: "Start Date",
        dataIndex: "startDate",
        render: (_, record) =>
          editingKey === record.key ? (
            <DatePicker
              showTime
              defaultValue={record.startDate ? moment(record.startDate) : null}
              onChange={(date) =>
                handleInputChange(record.key, "startDate", date ? date.toISOString() : null)
              }
            />
          ) : (
            moment(record.startDate).format("YYYY-MM-DD HH:mm:ss")
          ),
      },
      {
        title: "End Date",
        dataIndex: "endDate",
        render: (_, record) =>
          editingKey === record.key ? (
            <DatePicker
              showTime
              defaultValue={record.endDate ? moment(record.endDate) : null}
              onChange={(date) =>
                handleInputChange(record.key, "endDate", date ? date.toISOString() : null)
              }
            />
          ) : (
            moment(record.endDate).format("YYYY-MM-DD HH:mm:ss")
          ),
      },
      
    {
      title: "Active",
      dataIndex: "isActive",
      render: (_, record) =>
        editingKey === record.key ? (
          <Switch
            checked={record.isActive}
            onChange={(checked) =>
              handleInputChange(record.key, "isActive", checked)
            }
          />
        ) : (
          record.isActive ? "Yes" : "No"
        ),
    },
    {
      title: "Type",
      dataIndex: "bannerType",
      render: (_, record) =>
        editingKey === record.key ? (
          <Select
            defaultValue={record.bannerType}
            onChange={(value) =>
              handleInputChange(record.key, "bannerType", value)
            }
          >
            <Select.Option value="promotional">Promotional</Select.Option>
            <Select.Option value="featured">Featured</Select.Option>
            <Select.Option value="seeasonal">Seasonal</Select.Option>
          </Select>
        ) : (
          record.bannerType
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
              onClick={() => handleUpdateBanner(record.key)}
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
              title="Are you sure to delete this banner?"
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
        <h3 className="text-2xl font-semibold">Banners</h3>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add Banner
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
            <Input.Search
              placeholder="Search banner"
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              style={{ width: 300 }}
            />
          </div>
        )}
      />
        <Modal
            title="Add Banner"
            open={isModalVisible}
            onOk={handleAddBanner}
            onCancel={() => setIsModalVisible(false)}
            width={800}
        >
        <Form form={form} layout="vertical">
          {/* Banner Name */}
          <Form.Item
            label="Banner Title"
            name="bannerTitle"
            rules={[{ required: true, message: "Please input banner title!" }]}
          >
            <Input />
          </Form.Item>

          <Row gutter={16}>
            {/* Banner Image URL */}
            <Col span={24}>
              <Form.Item
                label="Banner Image URL"
                name="bannerImageUrl"
                rules={[{ required: true, message: "Please input banner image URL!" }]}
              >
                <Input style={{ width: '100%' }} />
              </Form.Item>
            </Col>

            
          </Row>

          <Row gutter={16}>
            {/* Start Date */}
            <Col span={12}>
              <Form.Item
                label="Start Date"
                name="startDate"
                rules={[{ required: true, message: "Please select start date!" }]}
              >
                <DatePicker style={{ width: '100%' }} showTime />
              </Form.Item>
            </Col>

            {/* End Date */}
            <Col span={12}>
              <Form.Item
                label="End Date"
                name="endDate"
                rules={[{ required: true, message: "Please select end date!" }]}
              >
                <DatePicker style={{ width: '100%' }} showTime />
              </Form.Item>
            </Col>
          </Row>


        <Row gutter={16}>
          {/* Category */}
          <Col span={12}>
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "Please select a category!" }]}
            >
              <Select placeholder="Select a category" style={{ width: '100%' }}>
                <Option value="homepage">Homepage</Option>
                <Option value="category-pages">Category Pages</Option>
                <Option value="promotions">Promotions</Option>
                <Option value="product">Product</Option>
                <Option value="featured">Featured</Option>
                <Option value="seasonal">Seasonal</Option>
                <Option value="sale">Sale</Option>
                <Option value="event">Event</Option>
              </Select>
            </Form.Item>
          </Col>

        </Row>


            <Row gutter={16}>
            {/* Banner Type */}
            <Col span={8}>
                <Form.Item
                label="Banner Type"
                name="bannerType"
                rules={[{ required: true, message: "Please select banner type!" }]}
                >
                <Select defaultValue="featured">
                    <Select.Option value="featured">Featured</Select.Option>
                    <Select.Option value="promotional">Promotional</Select.Option>
                    <Select.Option value="seasonal">Seasonal</Select.Option>
                </Select>
                </Form.Item>

            </Col>

            {/* Is Active */}
            <Col span={8}>
                <Form.Item
                label="Is Active"
                name="isActive"
                valuePropName="checked"
                >
                <Switch />
                </Form.Item>
            </Col>
            </Row>
        </Form>
      </Modal>

    </div>
  );
};

export default Banners;
