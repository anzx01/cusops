import { expect, test } from "@playwright/test";

test("AI receptionist handles a web chat request and creates a booking", async ({
  page,
}) => {
  await page.goto("/chat/demo-web-chat");

  await expect(page.getByText("安心家政清洁")).toBeVisible();
  await expect(page.getByText("请问您想预约哪类清洁服务")).toBeVisible();

  await page
    .getByLabel("输入消息")
    .fill("我想预约深度清洁，明天下午，上海市徐汇区漕溪北路，电话 13900001111");
  await page.getByRole("button", { name: "发送消息" }).click();

  await expect(page.getByText("信息已收齐")).toBeVisible();

  await page.goto("/bookings");
  await expect(page.getByRole("heading", { name: "预约" })).toBeVisible();
  await expect(page.getByText("深度清洁").first()).toBeVisible();
  await expect(page.getByText("13900001111").first()).toBeVisible();
  await expect(page.getByText("local-").first()).toBeVisible();

  await page.goto("/inbox");
  await expect(page.getByRole("heading", { name: "对话", exact: true })).toBeVisible();
  await expect(page.getByText("13900001111").first()).toBeVisible();
  await expect(page.getByText("已由 AI 创建预约").first()).toBeVisible();

  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "工作台" })).toBeVisible();
  await expect(page.getByText("预计新增收入")).toBeVisible();
});

test("AI receptionist forces handoff for risky customer messages", async ({
  page,
}) => {
  await page.goto("/chat/demo-web-chat");
  await page.getByLabel("输入消息").fill("我要投诉并退款，请人工处理");
  await page.getByRole("button", { name: "发送消息" }).click();

  await expect(page.getByText("转接人工处理")).toBeVisible();

  await page.goto("/inbox");
  await expect(page.getByText("命中高风险词").first()).toBeVisible();
});
