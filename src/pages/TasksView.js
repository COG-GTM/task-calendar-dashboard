import React, { useState } from "react";
import { Typography, Button, List, Empty, Input, Select, Space, Card, Tag } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { deleteTask } from "../redux/tasksSlice";
import { SearchOutlined } from "@ant-design/icons";
import TaskModal from "../components/TaskModal";
import { categories } from "../utils/constants";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;

export default function TasksView() {
  const tasks = useSelector((state) => state.tasks);
  const dispatch = useDispatch();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [editId, setEditId] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [sortBy, setSortBy] = useState("date");

  const openAddModal = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      date: dayjs().format("YYYY-MM-DD"),
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

  let filteredTasks = tasks.filter(task => {
    const matchesSearch = !searchText || 
      task.title.toLowerCase().includes(searchText.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchText.toLowerCase()));
    
    const matchesCategory = !categoryFilter || task.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  if (sortBy === "date") {
    filteredTasks.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortBy === "title") {
    filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy === "category") {
    filteredTasks.sort((a, b) => a.category.localeCompare(b.category));
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <Title level={2}>All Tasks</Title>
        <Button type="primary" onClick={openAddModal}>
          Add New Task
        </Button>
      </div>

      <Card style={{ marginBottom: 20 }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <Input
              placeholder="Search tasks..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 300 }}
            />
            
            <Select
              placeholder="Filter by category"
              value={categoryFilter}
              onChange={setCategoryFilter}
              allowClear
              style={{ width: 200 }}
            >
              {Object.keys(categories).map((cat) => (
                <Option key={cat} value={cat}>
                  {cat}
                </Option>
              ))}
            </Select>
            
            <Select
              value={sortBy}
              onChange={setSortBy}
              style={{ width: 150 }}
            >
              <Option value="date">Sort by Date</Option>
              <Option value="title">Sort by Title</Option>
              <Option value="category">Sort by Category</Option>
            </Select>
          </div>
          
          <div>
            <strong>Total: {filteredTasks.length} tasks</strong>
          </div>
        </Space>
      </Card>

      {filteredTasks.length > 0 ? (
        <List
          bordered
          dataSource={filteredTasks}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button type="link" onClick={() => openEditModal(item)}>
                  Edit
                </Button>,
                <Button
                  type="link"
                  danger
                  onClick={() => dispatch(deleteTask(item.id))}
                >
                  Delete
                </Button>,
              ]}
            >
              <div style={{ width: "100%" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <strong style={{ fontSize: "16px" }}>{item.title}</strong>
                    {item.description && (
                      <div style={{ marginTop: 4, color: "#666" }}>
                        {item.description}
                      </div>
                    )}
                    <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
                      <Tag color={categories[item.category] || "default"}>
                        {item.category}
                      </Tag>
                      <span style={{ color: "#999", fontSize: "14px" }}>
                        {dayjs(item.date).format("MMM DD, YYYY")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </List.Item>
          )}
        />
      ) : (
        <Empty 
          description={
            searchText || categoryFilter 
              ? "No tasks match your filters" 
              : "No tasks found"
          } 
        />
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditing={isEditing}
        formData={formData}
        editId={editId}
        selectedDate={dayjs()}
      />
    </div>
  );
}
