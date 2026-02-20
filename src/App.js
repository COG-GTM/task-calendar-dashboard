import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  Badge,
  Divider,
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

function generateRecurringInstances(task, rangeStart, rangeEnd) {
  if (!task.recurrence || task.recurrence === "none") return [];
  const instances = [];
  const start = dayjs(task.date);
  const end = rangeEnd || dayjs().add(3, "month");
  const begin = rangeStart || dayjs().subtract(1, "month");
  let current = start;
  const incrementMap = { daily: "day", weekly: "week", monthly: "month" };
  const unit = incrementMap[task.recurrence];
  if (!unit) return [];
  current = current.add(1, unit);
  while (current.isBefore(end) || current.isSame(end, "day")) {
    if (current.isAfter(begin) || current.isSame(begin, "day")) {
      instances.push({
        ...task,
        id: `${task.id}_rec_${current.format("YYYY-MM-DD")}`,
        date: current.format("YYYY-MM-DD"),
        recurrenceGroupId: task.id,
        isRecurringInstance: true,
      });
    }
    current = current.add(1, unit);
  }
  return instances;
}

function exportTasksToCSV(tasksToExport) {
  const headers = ["Title", "Description", "Category", "Date", "Recurrence"];
  const rows = tasksToExport.map((t) => [
    `"${(t.title || "").replace(/"/g, '""')}"`,
    `"${(t.description || "").replace(/"/g, '""')}"`,
    t.category || "",
    t.date || "",
    t.recurrence || "none",
  ]);
  const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `tasks_export_${dayjs().format("YYYY-MM-DD")}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export default function App() {
  const tasks = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [editId, setEditId] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [dateRange, setDateRange] = useState(null);

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

  const allTasksWithRecurring = useMemo(() => {
    const rangeStart = dayjs().subtract(2, "month");
    const rangeEnd = dayjs().add(3, "month");
    const recurring = tasks.flatMap((t) =>
      generateRecurringInstances(t, rangeStart, rangeEnd)
    );
    return [...tasks, ...recurring];
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return allTasksWithRecurring.filter((t) => {
      const matchesDate = t.date === selectedDate.format("YYYY-MM-DD");
      const matchesSearch =
        !searchText ||
        (t.title || "").toLowerCase().includes(searchText.toLowerCase()) ||
        (t.description || "").toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(t.category);
      return matchesDate && matchesSearch && matchesCategory;
    });
  }, [allTasksWithRecurring, selectedDate, searchText, selectedCategories]);

  const globalFilteredTasks = useMemo(() => {
    return allTasksWithRecurring.filter((t) => {
      const matchesSearch =
        !searchText ||
        (t.title || "").toLowerCase().includes(searchText.toLowerCase()) ||
        (t.description || "").toLowerCase().includes(searchText.toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(t.category);
      const matchesDateRange =
        !dateRange ||
        dayjs(t.date).isBetween(dateRange[0], dateRange[1], "day", "[]");
      return matchesSearch && matchesCategory && matchesDateRange;
    });
  }, [allTasksWithRecurring, searchText, selectedCategories, dateRange]);

  const chartData = Object.keys(categories).map((cat) => ({
    name: cat,
    value: globalFilteredTasks.filter((t) => t.category === cat).length,
  }));
  const COLORS = Object.values(categories);

  const openAddModal = useCallback(
    (date = selectedDate) => {
      setFormData({
        title: "",
        description: "",
        category: "",
        date: date.format("YYYY-MM-DD"),
        recurrence: "none",
      });
      setIsEditing(false);
      setIsModalOpen(true);
    },
    [selectedDate]
  );

  const openEditModal = useCallback((task) => {
    setFormData(task);
    setEditId(task.id);
    setIsEditing(true);
    setIsModalOpen(true);
  }, []);

  const handleDeleteTask = useCallback(
    (task) => {
      if (task.recurrence && task.recurrence !== "none") {
        Modal.confirm({
          title: "Delete Recurring Task",
          content: "Delete this instance only or the entire series?",
          okText: "Delete Series",
          cancelText: "This Instance Only",
          onOk: () => {
            const groupId = task.recurrenceGroupId || task.id;
            dispatch(deleteRecurringSeries(groupId));
          },
          onCancel: () => {
            if (!task.isRecurringInstance) {
              dispatch(deleteTask(task.id));
            }
          },
        });
      } else {
        dispatch(deleteTask(task.id));
      }
    },
    [dispatch]
  );

  const resetFilters = useCallback(() => {
    setSearchText("");
    setSelectedCategories([]);
    setDateRange(null);
  }, []);

  const dateCellRender = useCallback(
    (value) => {
      const dateStr = value.format("YYYY-MM-DD");
      const dayTasks = allTasksWithRecurring.filter(
        (t) => t.date === dateStr
      );
      return (
        <div>
          {dayTasks.slice(0, 3).map((task) => (
            <Tooltip
              key={task.id}
              title={`${task.title}${
                task.description ? `: ${task.description}` : ""
              }${
                task.recurrence && task.recurrence !== "none"
                  ? ` (${task.recurrence})`
                  : ""
              }`}
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
                {task.recurrence && task.recurrence !== "none" ? "\u21BB" : "\u25CF"}
              </Tag>
            </Tooltip>
          ))}
          {dayTasks.length > 3 && (
            <Text type="secondary" style={{ fontSize: 10 }}>
              +{dayTasks.length - 3} more
            </Text>
          )}
        </div>
      );
    },
    [allTasksWithRecurring]
  );

  const hasActiveFilters =
    searchText || selectedCategories.length > 0 || dateRange;

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider theme="light" width={300} style={{ padding: 20 }}>
        <Title level={4}>Search &amp; Filter</Title>

        <Search
          placeholder="Search tasks..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
          style={{ marginBottom: 12 }}
          aria-label="Search tasks by title or description"
        />

        <Text strong style={{ display: "block", marginBottom: 4 }}>
          Categories
        </Text>
        <Select
          mode="multiple"
          placeholder="Filter by categories"
          value={selectedCategories}
          onChange={(val) => setSelectedCategories(val)}
          allowClear
          style={{ width: "100%", marginBottom: 12 }}
          aria-label="Filter by category"
        >
          {Object.keys(categories).map((cat) => (
            <Option key={cat} value={cat}>
              {cat}
            </Option>
          ))}
        </Select>

        <Text strong style={{ display: "block", marginBottom: 4 }}>
          Date Range
        </Text>
        <RangePicker
          value={dateRange}
          onChange={(dates) => setDateRange(dates)}
          style={{ width: "100%", marginBottom: 12 }}
          aria-label="Filter by date range"
        />

        <Space style={{ marginBottom: 12 }}>
          <Button onClick={resetFilters} disabled={!hasActiveFilters}>
            Reset Filters
          </Button>
        </Space>

        {hasActiveFilters && (
          <div style={{ marginBottom: 12 }}>
            <Badge
              count={globalFilteredTasks.length}
              showZero
              style={{ backgroundColor: "#1677ff" }}
            />
            <Text style={{ marginLeft: 8 }}>matching tasks</Text>
          </div>
        )}

        <Divider />

        <Title level={5}>Task Distribution</Title>
        <PieChart width={250} height={250}>
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
              onClick={() => exportTasksToCSV(globalFilteredTasks)}
              disabled={globalFilteredTasks.length === 0}
              aria-label="Export tasks to CSV"
            >
              Export CSV
            </Button>
            <Button type="primary" onClick={() => openAddModal(selectedDate)}>
              Add Task
            </Button>
          </Space>
        </Header>

        <Content style={{ padding: 20 }}>
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
            {filteredTasks.length > 0 && (
              <Badge
                count={filteredTasks.length}
                style={{ backgroundColor: "#1677ff", marginLeft: 8 }}
              />
            )}
          </Title>

          {filteredTasks.length > 0 ? (
            <List
              bordered
              dataSource={filteredTasks}
              renderItem={(item) => (
                <List.Item
                  actions={[
                    !item.isRecurringInstance && (
                      <Button
                        type="link"
                        onClick={() => openEditModal(item)}
                        key="edit"
                      >
                        Edit
                      </Button>
                    ),
                    <Button
                      type="link"
                      danger
                      onClick={() => handleDeleteTask(item)}
                      key="delete"
                    >
                      Delete
                    </Button>,
                  ].filter(Boolean)}
                >
                  <div>
                    <Space>
                      <strong>{item.title}</strong>
                      {item.recurrence && item.recurrence !== "none" && (
                        <Tag color="purple">{item.recurrence}</Tag>
                      )}
                      {item.isRecurringInstance && (
                        <Tag color="geekblue">instance</Tag>
                      )}
                    </Space>
                    {item.description && <div>{item.description}</div>}
                    {item.category && (
                      <div style={{ color: categories[item.category] }}>
                        {item.category}
                      </div>
                    )}
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <Empty description="No tasks" />
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
              <label htmlFor="task-title">Title</label>
              <Field
                id="task-title"
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

              <label htmlFor="task-description">Description</label>
              <Field
                id="task-description"
                name="description"
                as={Input.TextArea}
                style={{ marginBottom: 10 }}
                placeholder="Enter description"
              />

              <label htmlFor="task-category">Category</label>
              <Select
                id="task-category"
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

              <label htmlFor="task-date">Date</label>
              <DatePicker
                id="task-date"
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

              <label htmlFor="task-recurrence">Recurrence</label>
              <Select
                id="task-recurrence"
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
