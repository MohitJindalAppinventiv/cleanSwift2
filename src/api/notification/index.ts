import { axiosInstance } from "../axios/axiosInstance";

export const sendTopicNotification = async (payload: {
  topic: string;
  title: string;
  body: string;
  data?: Record<string, any>;
  imageUrl?: string;
}) => {
  const { data } = await axiosInstance.post("/sendTopicNotification", payload);
  return data;
};

export const sendTestNotification = async (payload: {
  userId: string;
  title?: string;
  body?: string;
  data?: Record<string, any>;
  imageUrl?: string;
}) => {
  const { data } = await axiosInstance.post("/sendTestNotification", payload);
  return data;
};
