import React from "react";
import { Menu, Typography } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { CalendarOutlined, BarChartOutlined, UnorderedListOutlined, SettingOutlined } from "@ant-design/icons";
import { ROUTES } from "../constants/routes";

const { Title } = Typography;

export default function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: ROUTES.CALENDAR, icon: <CalendarOutlined />, label: "Calendar" },
    { key: ROUTES.ANALYTICS, icon: <BarChartOutlined />, label: "Analytics" },
    { key: ROUTES.TASKS, icon: <UnorderedListOutlined />, label: "Tasks" },
    { key: ROUTES.SETTINGS, icon: <SettingOutlined />, label: "Settings" },
  ];

  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
      <Title level={3} style={{ margin: 0, color: "#000" }}>
        Task Calendar Dashboard
      </Title>
      <Menu
        mode="horizontal"
        selectedKeys={[location.pathname]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{ border: "none", backgroundColor: "transparent" }}
      />
    </div>
  );
}
