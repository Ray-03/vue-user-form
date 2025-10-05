import type { User } from "../stores/UserStore";

export function useExportCSV() {
  const exportToCSV = (users: User[]) => {
    if (users.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = [
      "Name",
      "Email",
      "Date of Birth",
      "Gender",
      "Created At",
      "Updated At",
    ];

    const rows = users.map((user) => {
      const dob = user.dob?.toDate
        ? new Date(user.dob.toDate()).toLocaleDateString()
        : "";
      const createdAt = user.createdAt?.toDate
        ? new Date(user.createdAt.toDate()).toLocaleString()
        : "";
      const updatedAt = user.updatedAt?.toDate
        ? new Date(user.updatedAt.toDate()).toLocaleString()
        : "";

      return [
        user.name,
        user.email,
        dob,
        user.gender || "",
        createdAt,
        updatedAt,
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `users_export_${new Date().toISOString().split("T")[0]}.csv`
    );
    link.style.visibility = "hidden";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`Exported ${users.length} users to CSV`);
  };

  return {
    exportToCSV,
  };
}
