import AdminLayout from "@/Layouts/AdminLayout.jsx";

export default function Dashboard({ auth }) {
    return (
        <AdminLayout user={auth.user}>
            <h1>Dashboard</h1>
        </AdminLayout>
    );
}
