import React, { useState, useEffect } from "react";
import {
  Layout,
  Typography,
  Button,
  Modal,
  Input,
  Select,
  DatePicker,
  Space,
} from "antd";
import { Routes, Route } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addTask, editTask, deleteTask, setTasks } from "./redux/tasksSlice";
import { nanoid } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { PieChart, Pie, Cell, Tooltip as ChartTooltip, Legend } from "recharts";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Calendar from "./components/Calendar";

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { Option } = Select;

const categories = {
  success: "green",
  warning: "orange",
  issue: "red",
  info: "blue",
};

// Yup Validation Schema
const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  category: Yup.string().required("Category is required"),
  date: Yup.string().required("Date is required"),
});

export default function App() {
  const tasks = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [editId, setEditId] = useState(null);

  const [tempFilter, setTempFilter] = useState("");
  const [appliedFilter, setAppliedFilter] = useState("");

  // Load from localStorage once
  useEffect(() => {
    const saved = localStorage.getItem("tasks");
    if (saved) {
      let parsed = JSON.parse(saved).map((task) => ({
        ...task,
        id: task.id || nanoid(),
      }));
      dispatch(setTasks(parsed));
      localStorage.setItem("tasks", JSON.stringify(parsed));
    }
  }, [dispatch]);

  // Save Redux → localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);


  const chartData = Object.keys(categories).map((cat) => ({
    name: cat,
    value: tasks.filter((t) => t.category === cat).length,
  }));
  const COLORS = Object.values(categories);

  const openAddModal = (date = selectedDate) => {
    setFormData({
      title: "",
      description: "",
      category: "",
      date: date.format("YYYY-MM-DD"),
    });
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const openEditModal = (task) => {
    setFormData(task);
    setEditId(task.id);
    setIsEditing(true);
    setIsModalOpen(true);
  };


  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar with chart & filter */}
      <Sider theme="light" width={300} style={{ padding: 20 }}>
        <Title level={4}>Task Categories Chart</Title>

        <Select
          placeholder="Select category"
          value={tempFilter}
          onChange={(val) => setTempFilter(val)}
          allowClear
          style={{ width: "100%", marginBottom: 10 }}
        >
          {Object.keys(categories).map((cat) => (
            <Option key={cat} value={cat}>
              {cat}
            </Option>
          ))}
        </Select>

        <Space>
          <Button type="primary" onClick={() => setAppliedFilter(tempFilter)}>
            Apply
          </Button>
          <Button
            onClick={() => {
              setTempFilter("");
              setAppliedFilter("");
            }}
          >
            Reset
          </Button>
        </Space>

        <PieChart width={250} height={250} style={{ marginTop: 20 }}>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
            ))}
          </Pie>
          <ChartTooltip />
          <Legend />
        </PieChart>
      </Sider>

      {/* Main layout */}
      <Layout>
        <Header
          style={{
            background: "#fff",
            padding: "10px 20px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Title level={3} style={{ margin: 0 }}>
            Task Calendar Dashboard
          </Title>
          <Button type="primary" onClick={() => openAddModal(selectedDate)}>
            Add Task
          </Button>
        </Header>

        <Content style={{ padding: 20 }}>
          <Routes>
            <Route 
              path="/" 
              element={
                <Calendar
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                  appliedFilter={appliedFilter}
                  onEditTask={openEditModal}
                  onDeleteTask={(id) => dispatch(deleteTask(id))}
                />
              } 
            />
          </Routes>
        </Content>
      </Layout>

      {/* Add/Edit Task Modal with Formik + Yup */}
      <Modal
        title={isEditing ? "Edit Task" : "Add Task"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
      >
        <Formik
          enableReinitialize
          initialValues={{
            title: isEditing ? formData.title : "",
            description: isEditing ? formData.description : "",
            category: isEditing ? formData.category : "",
            date: isEditing
              ? formData.date
              : selectedDate.format("YYYY-MM-DD"),
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            if (isEditing) {
              dispatch(editTask({ ...values, id: editId }));
            } else {
              dispatch(addTask(values));
            }
            resetForm();
            setIsModalOpen(false);
          }}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <label>Title</label>
              <Field
                name="title"
                as={Input}
                style={{ marginBottom: 10 }}
                placeholder="Enter title"
              />
              <ErrorMessage
                name="title"
                component="div"
                style={{ color: "red", marginBottom: 10 }}
              />

              <label>Description</label>
              <Field
                name="description"
                as={Input.TextArea}
                style={{ marginBottom: 10 }}
                placeholder="Enter description"
              />

              <label>Category</label>
              <Select
                value={values.category}
                onChange={(value) => setFieldValue("category", value)}
                style={{ width: "100%", marginBottom: 10 }}
              >
                {Object.keys(categories).map((cat) => (
                  <Option key={cat} value={cat}>
                    {cat}
                  </Option>
                ))}
              </Select>
              <ErrorMessage
                name="category"
                component="div"
                style={{ color: "red", marginBottom: 10 }}
              />

              <label>Date</label>
              <DatePicker
                value={dayjs(values.date)}
                onChange={(date) =>
                  setFieldValue("date", date.format("YYYY-MM-DD"))
                }
                style={{ width: "100%", marginBottom: 10 }}
              />
              <ErrorMessage
                name="date"
                component="div"
                style={{ color: "red", marginBottom: 10 }}
              />

              <Button type="primary" htmlType="submit" block>
                {isEditing ? "Update Task" : "Add Task"}
              </Button>
            </Form>
          )}
        </Formik>
      </Modal>
    </Layout>
  );
}
