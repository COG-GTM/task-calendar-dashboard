import React, { useState } from "react";
import { Calendar, Typography, Button, List, Empty, Tag, Tooltip } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { deleteTask } from "../redux/tasksSlice";
import dayjs from "dayjs";
import TaskModal from "../components/TaskModal";
import { categories } from "../utils/constants";

const { Title } = Typography;

export default function CalendarView() {
  const tasks = useSelector((state) => state.tasks);
  const dispatch = useDispatch();
  
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [editId, setEditId] = useState(null);

  const filteredTasks = tasks.filter(
    (t) => t.date === selectedDate.format("YYYY-MM-DD")
  );

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
              ●
            </Tag>
          </Tooltip>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <Title level={2}>Calendar View</Title>
        <Button type="primary" onClick={() => openAddModal(selectedDate)}>
          Add Task
        </Button>
      </div>

      <Calendar
        fullscreen={false}
        onSelect={(date) => setSelectedDate(date)}
        dateCellRender={dateCellRender}
      />

      <Title level={4} style={{ marginTop: 20 }}>
        Tasks for {selectedDate.format("DD MMM YYYY")}
      </Title>

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
              <div>
                <strong>{item.title}</strong>
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

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isEditing={isEditing}
        formData={formData}
        editId={editId}
        selectedDate={selectedDate}
      />
    </div>
  );
}
