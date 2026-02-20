import React, { useState, useEffect, useMemo } from "react";
import {
  Layout,
  Calendar,
  Typography,
  Button,
  List,
  Empty,
  Modal,
  Input,
  Select,
  DatePicker,
  Space,
  Tag,
  Tooltip,
  Divider,
  Badge,
} from "antd";
import { useSelector, useDispatch } from "react-redux";
import {
  addTask,
  editTask,
  deleteTask,
  deleteRecurringSeries,
  setTasks,
} from "./redux/tasksSlice";
import { nanoid } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { PieChart, Pie, Cell, Tooltip as ChartTooltip, Legend } from "recharts";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

dayjs.extend(isBetween);

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { Search } = Input;

const categories = {
  success: "green",
  warning: "orange",
  issue: "red",
  info: "blue",
};

const recurrenceOptions = [
  { value: "none", label: "No Recurrence" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  category: Yup.string().required("Category is required"),
  date: Yup.string().required("Date is required"),
});

const exportTasksToCSV = (tasksToExport) => {
  const headers = ["Title", "Description", "Category", "Date", "Recurrence"];
  const rows = tasksToExport.map((t) => [
    `"${(t.title || "").replace(/"/g, '""')}"`,
    `"${(t.description || "").replace(/"/g, '""')}"`,
    t.category || "",
    t.date || "",
    t.recurrence || "none",
  ]);
  const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join(
    "\n"
  );
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `tasks_export_${dayjs().format("YYYY-MM-DD")}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};

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

  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [isSearchMode, setIsSearchMode] = useState(false);

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

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (t) =>
        t.date === selectedDate.format("YYYY-MM-DD") &&
        (!appliedFilter || t.category === appliedFilter)
    );
  }, [tasks, selectedDate, appliedFilter]);

  const searchResults = useMemo(() => {
    if (!isSearchMode) return [];
    return tasks.filter((t) => {
      const matchesText =
        !searchQuery ||
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.description || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !appliedFilter || t.category === appliedFilter;
      const matchesDateRange =
        !dateRange ||
        dayjs(t.date).isBetween(dateRange[0], dateRange[1], "day", "[]");
      return matchesText && matchesCategory && matchesDateRange;
    });
  }, [tasks, searchQuery, appliedFilter, dateRange, isSearchMode]);

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
      recurrence: "none",
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

  const handleDeleteTask = (task) => {
    if (task.recurrence && task.recurrence !== "none" && !task.recurringParentId) {
      Modal.confirm({
        title: "Delete Recurring Task",
        content: "Delete only this task or the entire series?",
        okText: "Delete Series",
        cancelText: "Delete Only This",
        onOk: () => dispatch(deleteRecurringSeries(task.id)),
        onCancel: () => dispatch(deleteTask(task.id)),
      });
    } else if (task.recurringParentId) {
      dispatch(deleteTask(task.id));
    } else {
      dispatch(deleteTask(task.id));
    }
  };

  const dateCellRender = (value) => {
    const dateStr = value.format("YYYY-MM-DD");
    const dayTasks = tasks.filter((t) => t.date === dateStr);
    return (
      <div>
        {dayTasks.map((task) => (
          <Tooltip
            key={task.id}
            title={`${task.title}${
              task.description ? `: ${task.description}` : ""
            }${task.recurrence && task.recurrence !== "none" ? ` (${task.recurrence})` : ""}`}
          >
            <Tag
              color={categories[task.category] || "default"}
              style={{
                margin: "1px 0",
                padding: "0 4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              {task.recurrence && task.recurrence !== "none" ? "↻" : "●"}
            </Tag>
          </Tooltip>
        ))}
      </div>
    );
  };

  const displayedTasks = isSearchMode ? searchResults : filteredTasks;

  const renderTaskItem = (item) => (
    <List.Item
      actions={[
        <Button type="link" onClick={() => openEditModal(item)}>
          Edit
        </Button>,
        <Button
          type="link"
          danger
          onClick={() => handleDeleteTask(item)}
        >
          Delete
        </Button>,
      ]}
    >
      <div>
        <Space>
          <strong>{item.title}</strong>
          {item.recurrence && item.recurrence !== "none" && (
            <Tag color="purple">{item.recurrence}</Tag>
          )}
          {item.recurringParentId && (
            <Tag color="geekblue">series</Tag>
          )}
        </Space>
        {item.description && <div>{item.description}</div>}
        <Space>
          {item.category && (
            <Tag color={categories[item.category]}>{item.category}</Tag>
          )}
          {isSearchMode && (
            <Text type="secondary">{dayjs(item.date).format("DD MMM YYYY")}</Text>
          )}
        </Space>
      </div>
    </List.Item>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
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

        <Divider />

        <Title level={5}>Export Tasks</Title>
        <Space direction="vertical" style={{ width: "100%" }}>
          <Button
            block
            onClick={() => exportTasksToCSV(tasks)}
            disabled={tasks.length === 0}
          >
            Export All Tasks (CSV)
          </Button>
          <Button
            block
            onClick={() => exportTasksToCSV(displayedTasks)}
            disabled={displayedTasks.length === 0}
          >
            Export Visible Tasks (CSV)
          </Button>
        </Space>
      </Sider>

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
            Task Calendar Dashboard
          </Title>
          <Space>
            <Button
              type={isSearchMode ? "default" : "dashed"}
              onClick={() => {
                setIsSearchMode(!isSearchMode);
                setSearchQuery("");
                setDateRange(null);
              }}
            >
              {isSearchMode ? "Back to Calendar" : "Search Tasks"}
            </Button>
            <Button type="primary" onClick={() => openAddModal(selectedDate)}>
              Add Task
            </Button>
          </Space>
        </Header>

        <Content style={{ padding: 20 }}>
          {isSearchMode ? (
            <div>
              <Title level={4}>Search &amp; Filter Tasks</Title>
              <Space
                direction="vertical"
                style={{ width: "100%", marginBottom: 20 }}
                size="middle"
              >
                <Search
                  placeholder="Search by title or description..."
                  allowClear
                  size="large"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ maxWidth: 600 }}
                />
                <Space wrap>
                  <RangePicker
                    onChange={(dates) => setDateRange(dates)}
                    value={dateRange}
                    allowClear
                  />
                  <Badge count={searchResults.length} overflowCount={999}>
                    <Tag color="blue" style={{ padding: "4px 12px", fontSize: 14 }}>
                      {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
                    </Tag>
                  </Badge>
                </Space>
              </Space>

              {searchResults.length > 0 ? (
                <List
                  bordered
                  dataSource={searchResults}
                  renderItem={renderTaskItem}
                />
              ) : (
                <Empty description="No matching tasks found" />
              )}
            </div>
          ) : (
            <div>
              <Calendar
                fullscreen={false}
                onSelect={(date) => setSelectedDate(date)}
                cellRender={(current, info) => {
                  if (info.type === "date") return dateCellRender(current);
                  return info.originNode;
                }}
              />

              <Title level={4} style={{ marginTop: 20 }}>
                Tasks for {selectedDate.format("DD MMM YYYY")}
              </Title>

              {filteredTasks.length > 0 ? (
                <List
                  bordered
                  dataSource={filteredTasks}
                  renderItem={renderTaskItem}
                />
              ) : (
                <Empty description="No tasks" />
              )}
            </div>
          )}
        </Content>
      </Layout>

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
            recurrence: isEditing ? formData.recurrence || "none" : "none",
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

              {!isEditing && (
                <>
                  <label>Recurrence</label>
                  <Select
                    value={values.recurrence}
                    onChange={(value) => setFieldValue("recurrence", value)}
                    style={{ width: "100%", marginBottom: 10 }}
                  >
                    {recurrenceOptions.map((opt) => (
                      <Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Option>
                    ))}
                  </Select>
                </>
              )}

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
