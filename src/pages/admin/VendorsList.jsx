import React, { useEffect, useState } from "react";
import { Table, Input, Button, Popconfirm, message, Modal, Form, Select } from "antd";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Breadcrumb from "../../components/Breadcrumb";
import API from "../../constants/API";
import axiosConfig from "../../constants/AXIOS_CONFIG";

export default function VendorsList() {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingKey, setEditingKey] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [pagination, setPagination] = useState({ pageSize: 5, current: 1 });

  // Fetch vendors on mount
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axiosConfig.get(API.VENDORS);
        const vendors = response.data.map((item) => ({
          ...item,
          key: item.id,
        }));
        setDataSource(vendors);
        setFilteredData(vendors);
      } catch (error) {
        message.error("Failed to fetch vendors");
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
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
    const updatedRow = {
      ...row,
      firstName: row.user.firstName || "",
      lastName: row.user.lastName || "",
      email: row.user.email || "",
    };

    try {
      await axiosConfig.put(`${API.VENDORS}/${key}`, updatedRow);
      message.success("Vendor updated successfully");
      setEditingKey("");
    } catch (error) {
      message.error("Failed to update vendor");
    }
  };

  // Handle cell value change
  const handleInputChange = (key, column, value) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => item.key === key);
    if (index > -1) {
      if (["firstName", "lastName", "email"].includes(column)) {
        newData[index].user[column] = value;
      } else {
        newData[index][column] = value;
      }
      setDataSource(newData);
    }
  };

  // Delete a vendor
  const handleDelete = async (key) => {
    try {
      await axiosConfig.delete(`${API.VENDORS}/${key}`);
      const newData = dataSource.filter((item) => item.key !== key);
      setDataSource(newData);
      setFilteredData(newData);
      message.success("Vendor deleted successfully");
    } catch (error) {
      message.error("Failed to delete vendor");
    }
  };

  // Add new vendor
  const handleAddVendor = async () => {
    const values = await form.validateFields();
    try {
      const response = await axiosConfig.post(API.VENDORS, values);
      const createdVendor = response.data;
      const updatedData = [
        ...dataSource,
        { ...createdVendor, key: createdVendor.id },
      ];
      setDataSource(updatedData);
      setFilteredData(updatedData);
      message.success("Vendor added successfully");
      form.resetFields();
      setIsModalVisible(false);
    } catch (error) {
      if (error.response && error.response.data) {
        const { msg } = error.response.data;
  
        message.error(msg);
      } else {
        message.error("An unexpected error occurred");
      }
    }
  };
  

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = dataSource.filter(
      (item) =>
        item.user.firstName.toLowerCase().includes(value.toLowerCase()) ||
        item.user.email.toLowerCase().includes(value.toLowerCase())
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
      title: "First Name",
      dataIndex: "user.firstName",
      render: (_, record) =>
        editingKey === record.key ? (
          <Input
            defaultValue={record.user.firstName}
            onChange={(e) =>
              handleInputChange(record.key, "firstName", e.target.value)
            }
          />
        ) : (
          record.user.firstName
        ),
    },
    {
      title: "Last Name",
      dataIndex: "user.lastName",
      render: (_, record) =>
        editingKey === record.key ? (
          <Input
            defaultValue={record.user.lastName}
            onChange={(e) =>
              handleInputChange(record.key, "lastName", e.target.value)
            }
          />
        ) : (
          record.user.lastName
        ),
    },
    {
      title: "Email",
      dataIndex: "user.email",
      render: (_, record) =>
        editingKey === record.key ? (
          <Input
            defaultValue={record.user.email}
            onChange={(e) =>
              handleInputChange(record.key, "email", e.target.value)
            }
          />
        ) : (
          record.user.email
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
              icon={<FaEdit />}
              onClick={() => startEditing(record)}
              size="small"
              style={{ marginRight: 8 }}
            />
            <Popconfirm
              title="Are you sure to delete this vendor?"
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
        <h3 className="text-2xl font-semibold">Vendors List</h3>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Add Vendor
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
                placeholder="Search vendors"
                value={searchText}
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: 300 }}
              />
            </div>
          )}
        />
      </div>

      <Modal
        title="Add New Vendor"
        open={isModalVisible}
        onOk={handleAddVendor}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[{ required: true, message: "Please input first name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[{ required: true, message: "Please input last name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input email!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
