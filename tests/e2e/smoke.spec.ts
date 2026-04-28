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

test("AI receptionist recognizes window cleaning and Xian addresses", async ({
  page,
}) => {
  await page.goto("/chat/demo-web-chat");

  await page.getByLabel("输入消息").fill("擦窗户");
  await page.getByRole("button", { name: "发送消息" }).click();
  await expect(page.getByText("联系电话")).toBeVisible();
  await expect(page.getByText("服务地址")).toBeVisible();
  await expect(page.getByText("期望时间")).toBeVisible();

  await page.getByLabel("输入消息").fill("13572045112");
  await page.getByRole("button", { name: "发送消息" }).click();

  await page.getByLabel("输入消息").fill("西安市，明天");
  await page.getByRole("button", { name: "发送消息" }).click();

  await page.getByLabel("输入消息").fill("西安市富力城北区6号103");
  await page.getByRole("button", { name: "发送消息" }).click();

  await expect(page.getByText("信息已收齐")).toBeVisible();

  await page.goto("/bookings");
  await expect(page.getByText("擦窗户").first()).toBeVisible();
  await expect(page.getByText("13572045112").first()).toBeVisible();
  await expect(page.getByText("西安市富力城北区6号103").first()).toBeVisible();
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

test("admin can maintain business profile records", async ({ page }) => {
  await page.goto("/business-profile");

  await expect(page.getByRole("heading", { name: "业务资料" })).toBeVisible();

  await page.getByLabel("营业时间").fill("周一至周日 08:30-21:00");
  await page.getByRole("button", { name: "保存业务资料" }).click();
  await expect(page.getByLabel("营业时间")).toHaveValue("周一至周日 08:30-21:00");

  await page.getByPlaceholder("服务名称").fill("开荒保洁");
  await page.getByPlaceholder("服务说明").fill("适合装修后首次全屋清洁。");
  await page.getByPlaceholder("时长分钟").fill("480");
  await page.getByPlaceholder("价格说明").fill("按面积和污染程度确认。");
  await page.getByRole("button", { name: "添加服务" }).click();
  await expect(page.getByText("开荒保洁")).toBeVisible();

  await page.getByPlaceholder("区域名称").fill("长宁区");
  await page.getByPlaceholder("匹配值").fill("长宁");
  await page.getByRole("button", { name: "添加区域" }).click();
  await expect(page.getByText("长宁区")).toBeVisible();

  await page.getByPlaceholder("问题").fill("宠物毛发清洁是否加价？");
  await page
    .getByRole("textbox", { name: "答案", exact: true })
    .fill("可能加价，需根据现场情况由人工确认。");
  await page.getByRole("button", { name: "添加 FAQ" }).click();
  await expect(page.getByText("宠物毛发清洁是否加价？")).toBeVisible();
});

test("admin can handoff, resume AI, update settings, and cancel bookings", async ({
  page,
}) => {
  await page.goto("/inbox?id=demo-conversation-001");
  await page.getByRole("button", { name: "人工接管" }).click();
  await expect(page.getByText("人工手动接管")).toBeVisible();
  await expect(page.getByText("AI 已暂停")).toBeVisible();

  await page.getByRole("button", { name: "恢复 AI" }).click();
  await expect(page.getByText("AI 运行中")).toBeVisible();

  await page.goto("/settings");
  await page.getByLabel("名称").fill("新版 AI 接待员");
  await page.getByRole("button", { name: "保存 AI 设置" }).click();
  await expect(page.getByLabel("名称")).toHaveValue("新版 AI 接待员");

  await page.goto("/bookings");
  await page.getByRole("button", { name: "取消" }).first().click();
  await expect(page.getByText("已取消").first()).toBeVisible();
});
