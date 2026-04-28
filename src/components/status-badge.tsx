const statusMap: Record<string, { label: string; className: string }> = {
  new: { label: "新对话", className: "badge-blue" },
  booked: { label: "已预约", className: "badge-green" },
  handoff: { label: "转人工", className: "badge-amber" },
  closed: { label: "已关闭", className: "badge-gray" },
  confirmed: { label: "已确认", className: "badge-green" },
  cancelled: { label: "已取消", className: "badge-red" },
  qualified: { label: "合格", className: "badge-green" },
  unqualified: { label: "无效", className: "badge-red" },
};

export function StatusBadge({ status }: { status: string }) {
  const item = statusMap[status] ?? { label: status, className: "badge-gray" };

  return <span className={`badge ${item.className}`}>{item.label}</span>;
}
