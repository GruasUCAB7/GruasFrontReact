import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateToken } from "../services/tokenService";

const useAuthValidation = () => {
  const [operatorId, setOperatorId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenPayload = validateToken(navigate);
    if (tokenPayload) {
      setOperatorId(tokenPayload.sub);
      setUserRole(tokenPayload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
    }
  }, [navigate]);

  return { operatorId, userRole };
};

export default useAuthValidation;
