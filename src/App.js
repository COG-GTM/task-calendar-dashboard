import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { setTasks } from "./redux/tasksSlice";
import { nanoid } from "@reduxjs/toolkit";
import Navigation from "./components/Navigation";
import CalendarView from "./pages/CalendarView";
import AnalyticsView from "./pages/AnalyticsView";
import TasksView from "./pages/TasksView";
import SettingsView from "./pages/SettingsView";
import { ROUTES } from "./constants/routes";

const { Header, Content } = Layout;

export default function App() {
  const tasks = useSelector((state) => state.tasks);
  const dispatch = useDispatch();

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

  return (
    <BrowserRouter>
      <Layout style={{ minHeight: "100vh" }}>
        <Header style={{ background: "#fff", padding: "10px 20px" }}>
          <Navigation />
        </Header>
        <Content style={{ padding: 20 }}>
          <Routes>
            <Route path={ROUTES.CALENDAR} element={<CalendarView />} />
            <Route path={ROUTES.ANALYTICS} element={<AnalyticsView />} />
            <Route path={ROUTES.TASKS} element={<TasksView />} />
            <Route path={ROUTES.SETTINGS} element={<SettingsView />} />
            <Route path="/" element={<CalendarView />} />
          </Routes>
        </Content>
      </Layout>
    </BrowserRouter>
  );
}
