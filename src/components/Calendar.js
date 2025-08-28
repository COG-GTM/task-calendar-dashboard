import React from "react";
import { Calendar as AntCalendar, Typography, List, Empty, Button, Tag, Tooltip } from "antd";
import { useSelector } from "react-redux";

const { Title } = Typography;

const categories = {
  success: "green",
  warning: "orange",
  issue: "red",
  info: "blue",
};

export default function Calendar({ 
  selectedDate, 
  onDateSelect, 
  appliedFilter,
  onEditTask,
  onDeleteTask 
}) {
  const tasks = useSelector((state) => state.tasks);

  const filteredTasks = tasks.filter(
    (t) =>
      t.date === selectedDate.format("YYYY-MM-DD") &&
      (!appliedFilter || t.category === appliedFilter)
  );

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
    <>
      <AntCalendar
        fullscreen={false}
        onSelect={onDateSelect}
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
                <Button type="link" onClick={() => onEditTask(item)}>
                  Edit
                </Button>,
                <Button
                  type="link"
                  danger
                  onClick={() => onDeleteTask(item.id)}
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
    </>
  );
}
