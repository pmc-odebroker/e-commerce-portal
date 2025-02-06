import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Spin, message, Upload, Row, Col } from 'antd';
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
    const [subCategories, setSubCategories] = useState([]);
    const [specifications, setSpecifications] = useState([]);
    const [statuses, setStatuses] = useState([]);
    const [imageSource, setImageSource] = useState('upload');
    const [file, setFile] = useState(null);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productRes, categoriesRes, subCategoriesRes, specificationsRes, statusesRes] = await Promise.all([
                    axiosConfig.get(API.VENDOR_PRODUCT(id)),
                    axiosConfig.get(API.CATEGORIES),
                    axiosConfig.get(API.ADMIN_SUBCATEGORIES),
                    axiosConfig.get(API.ADMIN_SPECIFICATIONS),
                    axiosConfig.get(API.PRODUCT_STATUSES),
                ]);

                console.log("product API Response:", productRes.data);
                console.log("SubCategories API Response:", subCategoriesRes.data);
                console.log("Specifications API Response:", specificationsRes.data);
                
                const mappedProduct = {
                    ...productRes.data,
                    category: productRes.data.categoryId,
                    subCategory: productRes.data.subCategoryId,
                    productStatus: productRes.data.productStatusId,
                };

                // Get product specifications (specifications already associated with the product)
                const mappedProductSpecifications = productRes.data.specifications.map(spec => ({
                    name: spec.name,
                    value: spec.value,
                    id: spec.id,
                }));

                // Get sub-category specifications (generic specifications based on the sub-category)
                const mappedSubCategorySpecifications = specificationsRes.data.result.filter(
                    spec => spec.subCategoryId === productRes.data.subCategoryId
                );

                // Merge the product specifications with the sub-category specifications
                const allSpecifications = [
                    ...mappedProductSpecifications,
                    ...mappedSubCategorySpecifications.filter(subSpec =>
                        !mappedProductSpecifications.some(productSpec => productSpec.id === subSpec.id)
                    ),
                ];

                setProduct(mappedProduct);
                setCategories(categoriesRes.data);
                setSubCategories(subCategoriesRes.data.result);
                setSpecifications(allSpecifications);
                setStatuses(statusesRes.data);

                const defaultSource = productRes.data.imageUrl?.startsWith('http') ? 'url' : 'upload';
                setImageSource(defaultSource);

                form.setFieldsValue({ ...mappedProduct, imageSource: defaultSource, specifications: allSpecifications });
            } catch (error) {
                message.error('Failed to fetch data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [form, id]);

    // dynamic update specifications when the subCategory changes
    useEffect(() => {
        if (product?.subCategory) {
            const filteredSpecifications = specifications.filter(spec => spec.subCategoryId === product.subCategory);
            console.log("Filtered Specifications:", filteredSpecifications);

            form.setFieldsValue({ specifications: filteredSpecifications });
            setProduct(prev => ({ ...prev, specifications: filteredSpecifications }));
        }
    }, [product?.subCategory, specifications]);

    const handleSave = async (values) => {
        try {
            setLoading(true);

            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('categoryId', values.category);
            formData.append('subCategoryId', values.subCategory);
            formData.append('productStatusId', values.productStatus);
            formData.append('specifications', values.specifications);
            formData.append('price', values.price);
            formData.append('description', values.description);

            console.log("Image Source:", imageSource);
            console.log("File to upload:", file);

            if (imageSource === 'upload' && file) {
                console.log("Appending file to formData:", file);
                formData.append('imageFile', file);
            } else if (imageSource === 'url') {
                console.log("Appending image URL to formData:", values.imageUrl);
                formData.append('imageUrl', values.imageUrl);
            }

            // Send update request
            const response = await axiosConfig.put(API.VENDOR_PRODUCT_UPDATE(product.id), formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setProduct(response.data);
            form.setFieldsValue({
                ...response.data,
                category: response.data.categoryId,
                subCategory: response.data.subCategoryId,
                productStatus: response.data.productStatusId,
            });

            message.success('Product updated successfully!');
        } catch (error) {
            if (error.response && error.response.data) {
                message.error(error.response.data.message || 'Failed to update product');
            } else {
                message.error('Failed to update product');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubCategoryChange = async (subCategoryId) => {
        try {
            const response = await axiosConfig.get(API.ADMIN_SUBCATEGORY_SPECIFICATIONS(subCategoryId));
            const subCategorySpecifications = response.data.result;

            console.log("the specifications related to subcategory are", subCategorySpecifications);
    
            setSpecifications(subCategorySpecifications);
    
            form.setFieldsValue({
                specifications: [],
            });
        } catch (error) {
            message.error('Failed to fetch sub-category specifications');
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
        return isOnlineLink
            ? imagePath
            : `${import.meta.env.VITE_URL}${import.meta.env.VITE_PATH}${imagePath.split(import.meta.env.VITE_PATH).pop()}`;
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

                <Row gutter={16}>
                    <Col span={12}>
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
                    </Col>
                    <Col span={12}>
                        {imageSource === 'upload' ? (
                            <Form.Item
                            label="Product Image (Upload)"
                            name="imageFile"
                            rules={[{ required: false, message: "Please upload an image!" }]}
                        >
                            <Upload
                                fileList={file ? [file] : []}
                                beforeUpload={(file) => {
                                    setFile(file);
                                    return false;
                                }}
                                showUploadList={false}
                                accept="image/png,image/jpeg"
                            >
                                <Button icon={<UploadOutlined />}>Choose File</Button>
                            </Upload>
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
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            label="Product Name"
                            name="name"
                            rules={[{ required: true, message: 'Please enter the product name' }]}
                        >
                            <Input placeholder="Enter product name" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
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
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Description"
                            name="description"
                             rules={[{ required: true, message: "Please input product description!" }]}
                        >
                        <Input.TextArea />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Sub Category"
                            name="subCategory"
                            rules={[{ required: true, message: 'Please select a sub-category' }]}
                        >
                            <Select placeholder="Select a sub-category" onChange={handleSubCategoryChange}>
                                {subCategories.map((subCategory) => (
                                    <Option key={subCategory.id} value={subCategory.id}>
                                        {subCategory.name}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                    <Form.List name="specifications">
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
                                {fields.map(({ key, name, fieldKey, ...restField }) => {
                                    const spec = specifications[key];
                                    return (
                                        <Row
                                            gutter={[16, 16]}
                                            key={key}
                                            align="middle"
                                            style={{ marginBottom: "10px" }}
                                        >
                                            <Col span={10}>
                                                <Form.Item {...restField} name={[name, "name"]}>
                                                    <Input
                                                        value={spec?.name}
                                                        disabled
                                                        style={{ backgroundColor: "#f5f5f5" }}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={10}>
                                                <Form.Item
                                                    {...restField}
                                                    name={[name, "value"]}
                                                    initialValue={spec?.value}
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
                                    );
                                })}
                            </>
                        )}
                    </Form.List>

                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
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
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            label="Price"
                            name="price"
                            rules={[{ required: true, message: 'Please enter the price' }]}
                        >
                            <Input type="number" placeholder="Enter price" />
                        </Form.Item>
                    </Col>
                </Row>

                <div className="flex justify-end">
                    <Button type="primary" htmlType="submit">
                        Save Changes
                    </Button>
                </div>
            </Form>
        </div>
    );
}
