import React, { useState } from "react";
import { Typography, Select, Button, Space, Card, Row, Col } from "antd";
import { useSelector } from "react-redux";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { categories } from "../utils/constants";

const { Title } = Typography;
const { Option } = Select;

export default function AnalyticsView() {
  const tasks = useSelector((state) => state.tasks);
  const [tempFilter, setTempFilter] = useState("");
  const [appliedFilter, setAppliedFilter] = useState("");

  const filteredTasks = appliedFilter 
    ? tasks.filter(t => t.category === appliedFilter)
    : tasks;

  const chartData = Object.keys(categories).map((cat) => ({
    name: cat,
    value: tasks.filter((t) => t.category === cat).length,
  }));

  const monthlyData = {};
  tasks.forEach(task => {
    const month = task.date.substring(0, 7);
    if (!monthlyData[month]) {
      monthlyData[month] = 0;
    }
    monthlyData[month]++;
  });

  const monthlyChartData = Object.entries(monthlyData).map(([month, count]) => ({
    month,
    tasks: count,
  }));

  const COLORS = Object.values(categories);

  return (
    <div>
      <Title level={2}>Analytics Dashboard</Title>
      
      <Card style={{ marginBottom: 20 }}>
        <Title level={4}>Filter Tasks</Title>
        <Space>
          <Select
            placeholder="Select category"
            value={tempFilter}
            onChange={(val) => setTempFilter(val)}
            allowClear
            style={{ width: 200 }}
          >
            {Object.keys(categories).map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
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
            Reset Filter
          </Button>
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card>
            <Title level={4}>Task Categories Distribution</Title>
            <PieChart width={400} height={300}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card>
            <Title level={4}>Monthly Task Count</Title>
            <BarChart width={400} height={300} data={monthlyChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tasks" fill="#1890ff" />
            </BarChart>
          </Card>
        </Col>
      </Row>

      <Card style={{ marginTop: 20 }}>
        <Title level={4}>Summary Statistics</Title>
        <Row gutter={[16, 16]}>
          <Col xs={12} sm={6}>
            <div style={{ textAlign: "center" }}>
              <Title level={2} style={{ margin: 0, color: "#1890ff" }}>
                {filteredTasks.length}
              </Title>
              <p>Total Tasks</p>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ textAlign: "center" }}>
              <Title level={2} style={{ margin: 0, color: "#52c41a" }}>
                {tasks.filter(t => t.category === 'success').length}
              </Title>
              <p>Completed</p>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ textAlign: "center" }}>
              <Title level={2} style={{ margin: 0, color: "#faad14" }}>
                {tasks.filter(t => t.category === 'warning').length}
              </Title>
              <p>In Progress</p>
            </div>
          </Col>
          <Col xs={12} sm={6}>
            <div style={{ textAlign: "center" }}>
              <Title level={2} style={{ margin: 0, color: "#ff4d4f" }}>
                {tasks.filter(t => t.category === 'issue').length}
              </Title>
              <p>Issues</p>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
