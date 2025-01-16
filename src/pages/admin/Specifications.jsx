import React, { useState, useEffect } from "react";
import { Table, Input, Button, Popconfirm, message, Modal, Form, Select } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import Breadcrumb from "../../components/Breadcrumb";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import axiosConfig from "../../constants/AXIOS_CONFIG";
import API from "../../constants/API";

const Specifications = () => {
    const [dataSource, setDataSource] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingKey, setEditingKey] = useState("");
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [searchText, setSearchText] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [pagination, setPagination] = useState({ pageSize: 5, current: 1 });

    // Fetch specifications
    useEffect(() => {
        const fetchSpecifications = async () => {
            try {
                const response = await axiosConfig.get(API.ADMIN_SPECIFICATIONS);

                console.log("Response Data:", response.data);
                                
                const specifications = response.data.result.map((item) => ({
                    ...item,
                    key: item.id,
                }));

                setDataSource(specifications);
                setFilteredData(specifications);
               
            } catch (error) {
                message.error(error.response?.data?.msg || "Failed to fetch specifications.");
            } finally {
                setLoading(false);
            }
        };

        fetchSpecifications();
    }, []);

    useEffect(() => {
        const fetchSubCategories = async () => {
            try {
                const response = await axiosConfig.get(API.ADMIN_SUBCATEGORIES);
                setSubCategories(response.data.result); 
            } catch (error) {
                message.error(error.response?.data?.msg || "Failed to fetch sub-categories")
            } finally {
                setLoading(false);
            }
        };

        fetchSubCategories();
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
    const handleUpdateSpecification = async (key) => {
        const row = dataSource.find((item) => item.key === key);
        try {
            await axiosConfig.put(`${API.ADMIN_SPECIFICATIONS}/${key}`, row);
            message.success("Specification updated successfully");
            setEditingKey("");
        } catch (error) {
            message.error("Failed to update specification.");
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

    // Add new specification
    const handleAddSpecifications = async () => {
        const values = await form.validateFields();

        console.log(values);

        try {
            const response = await axiosConfig.post(API.ADMIN_SPECIFICATIONS, values);
            console.log(response)

            const { code, msg, result } = response.data;
            if(code== '201'){
                const updatedData = [...dataSource, { ...result, key: result.id }];
                setDataSource(updatedData);
                setFilteredData(updatedData);
                message.success(msg || "Specification added ");
                form.resetFields();
                setIsModalVisible(false);
            } else {
                message.error(msg || "Unexpected error occurred.");
            }
        } catch (error) {
            message.error(error.response?.data?.msg || "Failed to add .");
        }
    };

    // Delete a specification
    const handleDelete = async (key) => {
        try {
            await axiosConfig.delete(`${API.ADMIN_SPECIFICATIONS}/${key}`);
            const newData = dataSource.filter((item) => item.key !== key);
            setDataSource(newData);
            setFilteredData(newData);
            message.success("Specification deleted successfully.");
        } catch (error) {
            message.error("Failed to delete specification.");
        }
    };

    // Handle search
    const handleSearch = (value) => {
        setSearchText(value);
        const filtered = dataSource.filter((item) =>
            item.name.toLowerCase().includes(value.toLowerCase())
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
            title: "ID",
            dataIndex: "id",
        },
        {
            title: "Name",
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
                            onClick={() => handleUpdateSpecification(record.key)}
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
                            title="Are you sure to delete this specification?"
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
                <h3 className="text-2xl font-semibold">Specifications</h3>
                <Button type="primary" onClick={() => setIsModalVisible(true)}>
                    Add Specification
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
                            placeholder="Search specification"
                            value={searchText}
                            onChange={(e) => handleSearch(e.target.value)}
                            style={{ width: 300 }}
                        />
                    </div>
                )}
            />
            <Modal
                title="Add Specifications"
                open={isModalVisible}
                onOk={handleAddSpecifications}
                onCancel={() => setIsModalVisible(false)}
            >
                <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                        sub_category_id: "",
                        specifications: [{ name: "", description: "" }],
                    }}
                >
                    {/* Sub-Category Selection */}
                    <Form.Item
                        label="Sub Category"
                        name="subCategoryId"
                        rules={[{ required: true, message: "Please select a sub-category!" }]}
                    >
                        <Select
                            placeholder="Select a sub-category"
                            options={subCategories.map((cat) => ({
                                label: cat.name,
                                value: cat.id,
                            }))}
                        />
                    </Form.Item>

                    {/* Dynamic List for Specifications */}
                    <Form.List name="specifications">
                        {(fields, { add, remove }) => (
                            <>
                                {fields.map(({ key, name, fieldKey, ...restField }) => (
                                    <div key={key} style={{ display: "flex", alignItems: "center" }}>
                                        {/* Specification Name */}
                                        <Form.Item
                                            {...restField}
                                            name={[name, "name"]}
                                            fieldKey={[fieldKey, "name"]}
                                            rules={[{ required: true, message: "Please input the name!" }]}
                                            style={{ flex: 1, marginRight: 8 }}
                                        >
                                            <Input placeholder="Specification Name" />
                                        </Form.Item>

                                        {/* Specification Description */}
                                        <Form.Item
                                            {...restField}
                                            name={[name, "description"]}
                                            fieldKey={[fieldKey, "description"]}
                                            rules={[{ required: true, message: "Please input the description!" }]}
                                            style={{ flex: 1, marginRight: 8 }}
                                        >
                                            <Input.TextArea placeholder="Description" rows={1} />
                                        </Form.Item>

                                        {/* Remove Button */}
                                        <Button
                                            type="link"
                                            onClick={() => remove(name)}
                                            icon={<DeleteOutlined />}
                                            danger
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                ))}

                                {/* Add New Specification Button */}
                                <Form.Item>
                                    <Button
                                        type="dashed"
                                        onClick={() => add()}
                                        style={{ width: "100%" }}
                                        icon={<PlusOutlined />}
                                    >
                                        Add Specification
                                    </Button>
                                </Form.Item>
                            </>
                        )}
                    </Form.List>
                </Form>
            </Modal>
        </div>
    );
};

export default Specifications;
