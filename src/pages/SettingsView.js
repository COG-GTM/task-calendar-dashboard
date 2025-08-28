import React, { useState } from "react";
import { Typography, Card, Switch, Select, Button, Space, Divider, message } from "antd";

const { Title } = Typography;
const { Option } = Select;

export default function SettingsView() {
  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [defaultView, setDefaultView] = useState("calendar");
  const [dateFormat, setDateFormat] = useState("DD MMM YYYY");

  const handleSaveSettings = () => {
    const settings = {
      theme,
      notifications,
      autoSave,
      defaultView,
      dateFormat,
    };
    
    localStorage.setItem("appSettings", JSON.stringify(settings));
    message.success("Settings saved successfully!");
  };

  const handleResetSettings = () => {
    setTheme("light");
    setNotifications(true);
    setAutoSave(true);
    setDefaultView("calendar");
    setDateFormat("DD MMM YYYY");
    
    localStorage.removeItem("appSettings");
    message.info("Settings reset to defaults");
  };

  return (
    <div>
      <Title level={2}>Settings</Title>
      
      <Card title="Appearance" style={{ marginBottom: 20 }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Theme</span>
            <Select
              value={theme}
              onChange={setTheme}
              style={{ width: 120 }}
            >
              <Option value="light">Light</Option>
              <Option value="dark">Dark</Option>
              <Option value="auto">Auto</Option>
            </Select>
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Date Format</span>
            <Select
              value={dateFormat}
              onChange={setDateFormat}
              style={{ width: 150 }}
            >
              <Option value="DD MMM YYYY">DD MMM YYYY</Option>
              <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
              <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
              <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
            </Select>
          </div>
        </Space>
      </Card>

      <Card title="Behavior" style={{ marginBottom: 20 }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Default View</span>
            <Select
              value={defaultView}
              onChange={setDefaultView}
              style={{ width: 120 }}
            >
              <Option value="calendar">Calendar</Option>
              <Option value="tasks">Tasks</Option>
              <Option value="analytics">Analytics</Option>
            </Select>
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Auto-save Changes</span>
            <Switch
              checked={autoSave}
              onChange={setAutoSave}
            />
          </div>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Enable Notifications</span>
            <Switch
              checked={notifications}
              onChange={setNotifications}
            />
          </div>
        </Space>
      </Card>

      <Card title="Data Management" style={{ marginBottom: 20 }}>
        <Space direction="vertical" style={{ width: "100%" }}>
          <div>
            <Title level={5}>Local Storage</Title>
            <p style={{ color: "#666", marginBottom: 16 }}>
              Your tasks are automatically saved to your browser's local storage. 
              This data persists between sessions but is specific to this browser.
            </p>
            <Space>
              <Button 
                type="primary" 
                onClick={() => {
                  const tasks = localStorage.getItem("tasks");
                  if (tasks) {
                    const blob = new Blob([tasks], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "tasks-backup.json";
                    a.click();
                    URL.revokeObjectURL(url);
                    message.success("Tasks exported successfully!");
                  } else {
                    message.warning("No tasks to export");
                  }
                }}
              >
                Export Tasks
              </Button>
              <Button 
                danger
                onClick={() => {
                  if (window.confirm("Are you sure you want to clear all tasks? This cannot be undone.")) {
                    localStorage.removeItem("tasks");
                    window.location.reload();
                  }
                }}
              >
                Clear All Tasks
              </Button>
            </Space>
          </div>
        </Space>
      </Card>

      <Divider />
      
      <Space>
        <Button type="primary" onClick={handleSaveSettings}>
          Save Settings
        </Button>
        <Button onClick={handleResetSettings}>
          Reset to Defaults
        </Button>
      </Space>
    </div>
  );
}
