import React from "react";
import { Modal, Input, Select, DatePicker, Button } from "antd";
import { useDispatch } from "react-redux";
import { addTask, editTask } from "../redux/tasksSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import dayjs from "dayjs";
import { categories, validationSchema } from "../utils/constants";

const { Option } = Select;

export default function TaskModal({ 
  isOpen, 
  onClose, 
  isEditing, 
  formData, 
  editId, 
  selectedDate 
}) {
  const dispatch = useDispatch();
  
  return (
    <Modal
      title={isEditing ? "Edit Task" : "Add Task"}
      open={isOpen}
      onCancel={onClose}
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
          onClose();
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
  );
}
