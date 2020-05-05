import { toast } from "react-toastify";

export default function alertErrors(type) {
  switch (type) {
    case "auth/wrong-password":
      toast.warn("la contraseña no es correcta");
      break;
    case "auth/email-already-in-use":
      toast.warn("Email en uso");
      break;
    default:
      toast.warn("Error del servidor");
      break;
  }
}
