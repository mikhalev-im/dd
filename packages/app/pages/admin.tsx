import dynamic from "next/dynamic";
const AdminPanel = dynamic(() => import("../modules/admin"), { ssr: false });

const AdminPage = () => {
  return <AdminPanel />;
};

export default AdminPage;
