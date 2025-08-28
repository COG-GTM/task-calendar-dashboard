import * as Yup from "yup";

export const categories = {
  success: "green",
  warning: "orange",
  issue: "red",
  info: "blue",
};

export const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  category: Yup.string().required("Category is required"),
  date: Yup.string().required("Date is required"),
});
