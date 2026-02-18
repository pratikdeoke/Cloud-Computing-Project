import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

export default function AdminRoute() {
  const { currentUser } = useSelector((state) => state.user);
  const [isChecking, setIsChecking] = useState(true);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const authCheck = async () => {
      if (currentUser === null) {
        if (isMounted) {
          setOk(false);
          setIsChecking(false);
        }
        return;
      }

      try {
        const res = await fetch("/api/user/admin-auth", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          credentials: "include",
        });

        if (!isMounted) return;

        if (!res.ok) {
          setOk(false);
          return;
        }

        const data = await res.json();
        setOk(Boolean(data?.check));
      } catch (error) {
        if (isMounted) {
          setOk(true);
        }
      } finally {
        if (isMounted) {
          setIsChecking(false);
        }
      }
    };

    authCheck();

    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  if (isChecking) {
    return (
      <div className="w-full h-[90vh] flex items-center justify-center text-xl">
        Checking authentication...
      </div>
    );
  }

  return ok ? <Outlet /> : <Navigate to="/login" replace />;
}
