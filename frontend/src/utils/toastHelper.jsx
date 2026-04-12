import { toast } from "react-toastify";
import CustomToast from "../components/CustomToast";

export const showToast = ({
  message,
  duration = 3000,
  position = "top-right",
  status = "default",
}) => {
  return toast(
    <CustomToast status={status} message={message} duration={duration} />,
    {
      autoClose: duration,
      position,
      className: "bg-transparent shadow-none p-0",
      bodyClassName: "p-0",
      hideProgressBar: true,
      transition: null,
    }
  );
};