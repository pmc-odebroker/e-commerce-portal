import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Spin, message, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Breadcrumb from '../../components/Breadcrumb';
import axiosConfig from '../../constants/AXIOS_CONFIG';
import API from '../../constants/API';
import { useParams } from 'react-router-dom';
import defaultProductImage from "../../assets/product-image.jpg";

const { Option } = Select;

export default function VendorProductDetails() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState({});
    const [categories, setCategories] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [imageSource, setImageSource] = useState('upload');
    const [file, setFile] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productRes, categoriesRes, statusesRes] = await Promise.all([
                    axiosConfig.get(API.VENDOR_PRODUCT(id)),
                    axiosConfig.get(API.CATEGORIES),
                    axiosConfig.get(API.PRODUCT_STATUSES),
                ]);

                const mappedProduct = {
                    ...productRes.data,
                    category: productRes.data.categoryName,
                    productStatus: productRes.data.productStatusName,
                };

                setProduct(mappedProduct);
                setCategories(categoriesRes.data);
                setStatuses(statusesRes.data);

                // Set default image source based on imageUrl
                const defaultSource = productRes.data.imageUrl?.startsWith('http') ? 'url' : 'upload';
                setImageSource(defaultSource);

                form.setFieldsValue({ ...mappedProduct, imageSource: defaultSource });
            } catch (error) {
                message.error('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [form, id]);

    const handleSave = async (values) => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('category', values.category);
            formData.append('productStatus', values.productStatus);
            formData.append('price', values.price);
            formData.append('description', values.description);

            if (imageSource === 'upload' && file) {
                formData.append('imageFile', file);
            } else if (imageSource === 'url') {
                formData.append('imageUrl', values.imageUrl);
            }

            await axiosConfig.put(API.VENDOR_PRODUCT_UPDATE(product.id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            message.success('Product updated successfully!');
        } catch (error) {
            message.error('Failed to update product');
        } finally {
            setLoading(false);
        }
    };

    const handleSourceChange = (value) => {
        setImageSource(value);
        form.resetFields(['imageFile', 'imageUrl']);
        setFile(null);
    };

    const getProductImageSrc = (imagePath) => {
        if (!imagePath) return defaultProductImage;
        const isOnlineLink = imagePath.startsWith('http');
        return isOnlineLink ? imagePath : `http://localhost:8080/uploads/${imagePath.split('/uploads/').pop()}`;
    };

    if (loading) {
        return (
            <div className="p-6 bg-white flex justify-center items-center">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="p-6 bg-white">
            <Breadcrumb />
            <h3 className="text-2xl font-semibold pb-4">Edit Product Details</h3>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSave}
                initialValues={product}
            >
                <Form.Item label="Current Product Image">
                    <img
                        src={getProductImageSrc(product.imageUrl)}
                        alt="Product"
                        style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                        onError={(e) => {
                            e.target.src = defaultProductImage;
                        }}
                    />
                </Form.Item>

                <Form.Item
                    label="Image Source"
                    name="imageSource"
                    rules={[{ required: true, message: "Please select an image source!" }]}
                >
                    <Select
                        value={imageSource}
                        options={[
                            { label: "Upload File", value: "upload" },
                            { label: "Provide URL", value: "url" },
                        ]}
                        onChange={handleSourceChange}
                    />
                </Form.Item>

                {imageSource === 'upload' ? (
                    <Form.Item
                        label="Product Image (Upload)"
                        name="imageFile"
                        rules={[
                            { required: true, message: "Please upload an image!" },
                        ]}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
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
                            { type: 'url', required: true, message: "Please provide a valid URL!" },
                        ]}
                    >
                        <Input placeholder="Enter image URL" />
                    </Form.Item>
                )}

                <Form.Item
                    label="Product Name"
                    name="name"
                    rules={[{ required: true, message: 'Please enter the product name' }]}
                >
                    <Input placeholder="Enter product name" />
                </Form.Item>

                <Form.Item
                    label="Category"
                    name="category"
                    rules={[{ required: true, message: 'Please select a category' }]}
                >
                    <Select placeholder="Select a category">
                        {categories.map((category) => (
                            <Option key={category.id} value={category.id}>
                                {category.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Status"
                    name="productStatus"
                    rules={[{ required: true, message: 'Please select a status' }]}
                >
                    <Select placeholder="Select a status">
                        {statuses.map((status) => (
                            <Option key={status.id} value={status.id}>
                                {status.statusName}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Price"
                    name="price"
                    rules={[{ required: true, message: 'Please enter the price' }]}
                >
                    <Input type="number" placeholder="Enter price" />
                </Form.Item>

                <Form.Item label="Description" name="description">
                    <Input.TextArea placeholder="Enter product description" rows={4} />
                </Form.Item>

                <div className="flex justify-end">
                    <Button type="primary" htmlType="submit">
                        Save Changes
                    </Button>
                </div>
            </Form>
        </div>
    );
}
