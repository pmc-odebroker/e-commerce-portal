import React, { useState, useEffect } from "react";
import { Table, Input, Button, Popconfirm, message, Modal, Form, Select } from "antd";
import Breadcrumb from "../../components/Breadcrumb";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import axiosConfig from "../../constants/AXIOS_CONFIG";
import API from "../../constants/API";

const SubCategories = () => {
    const [dataSource, setDataSource] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingKey, setEditingKey] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [pagination, setPagination] = useState({ pageSize: 5, current: 1 });

    // Fetch subcategories
    useEffect(() => {
        const fetchSubCategories = async () => {
        try {
            const response = await axiosConfig.get(API.ADMIN_SUBCATEGORIES);
            const subCategories = response.data.result.map((item) => ({
            ...item,
            key: item.id,
            }));
            setDataSource(subCategories);
            setFilteredData(subCategories);
        } catch (error) {
            message.error("Failed to fetch subcategories");
        } finally {
            setLoading(false);
        }
        };

        fetchSubCategories();
    }, []);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosConfig.get(API.CATEGORIES);
                setCategories(response.data);
            } catch (error) {
                message.error("Failed to fetch categories");
            }
        };

        fetchCategories();
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
        await axiosConfig.put(`${API.ADMIN_SUBCATEGORIES}/${key}`, row);
        message.success("SubCategory updated successfully");
        setEditingKey("");
        } catch (error) {
        message.error("Failed to update subcategory");
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

    // Delete a subcategory
    const handleDelete = async (key) => {
        try {
        await axiosConfig.delete(`${API.ADMIN_SUBCATEGORIES}/${key}`);
        const newData = dataSource.filter((item) => item.key !== key);
        setDataSource(newData);
        setFilteredData(newData);
        message.success("SubCategory deleted successfully");
        } catch (error) {
        message.error("Failed to delete subcategory");
        }
    };

    // Add new subcategory
    const handleAddSubCategory = async () => {
        const values = await form.validateFields();
        try {
        const response = await axiosConfig.post(API.ADMIN_SUBCATEGORIES, values);
        const createdSubCategory = response.data.result;
        const updatedData = [
            ...dataSource,
            { ...createdSubCategory, key: createdSubCategory.id },
        ];
        setDataSource(updatedData);
        setFilteredData(updatedData);
        message.success("SubCategory added successfully");
        form.resetFields();
        setIsModalVisible(false);
        } catch (error) {
        message.error("Failed to add subcategory");
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

    // Columns definition
    const columns = [
        {
        title: "SubCategory Name",
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
                title="Are you sure to delete this subcategory?"
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
    
        {/* Header Section */}
        <div className="row flex justify-between mt-2">
            <h3 className="text-2xl font-semibold">SubCategories</h3>
            <Button type="primary" onClick={() => setIsModalVisible(true)}>
            Add SubCategory
            </Button>
        </div>
    
        {/* Table Section */}
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
                    placeholder="Search subcategories"
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ width: 300 }}
                />
                </div>
            )}
            />
        </div>
    
        {/* Modal Section */}
        <Modal
            title="Add New SubCategory"
            open={isModalVisible}
            onOk={handleAddSubCategory}
            onCancel={() => setIsModalVisible(false)}
            confirmLoading={loading}
        >
            <Form form={form} layout="vertical">
                <Form.Item
                    label="Category"
                    name="category_id"
                    rules={[{ required: true, message: "Please select a category!" }]}
                >
                    <Select
                    placeholder="Select a category"
                    options={categories.map((cat) => ({
                        label: cat.name,
                        value: cat.id,
                    }))}
                    />
            </Form.Item>
            <Form.Item
                label="SubCategory Name"
                name="name"
                rules={[{ required: true, message: "Please input subcategory name!" }]}
            >
                <Input />
            </Form.Item>
            <Form.Item
                label="Description"
                name="description"
                rules={[
                { required: true, message: "Please input subcategory description!" },
                ]}
            >
                <Input.TextArea />
            </Form.Item>
            </Form>
        </Modal>
        </div>
    );
};

export default SubCategories;
