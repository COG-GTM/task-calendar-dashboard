import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Button,
  List,
  Modal,
  Input,
  Select,
  Space,
  Tag,
  Card,
  Progress,
  Statistic,
  Row,
  Col,
  Badge,
  Table,
  Tabs,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import { addRule, editRule, deleteRule, setRules, toggleRuleEnforcement } from "./redux/rulesSlice";
import { nanoid } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { PieChart, Pie, Cell, Tooltip as ChartTooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;

const ruleTypes = {
  completeness: "blue",
  accuracy: "green", 
  consistency: "orange",
  validity: "purple",
  timeliness: "red",
};

const ruleStatuses = {
  active: "success",
  inactive: "default",
  warning: "warning",
  error: "error",
};

// Yup Validation Schema for Data Quality Rules
const validationSchema = Yup.object({
  name: Yup.string().required("Rule name is required"),
  type: Yup.string().required("Rule type is required"),
  description: Yup.string().required("Description is required"),
  threshold: Yup.number().min(0).max(100).required("Threshold is required"),
  dataset: Yup.string().required("Dataset is required"),
});

export default function App() {
  const rules = useSelector((state) => state.rules);
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [editId, setEditId] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const [tempFilter, setTempFilter] = useState("");
  const [appliedFilter, setAppliedFilter] = useState("");

  // Load from localStorage once
  useEffect(() => {
    const saved = localStorage.getItem("dataQualityRules");
    if (saved) {
      let parsed = JSON.parse(saved).map((rule) => ({
        ...rule,
        id: rule.id || nanoid(),
      }));
      dispatch(setRules(parsed));
      localStorage.setItem("dataQualityRules", JSON.stringify(parsed));
    } else {
      const sampleRules = [
        {
          id: nanoid(),
          name: "Customer Email Completeness",
          type: "completeness",
          description: "Ensure all customer records have valid email addresses",
          threshold: 95,
          currentScore: 87,
          dataset: "customers",
          status: "warning",
          author: "John Doe",
          createdAt: "2024-01-15",
          lastRun: "2024-01-20",
          enforcement: true,
        },
        {
          id: nanoid(),
          name: "Order Amount Accuracy",
          type: "accuracy",
          description: "Validate order amounts are within expected ranges",
          threshold: 98,
          currentScore: 99,
          dataset: "orders",
          status: "active",
          author: "Jane Smith",
          createdAt: "2024-01-10",
          lastRun: "2024-01-20",
          enforcement: true,
        },
        {
          id: nanoid(),
          name: "Product Code Consistency",
          type: "consistency",
          description: "Ensure product codes follow standard format",
          threshold: 100,
          currentScore: 92,
          dataset: "products",
          status: "warning",
          author: "Mike Johnson",
          createdAt: "2024-01-12",
          lastRun: "2024-01-19",
          enforcement: true,
        },
        {
          id: nanoid(),
          name: "Date Format Validity",
          type: "validity",
          description: "Validate all date fields use ISO format",
          threshold: 100,
          currentScore: 100,
          dataset: "all_tables",
          status: "active",
          author: "Sarah Wilson",
          createdAt: "2024-01-08",
          lastRun: "2024-01-20",
          enforcement: true,
        },
        {
          id: nanoid(),
          name: "Data Freshness Check",
          type: "timeliness",
          description: "Ensure data is updated within 24 hours",
          threshold: 90,
          currentScore: 85,
          dataset: "all_tables",
          status: "error",
          author: "Tom Brown",
          createdAt: "2024-01-05",
          lastRun: "2024-01-20",
          enforcement: false,
        },
      ];
      dispatch(setRules(sampleRules));
      localStorage.setItem("dataQualityRules", JSON.stringify(sampleRules));
    }
  }, [dispatch]);

  // Save Redux → localStorage
  useEffect(() => {
    localStorage.setItem("dataQualityRules", JSON.stringify(rules));
  }, [rules]);

  const filteredRules = rules.filter((rule) =>
    !appliedFilter || rule.type === appliedFilter
  );

  const chartData = Object.keys(ruleTypes).map((type) => ({
    name: type,
    value: rules.filter((r) => r.type === type).length,
  }));
  const COLORS = Object.values(ruleTypes);

  const overallScore = rules.length > 0 
    ? Math.round(rules.reduce((sum, rule) => sum + rule.currentScore, 0) / rules.length)
    : 0;
  
  const activeRules = rules.filter(r => r.status === 'active').length;
  const warningRules = rules.filter(r => r.status === 'warning').length;
  const errorRules = rules.filter(r => r.status === 'error').length;

  const scoreDistribution = [
    { range: '90-100%', count: rules.filter(r => r.currentScore >= 90).length },
    { range: '80-89%', count: rules.filter(r => r.currentScore >= 80 && r.currentScore < 90).length },
    { range: '70-79%', count: rules.filter(r => r.currentScore >= 70 && r.currentScore < 80).length },
    { range: '<70%', count: rules.filter(r => r.currentScore < 70).length },
  ];

  const openAddModal = () => {
    setFormData({
      name: "",
      type: "",
      description: "",
      threshold: 95,
      dataset: "",
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (rule) => {
    setFormData(rule);
    setEditId(rule.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const tableColumns = [
    {
      title: 'Rule Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.dataset}
          </Text>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => (
        <Tag color={ruleTypes[type]}>{type.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'DQ Score',
      dataIndex: 'currentScore',
      key: 'currentScore',
      render: (score, record) => (
        <div>
          <Progress 
            percent={score} 
            size="small" 
            status={score >= record.threshold ? 'success' : score >= 70 ? 'active' : 'exception'}
          />
          <Text style={{ fontSize: '12px' }}>
            {score}% (Target: {record.threshold}%)
          </Text>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Badge status={ruleStatuses[status]} text={status.toUpperCase()} />
      ),
    },
    {
      title: 'Author',
      dataIndex: 'author',
      key: 'author',
    },
    {
      title: 'Last Run',
      dataIndex: 'lastRun',
      key: 'lastRun',
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Enforcement',
      dataIndex: 'enforcement',
      key: 'enforcement',
      render: (enforcement, record) => (
        <Button
          size="small"
          type={enforcement ? 'primary' : 'default'}
          onClick={() => dispatch(toggleRuleEnforcement(record.id))}
        >
          {enforcement ? 'ON' : 'OFF'}
        </Button>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => openEditModal(record)}>
            Edit
          </Button>
          <Button 
            size="small" 
            danger 
            onClick={() => dispatch(deleteRule(record.id))}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar with analytics */}
      <Sider theme="light" width={320} style={{ padding: 20 }}>
        <Title level={4}>Data Quality Analytics</Title>

        {/* Overall Score */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Statistic
            title="Overall DQ Score"
            value={overallScore}
            suffix="%"
            valueStyle={{ 
              color: overallScore >= 90 ? '#3f8600' : overallScore >= 70 ? '#faad14' : '#cf1322' 
            }}
          />
        </Card>

        {/* Rule Status Summary */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Title level={5}>Rule Status</Title>
          <Row gutter={8}>
            <Col span={8}>
              <Statistic title="Active" value={activeRules} valueStyle={{ color: '#3f8600' }} />
            </Col>
            <Col span={8}>
              <Statistic title="Warning" value={warningRules} valueStyle={{ color: '#faad14' }} />
            </Col>
            <Col span={8}>
              <Statistic title="Error" value={errorRules} valueStyle={{ color: '#cf1322' }} />
            </Col>
          </Row>
        </Card>

        {/* Rule Type Distribution */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Title level={5}>Rule Types</Title>
          <PieChart width={280} height={200}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={70}
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <ChartTooltip />
            <Legend />
          </PieChart>
        </Card>

        {/* Score Distribution */}
        <Card size="small">
          <Title level={5}>Score Distribution</Title>
          <BarChart width={280} height={150} data={scoreDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <ChartTooltip />
            <Bar dataKey="count" fill="#1890ff" />
          </BarChart>
        </Card>
      </Sider>

      {/* Main layout */}
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "10px 20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            Data Quality Rules Management
          </Title>
          <Button type="primary" onClick={openAddModal}>
            Add New Rule
          </Button>
        </Header>

        <Content style={{ padding: 20 }}>
          <Tabs activeKey={activeTab} onChange={setActiveTab}>
            <TabPane tab="Overview" key="overview">
              <Row gutter={16} style={{ marginBottom: 24 }}>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Total Rules"
                      value={rules.length}
                      prefix={<span style={{ color: '#1890ff' }}>📊</span>}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Avg DQ Score"
                      value={overallScore}
                      suffix="%"
                      valueStyle={{ 
                        color: overallScore >= 90 ? '#3f8600' : overallScore >= 70 ? '#faad14' : '#cf1322' 
                      }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Rules Enforced"
                      value={rules.filter(r => r.enforcement).length}
                      suffix={`/ ${rules.length}`}
                      valueStyle={{ color: '#3f8600' }}
                    />
                  </Card>
                </Col>
                <Col span={6}>
                  <Card>
                    <Statistic
                      title="Issues Found"
                      value={warningRules + errorRules}
                      valueStyle={{ color: '#cf1322' }}
                    />
                  </Card>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="Rules List" key="rules">
              <div style={{ marginBottom: 16 }}>
                <Space>
                  <Select
                    placeholder="Filter by rule type"
                    value={tempFilter}
                    onChange={(val) => setTempFilter(val)}
                    allowClear
                    style={{ width: 200 }}
                  >
                    {Object.keys(ruleTypes).map((type) => (
                      <Option key={type} value={type}>
                        {type.toUpperCase()}
                      </Option>
                    ))}
                  </Select>
                  <Button type="primary" onClick={() => setAppliedFilter(tempFilter)}>
                    Apply Filter
                  </Button>
                  <Button
                    onClick={() => {
                      setTempFilter("");
                      setAppliedFilter("");
                    }}
                  >
                    Clear Filter
                  </Button>
                </Space>
              </div>

              <Table
                columns={tableColumns}
                dataSource={filteredRules}
                rowKey="id"
                pagination={{ pageSize: 10 }}
                scroll={{ x: 1200 }}
              />
            </TabPane>

            <TabPane tab="DQCA Control" key="dqca">
              <Card>
                <Title level={4}>Data Quality Control & Automation</Title>
                <Row gutter={16}>
                  <Col span={12}>
                    <Card type="inner" title="Automated Monitoring">
                      <List
                        size="small"
                        dataSource={[
                          'Real-time rule execution monitoring',
                          'Automated threshold breach alerts',
                          'Scheduled rule execution reports',
                          'Data lineage impact analysis'
                        ]}
                        renderItem={item => <List.Item>{item}</List.Item>}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card type="inner" title="Control Actions">
                      <List
                        size="small"
                        dataSource={[
                          'Automatic data quarantine on failures',
                          'Workflow integration for remediation',
                          'Stakeholder notification system',
                          'Audit trail and compliance reporting'
                        ]}
                        renderItem={item => <List.Item>{item}</List.Item>}
                      />
                    </Card>
                  </Col>
                </Row>
              </Card>
            </TabPane>

            <TabPane tab="Rule Profiling" key="profiling">
              <Card>
                <Title level={4}>Rule Authoring & Profiling</Title>
                <Table
                  columns={[
                    {
                      title: 'Rule Name',
                      dataIndex: 'name',
                      key: 'name',
                    },
                    {
                      title: 'Author',
                      dataIndex: 'author',
                      key: 'author',
                    },
                    {
                      title: 'Created Date',
                      dataIndex: 'createdAt',
                      key: 'createdAt',
                      render: (date) => dayjs(date).format('MMM DD, YYYY'),
                    },
                    {
                      title: 'Last Modified',
                      dataIndex: 'lastRun',
                      key: 'lastRun',
                      render: (date) => dayjs(date).format('MMM DD, YYYY'),
                    },
                    {
                      title: 'Execution Count',
                      key: 'execCount',
                      render: () => Math.floor(Math.random() * 100) + 50,
                    },
                    {
                      title: 'Avg Runtime',
                      key: 'avgRuntime',
                      render: () => `${(Math.random() * 5 + 0.5).toFixed(2)}s`,
                    },
                  ]}
                  dataSource={rules}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            </TabPane>
          </Tabs>
        </Content>
      </Layout>

      {/* Add/Edit Rule Modal with Formik + Yup */}
      <Modal
        title={isEditing ? "Edit Data Quality Rule" : "Add New Data Quality Rule"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={600}
      >
        <Formik
          enableReinitialize
          initialValues={{
            name: isEditing ? formData.name : "",
            type: isEditing ? formData.type : "",
            description: isEditing ? formData.description : "",
            threshold: isEditing ? formData.threshold : 95,
            dataset: isEditing ? formData.dataset : "",
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            if (isEditing) {
              dispatch(editRule({ ...values, id: editId }));
            } else {
              dispatch(addRule(values));
            }
            resetForm();
            setIsModalOpen(false);
          }}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <label>Rule Name</label>
              <Field
                name="name"
                as={Input}
                style={{ marginBottom: 10 }}
                placeholder="Enter rule name"
              />
              <ErrorMessage
                name="name"
                component="div"
                style={{ color: "red", marginBottom: 10 }}
              />

              <label>Rule Type</label>
              <Select
                value={values.type}
                onChange={(value) => setFieldValue("type", value)}
                style={{ width: "100%", marginBottom: 10 }}
                placeholder="Select rule type"
              >
                {Object.keys(ruleTypes).map((type) => (
                  <Option key={type} value={type}>
                    {type.toUpperCase()}
                  </Option>
                ))}
              </Select>
              <ErrorMessage
                name="type"
                component="div"
                style={{ color: "red", marginBottom: 10 }}
              />

              <label>Description</label>
              <Field
                name="description"
                as={Input.TextArea}
                style={{ marginBottom: 10 }}
                placeholder="Describe what this rule validates"
                rows={3}
              />
              <ErrorMessage
                name="description"
                component="div"
                style={{ color: "red", marginBottom: 10 }}
              />

              <label>Quality Threshold (%)</label>
              <Field
                name="threshold"
                as={Input}
                type="number"
                min={0}
                max={100}
                style={{ marginBottom: 10 }}
                placeholder="Enter threshold percentage"
              />
              <ErrorMessage
                name="threshold"
                component="div"
                style={{ color: "red", marginBottom: 10 }}
              />

              <label>Dataset/Table</label>
              <Field
                name="dataset"
                as={Input}
                style={{ marginBottom: 10 }}
                placeholder="Enter dataset or table name"
              />
              <ErrorMessage
                name="dataset"
                component="div"
                style={{ color: "red", marginBottom: 10 }}
              />

              <Button type="primary" htmlType="submit" block>
                {isEditing ? "Update Rule" : "Create Rule"}
              </Button>
            </Form>
          )}
        </Formik>
      </Modal>
    </Layout>
  );
}
