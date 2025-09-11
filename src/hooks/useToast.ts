import { toast } from "react-toastify";

const UseToast = (
  message: string | null | undefined,
  type: "error" | "warning" | "success" = "success"
) => {
  toast[type](message, {
    position: "top-right",
    theme: "colored",
    style: {
      zIndex: 100000,
      backgroundColor:
        type === "success" ? "#0066FF" : type === "error" ? "#af180d" : "",
    },
    autoClose: 5000,
    hideProgressBar: false,
    closeButton: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    className: "gradient",
  });
};

export default UseToast;
