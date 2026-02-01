export function exportToCSV(data: any[], filename: string) {
    if (data.length === 0) return;

    // Get headers from first object
    const headers = Object.keys(data[0]).join(",");

    // Map rows carefully to handle commas in data
    const rows = data.map(obj =>
        Object.keys(data[0]).map(key => {
            const val = obj[key] === null || obj[key] === undefined ? '' : obj[key];
            return `"${String(val).replace(/"/g, '""')}"`;
        }).join(",")
    ).join("\n");

    const csvContent = headers + "\n" + rows;
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
