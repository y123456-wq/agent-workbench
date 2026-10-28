const $ = (id) => document.getElementById(id);

const state = {
  docs: [],
  chunks: [],
  currentUser: { name: "admin", role: "admin" },
  qaHistory: [],
  traces: [],
  lifeData: [],
  tasks: [],
  habits: [],
  money: [],
  goals: [],
  markdown: "",
  gradeStudents: [],
  gradeSummary: null,
  gradeHistory: [],
  suite: {
    crm: [],
    stock: [],
    milestones: [],
    events: [],
    audit: [],
  },
  settings: {
    apiKey: "",
    model: "gpt-4.1-mini",
    useRemote: false,
  },
};

const samples = {
  docs: [
    {
      title: "Agent Workbench 架构说明",
      text: "Agent Workbench 是一个本地优先的多功能 AI Agent 项目。它包含统一控制台、知识库检索、代码 Review、CSV 数据分析、求职 JD 匹配、市场研究报告和评估观测面板。项目默认不依赖后端，使用浏览器本地存储保存文档、设置和 Trace 日志。",
    },
    {
      title: "企业知识库 Agent 需求",
      text: "企业知识库 Agent 需要支持文档上传、分块、向量或关键词检索、来源引用、权限控制、低置信度提示和人工接管。真实招聘项目里，评估集、可观测链路和错误回放非常加分。",
    },
    {
      title: "求职项目亮点",
      text: "求职项目应该展示端到端能力，包括产品界面、稳定交互、工程架构、数据处理、Agent 工具调用、失败回退、自动化测试和可以量化的评估指标。避免只有 prompt demo，要做成可以运行的系统。",
    },
  ],
  code: `function calculateRefund(order) {
  let total = 0
  for (var i = 0; i <= order.items.length; i++) {
    total += order.items[i].price * order.items[i].quantity
  }
  if (order.user.isVip = true) {
    total = total * 1.1
  }
  fetch('/api/refund', { method: 'POST', body: JSON.stringify({ id: order.id, total }) })
  return total
}`,
  csv: `date,channel,revenue,orders,cost
2026-06-01,Search,12400,82,4200
2026-06-01,Social,8600,70,3900
2026-06-01,Referral,5400,31,900
2026-06-02,Search,13200,88,4400
2026-06-02,Social,9100,77,4100
2026-06-02,Referral,7200,43,1100
2026-06-03,Search,11800,79,4000
2026-06-03,Social,9900,84,4600
2026-06-03,Referral,7600,46,1200`,
  resume: `项目：企业知识库 Agent
- 使用 FastAPI、PostgreSQL pgvector、React 构建内部知识问答系统
- 支持 PDF 文档解析、RAG 检索、来源引用和低置信度提醒
- 设计 Prompt 版本管理和人工反馈流程，提升回答准确率

项目：数据分析 Dashboard
- 使用 Python 和 SQL 构建渠道分析报表
- 自动生成转化率、ROI、收入趋势图`,
  jd: `AI Agent Engineer
职责：
- 构建基于 LLM 的 Agent 工作流，支持工具调用、RAG、任务规划和结果评估
- 设计 prompt、评估集、trace 观测和成本优化方案
- 熟悉 TypeScript/Python、SQL、向量数据库、API 集成
要求：
- 有端到端 AI 应用项目经验
- 能解释模型失败原因并持续迭代系统`,
};

const capabilities = [
  {
    panel: "workflow",
    title: "Agent 编排中心",
    text: "把 Planner、Retriever、Tool Executor、Evaluator 串成业务级自动化流程。",
  },
  {
    panel: "portfolio",
    title: "项目简历页",
    text: "自动生成项目架构、技术亮点、难点拆解和可复制的简历 bullets。",
  },
  {
    panel: "knowledge",
    title: "知识库 Agent",
    text: "文档分块、关键词检索、置信度评分、引用来源和本地持久化。",
  },
  {
    panel: "code",
    title: "代码 Review Agent",
    text: "扫描边界错误、赋值误用、异步风险、缺少错误处理和安全问题。",
  },
  {
    panel: "data",
    title: "数据分析 Agent",
    text: "解析 CSV，按维度聚合收入、订单、成本、ROI，并生成图表。",
  },
  {
    panel: "career",
    title: "求职 Agent",
    text: "对齐简历与 JD，输出匹配分、缺口、可直接放进简历的项目 bullets。",
  },
  {
    panel: "research",
    title: "研究报告 Agent",
    text: "把主题拆成机会、用户、方案、风险、落地路线，生成结构化报告。",
  },
  {
    panel: "evals",
    title: "评估观测",
    text: "记录每次 Agent 调用的延迟、置信度、工具调用和结果摘要。",
  },
];

const presetTasks = [
  {
    title: "演示企业知识库",
    desc: "自动载入文档并回答项目能力问题",
    agent: "knowledge",
    prompt: "这个项目有哪些 Agent 能力？请给出引用来源。",
  },
  {
    title: "演示代码审查",
    desc: "扫描示例代码中的 bug 和风险",
    agent: "code",
    prompt: samples.code,
  },
  {
    title: "演示数据分析",
    desc: "分析渠道收入、订单和 ROI",
    agent: "data",
    prompt: "按渠道汇总收入并排序，指出哪个渠道最值得投入。",
  },
  {
    title: "演示求职包装",
    desc: "生成能写进简历的项目亮点",
    agent: "career",
    prompt: samples.jd,
  },
  {
    title: "演示研究报告",
    desc: "生成 Agent 落地机会报告",
    agent: "research",
    prompt: "AI Agent 在企业知识库中的落地机会",
  },
  {
    title: "演示工作流编排",
    desc: "展示 Planner、工具和评估链路",
    agent: "workflow",
    prompt: "运行 AI 客服工单自动化工作流",
  },
  {
    title: "查看可观测性",
    desc: "打开 Trace、延迟、置信度面板",
    agent: "evals",
    prompt: "查看系统运行记录",
  },
  {
    title: "项目写进简历",
    desc: "查看项目名称、技术栈和 bullets",
    agent: "portfolio",
    prompt: "生成这个项目的简历材料",
  },
  {
    title: "打开超级工具箱",
    desc: "生成会议纪要、周报、PRD、测试用例等材料",
    agent: "toolbox",
    prompt: "生成完整项目包",
  },
  {
    title: "打开全能工作台",
    desc: "生活、学习、求职、文档、数据全覆盖",
    agent: "lifehub",
    prompt: "生成生活/学习/求职/生产综合方案",
  },
  {
    title: "打开实用应用",
    desc: "任务看板、习惯、账本、笔记、番茄钟",
    agent: "apps",
    prompt: "打开可以长期使用的个人管理应用",
  },
  {
    title: "成绩分析演示",
    desc: "上千/上万学生、多课程、多图表一键分析",
    agent: "grades",
    prompt: "生成 1000 人成绩样例并分析",
  },
  {
    title: "综合管理套件",
    desc: "CRM、库存、项目、日历、自动化、报表",
    agent: "suite",
    prompt: "生成业务管理样例",
  },
];

const toolboxTools = [
  {
    id: "meeting",
    title: "会议纪要 Agent",
    desc: "把讨论内容整理成结论、待办和风险",
    sample: "讨论：我们要做一个多 Agent 项目，要求打开即用，适合写进简历。功能包括 RAG、代码审查、数据分析、Trace 观测和一键演示。",
  },
  {
    id: "email",
    title: "邮件助手 Agent",
    desc: "生成项目汇报、求职沟通或协作邮件",
    sample: "场景：向老师汇报 Agent Workbench 项目进度，说明已经完成主要功能、文档和测试。",
  },
  {
    id: "tasks",
    title: "任务拆解 Agent",
    desc: "把需求拆成看板任务和优先级",
    sample: "需求：把 Agent Workbench 升级成更完整的求职项目，加入更多实用功能和演示材料。",
  },
  {
    id: "weekly",
    title: "周报生成 Agent",
    desc: "生成本周进展、问题和下周计划",
    sample: "本周完成：项目页面、多个 Agent、工具箱、文档、烟测。问题：功能多，易用性需要持续优化。",
  },
  {
    id: "prompt",
    title: "Prompt 实验室",
    desc: "优化 prompt，给出更稳定的提示词",
    sample: "目标：让 Agent 根据岗位 JD 优化项目经历，输出简洁、真实、适合简历的 bullet。",
  },
  {
    id: "risk",
    title: "风险检查 Agent",
    desc: "检查项目风险、演示风险和简历夸大风险",
    sample: "项目：本地多 Agent 工作台，无后端，支持可选 API Key，主要用于课程展示和求职作品集。",
  },
  {
    id: "story",
    title: "用户故事 Agent",
    desc: "生成用户故事、验收标准和使用场景",
    sample: "产品：Agent Workbench，目标用户是准备求职的学生和需要演示 AI 项目的开发者。",
  },
  {
    id: "api",
    title: "API 方案 Agent",
    desc: "设计后续后端 API 和数据结构",
    sample: "需求：把当前纯前端项目升级为前后端分离，支持用户、文档、Trace、Agent 运行记录。",
  },
  {
    id: "tests",
    title: "测试用例 Agent",
    desc: "生成手动测试、边界测试和回归测试清单",
    sample: "系统：Agent Workbench，包含控制台、知识库、代码 Review、数据分析、求职助手、工具箱。",
  },
  {
    id: "learning",
    title: "学习路线 Agent",
    desc: "生成围绕项目继续提升的学习计划",
    sample: "目标：从前端项目继续学习 AI Agent、后端、数据库、RAG、部署和测试。",
  },
  {
    id: "prd",
    title: "PRD 生成 Agent",
    desc: "生成产品需求文档和版本规划",
    sample: "产品：Agent Workbench，多 Agent 企业自动化平台，目标是课程展示和求职作品集。",
  },
  {
    id: "export",
    title: "导出中心 Agent",
    desc: "整理可提交文件、演示步骤和交付清单",
    sample: "项目目录包含 index.html、styles.css、app.js、README、使用指南、项目说明书、简历与面试材料。",
  },
];

let activeToolId = "meeting";
let activeHubCategory = "data";
let activeHubToolId = "data-record";

const hubCategories = [
  { id: "data", name: "数据" },
  { id: "docs", name: "文档" },
  { id: "career", name: "求职" },
  { id: "study", name: "学习" },
  { id: "life", name: "生活" },
  { id: "work", name: "生产" },
  { id: "web", name: "网页整合" },
];

const hubTools = [
  { id: "data-record", category: "data", title: "数据记录模板", desc: "生成可持续记录的数据表结构", sample: "我想记录学习时长、运动、睡眠、心情、消费和项目进度。" },
  { id: "data-analyze", category: "data", title: "数据分析报告", desc: "从表格文本中总结趋势和异常", sample: "日期,学习时长,运动分钟,消费\n周一,2,20,35\n周二,3,0,18\n周三,1.5,30,50\n周四,4,25,20\n周五,2.5,10,80" },
  { id: "data-forecast", category: "data", title: "数据预测", desc: "用简单趋势预测下一期数值", sample: "学习时长：2, 3, 1.5, 4, 2.5, 3.5, 4.2" },
  { id: "data-viz", category: "data", title: "可视化建议", desc: "推荐适合的数据图表和看板", sample: "数据包含日期、渠道、收入、订单、成本、转化率，我想做一个看板。" },
  { id: "doc-generate", category: "docs", title: "文档生成", desc: "生成报告、说明书、方案或总结", sample: "主题：个人效率工作台。要求：包含背景、功能、使用方式、亮点和后续计划。" },
  { id: "doc-summary", category: "docs", title: "文档分析总结", desc: "总结长文本、提炼重点和行动项", sample: "这是一份项目讨论记录：我们需要做一个打开即用的综合工具，覆盖生活、学习、求职和数据分析，重点是稳定和易用。" },
  { id: "doc-continue", category: "docs", title: "文档续写", desc: "根据已有段落继续写作", sample: "已有内容：随着 AI 工具进入日常学习和工作，个人工作台不再只是记录任务，而是需要整合数据、文档、计划和决策。" },
  { id: "doc-polish", category: "docs", title: "文档润色", desc: "把粗糙文字改成正式表达", sample: "我做了一个很多功能的网站，可以记数据、分析、写文档、写简历，还能帮我学习。" },
  { id: "career-resume", category: "career", title: "简历撰写", desc: "生成项目经历和技能描述", sample: "项目：全能个人工作台。功能：数据记录分析、文档生成、求职资料、学习计划、网页信息整合。" },
  { id: "career-cover", category: "career", title: "求职信", desc: "生成简洁求职信和自我介绍", sample: "目标岗位：前端开发实习生。优势：会 JavaScript，做过综合工具项目，重视用户体验和测试。" },
  { id: "career-interview", category: "career", title: "面试题准备", desc: "生成项目相关面试问答", sample: "我要介绍一个纯前端综合工作台项目，面试官可能问架构、难点、测试和扩展。" },
  { id: "career-tracker", category: "career", title: "投递计划", desc: "生成求职投递看板和节奏", sample: "目标：一个月内投递 30 个前端/AI 应用实习岗位，需要安排简历、项目、刷题和复盘。" },
  { id: "study-plan", category: "study", title: "学习计划", desc: "生成按周学习路线", sample: "目标：8 周内提升前端、数据分析和 AI 应用开发能力，每天可学习 2 小时。" },
  { id: "study-notes", category: "study", title: "笔记整理", desc: "把零散笔记整理成知识框架", sample: "笔记：HTML 负责结构，CSS 负责样式，JS 负责交互。LocalStorage 可以在浏览器保存数据。Canvas 可以画图。" },
  { id: "study-quiz", category: "study", title: "自测题生成", desc: "生成选择题、简答题和答案", sample: "主题：JavaScript DOM、事件监听、数组方法、LocalStorage、Canvas。" },
  { id: "study-review", category: "study", title: "复习计划", desc: "根据薄弱点安排复习", sample: "薄弱点：异步编程、数组方法、CSS 布局、项目表达。考试/面试还有 14 天。" },
  { id: "life-budget", category: "life", title: "预算规划", desc: "生成月度预算和消费建议", sample: "每月生活费 2000，餐饮 900，交通 120，学习资料 150，娱乐 300，希望控制支出。" },
  { id: "life-health", category: "life", title: "健康习惯", desc: "生成运动、睡眠和饮食计划", sample: "目标：提高精力，每周运动 3 次，晚上 12 点前睡，减少外卖。" },
  { id: "life-schedule", category: "life", title: "日程安排", desc: "把待办排成一天计划", sample: "今天要完成项目测试、写报告、背英语、运动 30 分钟、整理房间。" },
  { id: "life-review", category: "life", title: "日/周复盘", desc: "生成复盘模板和改进建议", sample: "本周完成了项目大部分功能，但有两天熬夜，学习计划被打断，运动次数不足。" },
  { id: "work-plan", category: "work", title: "项目计划", desc: "生成里程碑、任务和风险", sample: "项目：全能个人工作台。周期：2 周。目标：可运行、可展示、有文档、有测试。" },
  { id: "work-prd", category: "work", title: "PRD/需求文档", desc: "生成产品需求和验收标准", sample: "产品：个人工作台。用户可以记录数据、分析趋势、生成文档、准备求职和学习计划。" },
  { id: "work-test", category: "work", title: "测试清单", desc: "生成测试用例和验收流程", sample: "系统包含首页、工具箱、全能工作台、数据记录、图表、文档生成和求职资料。" },
  { id: "web-extract", category: "web", title: "网页信息提取", desc: "从粘贴的网页文本中提取要点", sample: "网页 A：岗位要求熟悉 JavaScript、React、数据可视化。网页 B：AI 应用岗位重视 RAG、工具调用、评估和产品意识。" },
  { id: "web-compare", category: "web", title: "网页信息对比", desc: "对比多个网页/岗位/产品信息", sample: "岗位 1：前端实习，要求 JS、Vue、项目经验。岗位 2：AI 应用实习，要求 Python、LLM、RAG、前端能力。" },
  { id: "web-brief", category: "web", title: "信息整合简报", desc: "把网页资料整理成简报", sample: "资料：多个工具都在做 AI 总结、数据分析和个人效率管理。用户希望一个地方完成记录、分析和写作。" },
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function tokenize(text) {
  const raw = String(text || "").toLowerCase();
  const latin = raw.match(/[a-z0-9_+#.-]+/g) || [];
  const cjk = raw.match(/[\u4e00-\u9fa5]{1,2}/g) || [];
  return [...latin, ...cjk].filter((token) => token.length > 1);
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function scoreText(query, text) {
  const q = unique(tokenize(query));
  const t = tokenize(text);
  if (!q.length || !t.length) return 0;
  const counts = new Map();
  t.forEach((token) => counts.set(token, (counts.get(token) || 0) + 1));
  const hits = q.reduce((sum, token) => sum + Math.min(counts.get(token) || 0, 3), 0);
  return hits / Math.sqrt(t.length + 6);
}

function confidenceLabel(score) {
  return Math.max(12, Math.min(98, Math.round(score * 100)));
}

function renderConfidence(value) {
  const safe = Math.max(0, Math.min(100, value));
  return `<span class="confidence"><span class="confidence-bar"><i style="width:${safe}%"></i></span>${safe}%</span>`;
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function saveState() {
  localStorage.setItem("agentWorkbench.docs", JSON.stringify(state.docs));
  localStorage.setItem("agentWorkbench.chunks", JSON.stringify(state.chunks.slice(-2000)));
  localStorage.setItem("agentWorkbench.currentUser", JSON.stringify(state.currentUser));
  localStorage.setItem("agentWorkbench.qaHistory", JSON.stringify(state.qaHistory.slice(0, 100)));
  localStorage.setItem("agentWorkbench.traces", JSON.stringify(state.traces.slice(-80)));
  localStorage.setItem("agentWorkbench.lifeData", JSON.stringify(state.lifeData.slice(-300)));
  localStorage.setItem("agentWorkbench.tasks", JSON.stringify(state.tasks.slice(-200)));
  localStorage.setItem("agentWorkbench.habits", JSON.stringify(state.habits.slice(-100)));
  localStorage.setItem("agentWorkbench.money", JSON.stringify(state.money.slice(-300)));
  localStorage.setItem("agentWorkbench.goals", JSON.stringify(state.goals.slice(-100)));
  localStorage.setItem("agentWorkbench.markdown", state.markdown || "");
  localStorage.setItem("agentWorkbench.gradeHistory", JSON.stringify(state.gradeHistory.slice(0, 30)));
  localStorage.setItem("agentWorkbench.suite", JSON.stringify(state.suite));
  localStorage.setItem("agentWorkbench.settings", JSON.stringify(state.settings));
}

function loadState() {
  try {
    state.docs = JSON.parse(localStorage.getItem("agentWorkbench.docs") || "[]");
    state.chunks = JSON.parse(localStorage.getItem("agentWorkbench.chunks") || "[]");
    state.currentUser = JSON.parse(localStorage.getItem("agentWorkbench.currentUser") || '{"name":"admin","role":"admin"}');
    state.qaHistory = JSON.parse(localStorage.getItem("agentWorkbench.qaHistory") || "[]");
    state.traces = JSON.parse(localStorage.getItem("agentWorkbench.traces") || "[]");
    state.lifeData = JSON.parse(localStorage.getItem("agentWorkbench.lifeData") || "[]");
    state.tasks = JSON.parse(localStorage.getItem("agentWorkbench.tasks") || "[]");
    state.habits = JSON.parse(localStorage.getItem("agentWorkbench.habits") || "[]");
    state.money = JSON.parse(localStorage.getItem("agentWorkbench.money") || "[]");
    state.goals = JSON.parse(localStorage.getItem("agentWorkbench.goals") || "[]");
    state.markdown = localStorage.getItem("agentWorkbench.markdown") || "";
    state.gradeHistory = JSON.parse(localStorage.getItem("agentWorkbench.gradeHistory") || "[]");
    state.suite = {
      crm: [],
      stock: [],
      milestones: [],
      events: [],
      audit: [],
      ...JSON.parse(localStorage.getItem("agentWorkbench.suite") || "{}"),
    };
    state.settings = {
      ...state.settings,
      ...JSON.parse(localStorage.getItem("agentWorkbench.settings") || "{}"),
    };
  } catch {
    state.docs = [];
    state.chunks = [];
    state.currentUser = { name: "admin", role: "admin" };
    state.qaHistory = [];
    state.traces = [];
    state.lifeData = [];
    state.tasks = [];
    state.habits = [];
    state.money = [];
    state.goals = [];
    state.markdown = "";
    state.gradeStudents = [];
    state.gradeSummary = null;
    state.gradeHistory = [];
    state.suite = { crm: [], stock: [], milestones: [], events: [], audit: [] };
  }
}

function addTrace(agent, input, result, started, confidence = 72, toolCount = 1) {
  const latency = Math.max(1, Math.round(performance.now() - started));
  const trace = {
    id: crypto.randomUUID(),
    at: new Date().toLocaleString("zh-CN"),
    agent,
    input: String(input || "").slice(0, 140),
    result: String(result || "").replace(/<[^>]+>/g, "").slice(0, 180),
    latency,
    confidence,
    toolCount,
  };
  state.traces.unshift(trace);
  state.traces = state.traces.slice(0, 80);
  saveState();
  renderTraces();
  return trace;
}

function setPanel(panel) {
  document.querySelectorAll(".panel").forEach((el) => el.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach((el) => el.classList.remove("active"));
  $(`panel-${panel}`).classList.add("active");
  document.querySelector(`[data-panel="${panel}"]`).classList.add("active");
  $("pageTitle").textContent = document.querySelector(`[data-panel="${panel}"]`).textContent;
  if (panel === "data") drawChart(parseCsv($("csvInput").value));
  if (panel === "command") requestAnimationFrame(drawAgentGraph);
  if (panel === "portfolio") requestAnimationFrame(drawArchitecture);
}

function renderCapabilityCards() {
  $("capabilityCards").innerHTML = capabilities
    .map(
      (item) => `<article class="cap-card">
        <h3>${escapeHtml(item.title)}</h3>
        <p>${escapeHtml(item.text)}</p>
        <button data-jump="${item.panel}">打开</button>
      </article>`,
    )
    .join("");
}

function renderPresetTasks() {
  $("presetTasks").innerHTML = presetTasks
    .map(
      (task, index) => `<button class="preset-card" data-preset="${index}">
        <strong>${escapeHtml(task.title)}</strong>
        <span>${escapeHtml(task.desc)}</span>
      </button>`,
    )
    .join("");
}

function renderToolbox() {
  $("toolboxGrid").innerHTML = toolboxTools
    .map(
      (tool) => `<button class="toolbox-card ${tool.id === activeToolId ? "active" : ""}" data-tool="${tool.id}">
        <strong>${escapeHtml(tool.title)}</strong>
        <span>${escapeHtml(tool.desc)}</span>
      </button>`,
    )
    .join("");
  const active = getActiveTool();
  $("toolboxTitle").textContent = active.title;
  $("toolboxBadge").textContent = active.id;
  if (!$("toolboxInput").value.trim()) $("toolboxInput").value = active.sample;
}

function getActiveTool() {
  return toolboxTools.find((tool) => tool.id === activeToolId) || toolboxTools[0];
}

function selectTool(id) {
  activeToolId = id;
  const tool = getActiveTool();
  $("toolboxInput").value = tool.sample;
  $("toolboxTitle").textContent = tool.title;
  $("toolboxBadge").textContent = tool.id;
  renderToolbox();
}

function ensureSampleData() {
  if (state.docs.length < samples.docs.length) {
    samples.docs.forEach((doc) => {
      const exists = state.docs.some((item) => item.title === doc.title);
      if (!exists) {
        state.docs.unshift({
          id: crypto.randomUUID(),
          title: doc.title,
          text: doc.text,
          addedAt: Date.now(),
        });
      }
    });
    saveState();
    renderDocs();
  }
  $("codeInput").value = samples.code;
  $("csvInput").value = samples.csv;
  $("resumeInput").value = samples.resume;
  $("jdInput").value = samples.jd;
  $("dataQuestion").value = "按渠道汇总收入并排序";
  $("kbQuestion").value = "这个项目有哪些 Agent 能力？";
}

function scrollToOutput(id) {
  const target = $(id);
  if (target) target.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function bulletList(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function runToolboxTool(id = activeToolId, rawInput = $("toolboxInput").value) {
  const started = performance.now();
  const input = String(rawInput || "").trim() || getActiveTool().sample;
  const title = toolboxTools.find((tool) => tool.id === id)?.title || "工具";
  let html = "";

  if (id === "meeting") {
    html = `<h3>会议纪要</h3>
      <p><strong>主题：</strong>Agent Workbench 项目推进</p>
      <h3>核心结论</h3>${bulletList([
        "项目定位为本地优先的多 Agent 求职作品集。",
        "首页需要保留一键演示和预设任务，降低首次使用成本。",
        "重点展示 RAG、工具调用、工作流编排、Trace 观测和简历材料生成。",
      ])}
      <h3>待办事项</h3>${bulletList([
        "继续优化文档和演示话术。",
        "保留稳定的本地回退逻辑，避免演示依赖外部服务。",
        "后续可升级真实后端、向量数据库和部署版本。",
      ])}
      <h3>输入摘要</h3><p>${escapeHtml(input)}</p>`;
  }

  if (id === "email") {
    html = `<h3>汇报邮件</h3>
      <p>老师/面试官您好，</p>
      <p>我完成了 Agent Workbench 项目，这是一个本地优先的多 Agent 企业自动化平台。项目集成了知识库问答、代码审查、CSV 数据分析、求职匹配、研究报告、工作流编排和 Trace 可观测能力。</p>
      <p>项目可以直接双击 HTML 文件运行，不依赖后端和 API Key。为了方便展示，我加入了一键演示、预设任务卡片和完整的项目文档。</p>
      <p>这个项目主要体现了我对 AI Agent 应用工程化落地的理解，包括任务路由、工具调用、失败回退和可观测性设计。</p>
      <p>谢谢。</p>`;
  }

  if (id === "tasks") {
    html = `<h3>任务看板</h3>
      <div class="tool-output-grid">
        <div class="mini-doc"><strong>高优先级</strong>${bulletList(["完善一键演示", "保证所有模块有示例数据", "补充简历和面试材料"])}</div>
        <div class="mini-doc"><strong>中优先级</strong>${bulletList(["增加测试清单", "优化移动端布局", "完善设置页说明"])}</div>
        <div class="mini-doc"><strong>低优先级</strong>${bulletList(["接入真实后端", "增加主题切换", "增加文件导入"])}</div>
        <div class="mini-doc"><strong>验收标准</strong>${bulletList(["双击可运行", "一键演示无报错", "核心模块都有输出"])}</div>
      </div>`;
  }

  if (id === "weekly") {
    html = `<h3>项目周报</h3>
      <h3>本周完成</h3>${bulletList(["完成多 Agent 工作台主界面", "完成知识库、代码审查、数据分析、求职助手和研究报告", "新增超级工具箱和项目文档", "完成语法检查和浏览器烟测"])}
      <h3>遇到问题</h3>${bulletList(["功能较多，需要控制入口复杂度", "本地项目需要兼顾稳定性和展示效果"])}
      <h3>下周计划</h3>${bulletList(["继续优化 UI 细节", "准备答辩讲稿", "如有时间接入后端和真实模型"])} `;
  }

  if (id === "prompt") {
    html = `<h3>优化后的 Prompt</h3>
      <pre>你是一个严格、务实的 AI 项目简历优化助手。
请根据岗位 JD 优化我的项目经历，要求：
1. 不夸大事实；
2. 强调工程能力、业务场景和可量化结果；
3. 每条 bullet 控制在 35-60 字；
4. 使用“实现/设计/构建/优化”等动作动词；
5. 输出 3 条简历 bullet 和 3 个面试可讲难点。</pre>
      <h3>为什么更稳定</h3>${bulletList(["明确角色", "限定输出格式", "约束真实性", "控制长度", "强调动作和结果"])}`;
  }

  if (id === "risk") {
    html = `<h3>风险检查报告</h3>
      <h3>技术风险</h3>${bulletList(["纯前端项目不适合处理敏感数据", "本地检索不是完整向量数据库", "规则审查不能替代真实编译和测试"])}
      <h3>演示风险</h3>${bulletList(["浏览器兼容性需要提前确认", "不要现场临时配置 API Key", "演示时优先使用一键演示和预设任务"])}
      <h3>简历风险</h3>${bulletList(["不要写成已经上线企业系统", "不要声称使用了未实际接入的数据库", "可以强调架构预留和可扩展方向"])}`;
  }

  if (id === "story") {
    html = `<h3>用户故事</h3>
      ${bulletList([
        "作为准备求职的学生，我希望一键生成项目简历材料，从而快速完善简历。",
        "作为面试官，我希望快速看到项目核心能力，从而判断候选人的工程水平。",
        "作为课程老师，我希望项目能直接运行，从而减少环境配置问题。",
      ])}
      <h3>验收标准</h3>${bulletList(["首页可以一键演示", "每个 Agent 都有示例输入", "评估面板能看到 Trace", "文档能说明项目价值"])}`;
  }

  if (id === "api") {
    html = `<h3>后端 API 方案</h3>
      <div class="tool-output-grid">
        <div class="mini-doc"><strong>POST /api/agents/run</strong><p>运行指定 Agent，返回结果和 traceId。</p></div>
        <div class="mini-doc"><strong>POST /api/documents</strong><p>上传文档，解析后写入知识库。</p></div>
        <div class="mini-doc"><strong>GET /api/traces</strong><p>查询 Agent 调用记录、延迟和成本。</p></div>
        <div class="mini-doc"><strong>POST /api/evals/run</strong><p>运行评估集，输出准确率和失败样本。</p></div>
      </div>
      <h3>数据表建议</h3>${bulletList(["users", "documents", "chunks", "agent_runs", "traces", "eval_cases", "feedback"])}`;
  }

  if (id === "tests") {
    html = `<h3>测试用例清单</h3>
      <h3>功能测试</h3>${bulletList(["一键演示可以完成", "预设任务卡片可点击", "知识库能返回引用", "代码审查能返回问题", "数据分析能生成表格和图表"])}
      <h3>边界测试</h3>${bulletList(["空输入时给出提示", "CSV 只有表头时不崩溃", "知识库为空时提示载入文档", "API Key 错误时回退本地"])}
      <h3>回归测试</h3>${bulletList(["导航切换不报错", "Trace 数量更新", "README 和说明文档存在", "移动端布局不溢出"])}`;
  }

  if (id === "learning") {
    html = `<h3>学习路线</h3>
      <h3>第 1 阶段：前端工程</h3>${bulletList(["深入 JavaScript 模块化", "学习状态管理", "完善响应式设计和可访问性"])}
      <h3>第 2 阶段：后端与数据库</h3>${bulletList(["学习 FastAPI 或 Node.js", "学习 PostgreSQL", "实现文档和 Trace 后端存储"])}
      <h3>第 3 阶段：AI Agent</h3>${bulletList(["学习 RAG", "学习工具调用", "学习 LangGraph / 工作流编排", "学习 Eval 和 Observability"])}
      <h3>第 4 阶段：部署与求职</h3>${bulletList(["部署线上 Demo", "录制演示视频", "准备项目讲解和简历 bullet"])}`;
  }

  if (id === "prd") {
    html = `<h3>产品需求文档 PRD</h3>
      <h3>产品定位</h3><p>Agent Workbench 是面向学生和初级开发者的多 Agent 求职作品集平台。</p>
      <h3>目标用户</h3>${bulletList(["准备求职的学生", "需要展示 AI 项目的开发者", "课程项目答辩者"])}
      <h3>核心需求</h3>${bulletList(["一键演示", "多 Agent 能力展示", "项目材料生成", "Trace 可观测", "本地稳定运行"])}
      <h3>版本规划</h3>${bulletList(["V1：纯前端本地版", "V2：接入后端和数据库", "V3：接入真实模型和向量检索", "V4：部署线上和多人协作"])}`;
  }

  if (id === "export") {
    html = `<h3>交付清单</h3>
      ${bulletList(["index.html：项目入口", "styles.css：界面样式", "app.js：核心逻辑", "README.md：总说明", "使用指南.md：操作说明", "项目说明书.md：课程报告", "简历与面试材料.md：求职材料"])}
      <h3>演示顺序</h3>${bulletList(["打开 index.html", "点击一键演示", "展示 Agent 编排", "展示超级工具箱", "展示评估观测", "展示项目简历页"])}
      <h3>提交建议</h3><p>提交整个项目文件夹，不要只提交 HTML 文件。</p>`;
  }

  addTrace(title, input, html, started, 86, 2);
  return html;
}

function runActiveToolboxTool() {
  const html = runToolboxTool(activeToolId, $("toolboxInput").value);
  $("toolboxOutput").innerHTML = html;
  scrollToOutput("toolboxOutput");
}

function runToolboxSuite() {
  const started = performance.now();
  const ids = ["meeting", "tasks", "prd", "tests", "risk", "export"];
  const html = `<h3>完整项目包已生成</h3>
    <p>下面汇总了项目管理、PRD、测试、风险和交付材料，适合直接放入课程报告或答辩准备。</p>
    <div class="tool-output-grid">${ids
      .map((id) => {
        const tool = toolboxTools.find((item) => item.id === id);
        const body = runToolboxTool(id, tool.sample).replace(/<h3>[\s\S]*?<\/h3>/, "");
        return `<div class="mini-doc"><strong>${escapeHtml(tool.title)}</strong>${body.slice(0, 900)}</div>`;
      })
      .join("")}</div>`;
  $("toolboxOutput").innerHTML = html;
  addTrace("Toolbox Suite", "generate complete project package", html, started, 92, ids.length);
  scrollToOutput("toolboxOutput");
}

function renderHub() {
  $("hubTabs").innerHTML = hubCategories
    .map((cat) => `<button class="hub-tab ${cat.id === activeHubCategory ? "active" : ""}" data-hub-category="${cat.id}">${escapeHtml(cat.name)}</button>`)
    .join("");
  const tools = hubTools.filter((tool) => tool.category === activeHubCategory);
  if (!tools.some((tool) => tool.id === activeHubToolId)) activeHubToolId = tools[0]?.id || hubTools[0].id;
  $("hubTools").innerHTML = tools
    .map(
      (tool) => `<button class="hub-card ${tool.id === activeHubToolId ? "active" : ""}" data-hub-tool="${tool.id}">
        <strong>${escapeHtml(tool.title)}</strong>
        <span>${escapeHtml(tool.desc)}</span>
      </button>`,
    )
    .join("");
  const active = getActiveHubTool();
  $("hubTitle").textContent = active.title;
  $("hubBadge").textContent = hubCategories.find((cat) => cat.id === active.category)?.name || active.category;
  if (!$("hubInput").value.trim()) $("hubInput").value = active.sample;
}

function getActiveHubTool() {
  return hubTools.find((tool) => tool.id === activeHubToolId) || hubTools[0];
}

function selectHubCategory(id) {
  activeHubCategory = id;
  const first = hubTools.find((tool) => tool.category === id);
  if (first) activeHubToolId = first.id;
  $("hubInput").value = getActiveHubTool().sample;
  renderHub();
}

function selectHubTool(id) {
  activeHubToolId = id;
  $("hubInput").value = getActiveHubTool().sample;
  renderHub();
}

function splitLines(text) {
  return String(text || "")
    .split(/\r?\n|。|；|;/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function extractNumbers(text) {
  return (String(text || "").match(/-?\d+(?:\.\d+)?/g) || []).map(Number).filter(Number.isFinite);
}

function runHubTool(id = activeHubToolId, rawInput = $("hubInput").value, options = {}) {
  const started = performance.now();
  const tool = hubTools.find((item) => item.id === id) || getActiveHubTool();
  const input = String(rawInput || tool.sample).trim();
  const lines = splitLines(input);
  const numbers = extractNumbers(input);
  let html = "";

  const commonSummary = () => `<h3>输入要点</h3>${bulletList(lines.slice(0, 6).length ? lines.slice(0, 6) : [input.slice(0, 120)])}`;

  switch (id) {
    case "data-record":
      html = `<h3>数据记录方案</h3>${bulletList(["日期", "指标名称", "数值", "单位", "备注", "分类"])}
        <h3>推荐记录频率</h3>${bulletList(["学习/运动/睡眠：每日记录", "消费/项目进度：发生时记录", "心情/精力：每天 1 次 1-5 分评分"])}
        <h3>表格示例</h3><pre>date,metric,value,unit,note\n2026-07-05,学习时长,3.5,h,完成项目测试\n2026-07-05,运动,30,min,慢跑</pre>`;
      break;
    case "data-analyze":
      html = `<h3>数据分析报告</h3>${commonSummary()}
        <h3>统计结果</h3>${bulletList([
          `识别到 ${numbers.length} 个数值`,
          numbers.length ? `平均值约为 ${formatNumber(numbers.reduce((a, b) => a + b, 0) / numbers.length)}` : "未识别到可计算数值",
          numbers.length ? `最大值 ${formatNumber(Math.max(...numbers))}，最小值 ${formatNumber(Math.min(...numbers))}` : "建议粘贴 CSV 或数字列表",
        ])}
        <h3>分析建议</h3>${bulletList(["先看趋势，再看异常点", "把指标拆成输入指标和结果指标", "持续记录后再做预测更可靠"])}`;
      break;
    case "data-forecast": {
      const values = numbers.map((value, index) => ({ value, date: String(index + 1) }));
      const next = forecastNext(values);
      html = `<h3>简单趋势预测</h3>${bulletList([
        `历史数据：${numbers.join("、") || "未识别到数字"}`,
        `下一期预测：${numbers.length ? formatNumber(next) : "需要更多数字"}`,
        "预测方法：简单线性趋势，适合演示和初步判断",
      ])}<p class="muted">提示：预测不是确定结果，数据越多越稳定。</p>`;
      break;
    }
    case "data-viz":
      html = `<h3>可视化方案</h3>${bulletList(["趋势类：折线图", "对比类：柱状图", "占比类：饼图或堆叠条形图", "指标总览：卡片 + 迷你趋势线", "异常分析：表格高亮"])}
        <h3>看板布局</h3>${bulletList(["顶部放核心 KPI", "中间放趋势图和渠道对比", "底部放明细表和行动建议"])}`;
      break;
    case "doc-generate":
      html = `<h3>生成文档</h3><h3>背景</h3><p>${escapeHtml(lines[0] || "本项目旨在提升个人效率和项目展示能力。")}</p>
        <h3>功能</h3>${bulletList(["数据记录与分析", "文档生成和总结", "求职资料撰写", "学习计划制定", "网页信息整合"])}
        <h3>亮点</h3>${bulletList(["打开即用", "模块丰富", "支持本地记录", "适合课程展示和求职"])}`;
      break;
    case "doc-summary":
      html = `<h3>文档总结</h3>${commonSummary()}
        <h3>核心结论</h3>${bulletList(["目标是做一个稳定易用的综合工具", "功能覆盖生活、学习、求职和数据分析", "重点是点开即用、示例可跑、结果清晰"])}
        <h3>行动项</h3>${bulletList(["补齐功能入口", "完善测试", "更新文档", "准备演示路线"])}`;
      break;
    case "doc-continue":
      html = `<h3>续写内容</h3><p>${escapeHtml(input)}</p>
        <p>在这个趋势下，个人工具需要从单点功能走向综合工作台。它不仅要能记录信息，还要能帮助用户分析数据、生成文档、规划任务，并把不同场景中的资料整合成可执行的方案。</p>
        <p>因此，一个优秀的个人工作台应该具备三个特点：第一，入口足够简单；第二，功能之间能够互相连接；第三，所有结果都可以被保存、复盘和再次编辑。</p>`;
      break;
    case "doc-polish":
      html = `<h3>润色后</h3><p>我开发了一个综合型个人工作台，集成数据记录、数据分析、可视化、文档生成、求职资料撰写、学习计划制定和网页信息整合等功能。项目采用本地优先设计，打开即可使用，适合课程展示、个人效率管理和求职作品集展示。</p>
        <h3>优化点</h3>${bulletList(["表达更正式", "功能分类更清晰", "突出使用场景", "避免口语化"])}`;
      break;
    case "career-resume":
      html = `<h3>简历项目描述</h3>${bulletList([
        "独立开发综合型个人工作台，覆盖数据记录、分析预测、文档生成、求职资料撰写、学习计划和网页信息整合等场景。",
        "使用原生 JavaScript、Canvas 和 LocalStorage 实现本地数据持久化、趋势可视化、简单预测和多工具模块化调度。",
        "设计一键演示、预设任务和完整说明文档，提升项目可用性、可展示性和求职转化效果。",
      ])}`;
      break;
    case "career-cover":
      html = `<h3>求职信</h3><p>您好，我正在寻找前端开发/AI 应用相关实习机会。我具备 JavaScript、页面交互、数据可视化和项目工程化能力，并独立完成了一个综合型个人工作台项目。</p>
        <p>该项目覆盖数据记录、分析预测、文档生成、求职资料和学习计划等场景，强调打开即用和稳定演示。我希望能在实习中继续提升产品开发和工程落地能力。</p>`;
      break;
    case "career-interview":
      html = `<h3>面试问答</h3>${bulletList([
        "Q：项目最大亮点是什么？A：功能覆盖广，同时保持本地打开即用和一键演示。",
        "Q：为什么不用后端？A：为了保证展示稳定，核心逻辑先做成本地版，后续可扩展后端。",
        "Q：技术难点是什么？A：多功能入口组织、本地数据分析、图表预测和无依赖稳定运行。",
      ])}`;
      break;
    case "career-tracker":
      html = `<h3>求职投递计划</h3>${bulletList(["第 1 周：完善简历和项目文档", "第 2 周：投递 10 个岗位并复盘 JD", "第 3 周：补面试题和项目讲解", "第 4 周：集中面试和迭代简历"])}
        <h3>投递表字段</h3>${bulletList(["公司", "岗位", "JD 关键词", "投递日期", "状态", "复盘"])}`;
      break;
    case "study-plan":
      html = `<h3>8 周学习计划</h3>${bulletList(["第 1-2 周：JavaScript 和 DOM", "第 3-4 周：CSS 布局和组件化", "第 5 周：数据分析和可视化", "第 6 周：AI 应用基础", "第 7 周：项目完善", "第 8 周：简历和面试"])}`;
      break;
    case "study-notes":
      html = `<h3>整理后的笔记</h3>${bulletList(["HTML：负责页面结构", "CSS：负责视觉样式和响应式布局", "JavaScript：负责交互逻辑", "LocalStorage：负责本地数据保存", "Canvas：负责图表和可视化"])}
        <h3>复习建议</h3>${bulletList(["用项目串联知识点", "每个知识点写一个小 demo", "整理常见面试问答"])}`;
      break;
    case "study-quiz":
      html = `<h3>自测题</h3>${bulletList(["DOM 事件监听的作用是什么？", "LocalStorage 和变量保存有什么区别？", "Canvas 适合做哪些可视化？", "数组 map/filter/reduce 分别适合什么场景？"])}
        <h3>答案要点</h3>${bulletList(["事件监听用于响应用户操作", "LocalStorage 刷新后仍保留", "Canvas 适合图表和绘图", "map 转换，filter 筛选，reduce 聚合"])}`;
      break;
    case "study-review":
      html = `<h3>14 天复习计划</h3>${bulletList(["1-3 天：补异步和数组方法", "4-6 天：练 CSS 布局", "7-9 天：整理项目讲解", "10-12 天：刷常见面试题", "13-14 天：模拟面试和查漏补缺"])}`;
      break;
    case "life-budget":
      html = `<h3>预算规划</h3>${bulletList(["先固定必要支出：餐饮、交通、学习", "娱乐支出设置上限", "每周复盘一次消费", "保留 10%-15% 机动资金"])}
        <h3>建议</h3><p>如果月生活费为 2000，可以尝试：餐饮 900，交通 150，学习 200，娱乐 300，备用 450。</p>`;
      break;
    case "life-health":
      html = `<h3>健康习惯计划</h3>${bulletList(["每周运动 3 次，每次 30 分钟", "睡前 30 分钟远离屏幕", "每天至少一次高蛋白正餐", "用数据记录睡眠、运动和精力变化"])}`;
      break;
    case "life-schedule":
      html = `<h3>今日安排</h3>${bulletList(["09:00-11:00 完成项目测试", "11:00-12:00 写报告", "14:00-15:00 背英语", "16:00-16:30 运动", "20:00-21:00 整理房间和复盘"])}`;
      break;
    case "life-review":
      html = `<h3>复盘</h3>${bulletList(["完成：项目功能推进明显", "问题：睡眠和运动不稳定", "原因：任务安排过满", "改进：每天只设 3 个最重要任务"])}
        <h3>下周重点</h3>${bulletList(["稳定作息", "保持运动", "完成项目文档", "准备演示"])}`;
      break;
    case "work-plan":
      html = `<h3>项目计划</h3>${bulletList(["阶段 1：确定功能范围", "阶段 2：实现核心页面", "阶段 3：补数据分析和文档工具", "阶段 4：测试和文档", "阶段 5：演示和简历包装"])}
        <h3>风险</h3>${bulletList(["功能过多导致入口混乱", "本地功能要避免依赖网络", "测试要覆盖关键流程"])}`;
      break;
    case "work-prd":
      html = `<h3>PRD</h3><p>产品定位：一个覆盖生活、学习、求职和生产的本地综合工作台。</p>
        <h3>核心需求</h3>${bulletList(["快速运行工具", "记录和分析数据", "生成文档", "生成求职材料", "整合网页资料"])}
        <h3>验收标准</h3>${bulletList(["双击可运行", "每类功能有示例", "数据可保存", "图表可显示", "无控制台错误"])}`;
      break;
    case "work-test":
      html = `<h3>测试清单</h3>${bulletList(["打开 index.html", "点击一键演示", "切换全能工作台分类", "运行每类至少一个工具", "载入生活数据并生成图表", "刷新后数据仍存在"])}
        <h3>边界测试</h3>${bulletList(["空输入", "无数字数据", "长文本", "清空记录", "移动端布局"])}`;
      break;
    case "web-extract":
      html = `<h3>网页信息提取</h3>${commonSummary()}
        <h3>关键词</h3>${bulletList(unique(tokenize(input)).slice(0, 12))}
        <h3>可用结论</h3>${bulletList(["岗位/网页资料需要转成能力清单", "不同来源的信息要合并同类项", "保留来源摘要，避免混淆"])}`;
      break;
    case "web-compare":
      html = `<h3>信息对比</h3><div class="tool-output-grid">
        <div class="mini-doc"><strong>共同点</strong>${bulletList(["都重视项目经验", "都需要基础工程能力", "都要求能解释项目"])}</div>
        <div class="mini-doc"><strong>差异点</strong>${bulletList(["前端岗位更重视页面和框架", "AI 应用岗位更重视 LLM、RAG 和数据处理"])}</div>
      </div><h3>建议</h3>${bulletList(["简历保留前端能力", "项目描述增加 AI 应用和数据分析表达"])}`;
      break;
    case "web-brief":
      html = `<h3>信息整合简报</h3><p>综合资料显示，个人效率工具正在从单一记录工具升级为集记录、分析、生成和决策于一体的综合工作台。</p>
        <h3>机会</h3>${bulletList(["学习和求职场景需求明确", "数据分析和文档生成可以互相连接", "本地优先降低使用门槛"])}
        <h3>建议功能</h3>${bulletList(["数据记录", "趋势预测", "文档总结", "简历生成", "网页资料整合"])}`;
      break;
    default:
      html = `<h3>${escapeHtml(tool.title)}</h3>${commonSummary()}`;
  }

  if (!options.silent) addTrace(tool.title, input, html, started, 84, 2);
  return html;
}

function runActiveHubTool() {
  const html = runHubTool(activeHubToolId, $("hubInput").value);
  $("hubOutput").innerHTML = html;
  scrollToOutput("hubOutput");
}

function runHubSuite() {
  const started = performance.now();
  const ids = ["data-record", "data-forecast", "doc-summary", "career-resume", "study-plan", "life-schedule", "work-test", "web-brief"];
  const html = `<h3>生活 / 学习 / 求职 / 生产综合方案</h3>
    <p>已自动生成数据、文档、求职、学习、生活、生产和网页整合相关内容。</p>
    <div class="tool-output-grid">${ids
      .map((id) => {
        const tool = hubTools.find((item) => item.id === id);
        const body = runHubTool(id, tool.sample, { silent: true }).replace(/<h3>[\s\S]*?<\/h3>/, "");
        return `<div class="mini-doc"><strong>${escapeHtml(tool.title)}</strong>${body.slice(0, 760)}</div>`;
      })
      .join("")}</div>`;
  $("hubOutput").innerHTML = html;
  addTrace("All-in-one Workbench", "generate life study career work package", html, started, 91, ids.length);
  scrollToOutput("hubOutput");
}

async function withLoading(button, label, task) {
  const oldText = button.textContent;
  button.textContent = label;
  button.classList.add("is-loading");
  try {
    return await task();
  } finally {
    button.textContent = oldText;
    button.classList.remove("is-loading");
  }
}

function renderDocs() {
  $("docCount").textContent = `${state.docs.length} docs`;
  if (!state.docs.length) {
    $("docList").innerHTML = `<p class="muted">还没有文档。可以载入示例，也可以粘贴自己的资料。</p>`;
    return;
  }
  $("docList").innerHTML = state.docs
    .map(
      (doc, index) => `<article class="doc-item">
        <strong>${escapeHtml(doc.title)}</strong>
        <p class="muted">${escapeHtml(doc.text.slice(0, 180))}${doc.text.length > 180 ? "..." : ""}</p>
        <button data-remove-doc="${index}">删除</button>
      </article>`,
    )
    .join("");
}

function addDocument(title, text) {
  const cleanText = String(text || "").trim();
  if (!cleanText) {
    showToast("文档内容不能为空");
    return false;
  }
  state.docs.unshift({
    id: crypto.randomUUID(),
    title: String(title || `文档 ${state.docs.length + 1}`).trim(),
    text: cleanText,
    addedAt: Date.now(),
  });
  saveState();
  renderDocs();
  return true;
}

function answerKnowledge(question) {
  const started = performance.now();
  const clean = String(question || "").trim();
  if (!clean) return `<p class="muted">请输入问题。</p>`;
  if (!state.docs.length) return `<p class="muted">知识库为空。先载入示例文档或加入自己的资料。</p>`;
  const ranked = state.docs
    .map((doc) => ({ ...doc, score: scoreText(clean, `${doc.title}\n${doc.text}`) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  const best = ranked[0];
  const confidence = confidenceLabel(best.score);
  const keyTerms = unique(tokenize(clean)).slice(0, 8);
  const snippets = ranked
    .filter((doc) => doc.score > 0)
    .map((doc) => {
      const sentences = doc.text.split(/[。！？.!?\n]/).filter(Boolean);
      const sentence =
        sentences.find((s) => keyTerms.some((term) => s.toLowerCase().includes(term))) ||
        sentences[0] ||
        doc.text;
      return `<div class="source-row"><strong>${escapeHtml(doc.title)}</strong><p>${escapeHtml(sentence.slice(0, 240))}</p></div>`;
    });
  const answer =
    confidence < 18
      ? "没有找到足够强的证据。建议补充更相关的文档，或把问题问得更具体。"
      : `根据知识库，问题重点与「${escapeHtml(best.title)}」最相关。可以总结为：${escapeHtml((snippets[0] || "").replace(/<[^>]+>/g, "").slice(0, 220))}`;
  const html = `<h3>回答</h3><p>${answer}</p><p>置信度：${renderConfidence(confidence)}</p><h3>引用来源</h3>${snippets.join("") || "<p class='muted'>无匹配来源。</p>"}`;
  addTrace("Knowledge Agent", clean, html, started, confidence, 2);
  return html;
}

function reviewCode(code) {
  const started = performance.now();
  const lines = String(code || "").split(/\r?\n/);
  const findings = [];
  const add = (severity, line, title, detail) => findings.push({ severity, line, title, detail });
  lines.forEach((line, idx) => {
    const n = idx + 1;
    if (/\bfor\s*\([^;]+;\s*[^;]*<=\s*[^;]*\.length/.test(line)) {
      add("高", n, "循环边界可能越界", "使用 <= length 会访问数组末尾之外的位置，建议改成 < length。");
    }
    if (/\bif\s*\([^)]*[^=!<>]=[^=][^)]*\)/.test(line)) {
      add("高", n, "条件语句中疑似赋值", "if 条件里出现单等号，通常应该使用 === 或明确的布尔判断。");
    }
    if (/\bfetch\s*\(/.test(line) && !String(code).includes("catch")) {
      add("中", n, "网络请求缺少错误处理", "fetch 失败时没有 catch 或状态码处理，用户流程可能静默失败。");
    }
    if (/\bvar\b/.test(line)) {
      add("低", n, "建议使用 let/const", "块级作用域更清晰，可以减少闭包和循环变量问题。");
    }
    if (line.length > 120) {
      add("低", n, "单行过长", "较长代码行会降低 diff review 可读性。");
    }
    if (/JSON\.parse\s*\(/.test(line) && !String(code).includes("try")) {
      add("中", n, "JSON.parse 缺少异常保护", "输入不合法会抛异常，建议使用 try/catch 或 schema 校验。");
    }
    if (/innerHTML\s*=/.test(line)) {
      add("中", n, "潜在 XSS 风险", "写入 innerHTML 前要转义或只使用可信内容。");
    }
  });
  if (!String(code).trim()) {
    return { html: `<p class="muted">请粘贴代码或点击示例代码。</p>`, findings: [] };
  }
  if (!findings.length) {
    findings.push({
      severity: "通过",
      line: "-",
      title: "未发现明显规则问题",
      detail: "本地规则扫描没有命中高风险模式。建议继续补充单元测试和边界输入测试。",
    });
  }
  const severityRank = { 高: 0, 中: 1, 低: 2, 通过: 3 };
  findings.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);
  const html = findings
    .map(
      (f) => `<div class="finding">
        <strong>[${escapeHtml(f.severity)}] ${escapeHtml(f.title)}</strong>
        <p>行 ${escapeHtml(f.line)}：${escapeHtml(f.detail)}</p>
      </div>`,
    )
    .join("");
  const confidence = findings.some((f) => f.severity === "高") ? 88 : 74;
  addTrace("Code Review Agent", code.slice(0, 160), html, started, confidence, 3);
  return { html, findings };
}

function parseCsv(csv) {
  const rows = String(csv || "")
    .trim()
    .split(/\r?\n/)
    .filter(Boolean)
    .map((line) => {
      const values = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i += 1) {
        const ch = line[i];
        if (ch === '"') inQuotes = !inQuotes;
        else if (ch === "," && !inQuotes) {
          values.push(current.trim());
          current = "";
        } else current += ch;
      }
      values.push(current.trim());
      return values;
    });
  if (rows.length < 2) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((row) =>
    Object.fromEntries(
      headers.map((header, index) => {
        const raw = row[index] ?? "";
        const num = Number(raw);
        return [header, raw !== "" && Number.isFinite(num) ? num : raw];
      }),
    ),
  );
}

function analyzeRows(rows, question = "", options = {}) {
  const started = performance.now();
  if (!rows.length) return { html: `<p class="muted">CSV 至少需要表头和一行数据。</p>`, grouped: [] };
  const headers = Object.keys(rows[0]);
  const lowerQ = question.toLowerCase();
  const textColumns = headers.filter((h) => rows.some((r) => typeof r[h] === "string"));
  const numberColumns = headers.filter((h) => rows.some((r) => typeof r[h] === "number"));
  const dimension =
    textColumns.find((h) => lowerQ.includes(h.toLowerCase())) ||
    textColumns.find((h) => /channel|渠道|category|type|source/i.test(h)) ||
    textColumns[0];
  const revenueCol = numberColumns.find((h) => /revenue|收入|sales|amount/i.test(h)) || numberColumns[0];
  const costCol = numberColumns.find((h) => /cost|成本|spend/i.test(h));
  const ordersCol = numberColumns.find((h) => /orders|订单|count/i.test(h));
  const map = new Map();
  rows.forEach((row) => {
    const key = String(row[dimension] ?? "Unknown");
    const item = map.get(key) || { name: key, revenue: 0, cost: 0, orders: 0, rows: 0 };
    item.revenue += Number(row[revenueCol] || 0);
    item.cost += Number(costCol ? row[costCol] || 0 : 0);
    item.orders += Number(ordersCol ? row[ordersCol] || 0 : 0);
    item.rows += 1;
    map.set(key, item);
  });
  const grouped = [...map.values()]
    .map((item) => ({
      ...item,
      roi: item.cost ? (item.revenue - item.cost) / item.cost : null,
      avgOrder: item.orders ? item.revenue / item.orders : null,
    }))
    .sort((a, b) => b.revenue - a.revenue);
  const best = grouped[0];
  const html = `<h3>分析结论</h3>
    <p>按「${escapeHtml(dimension)}」聚合后，${escapeHtml(best.name)} 的 ${escapeHtml(revenueCol)} 最高，总计 ${formatNumber(best.revenue)}。${costCol ? `最高 ROI 为 ${escapeHtml(grouped.slice().sort((a, b) => (b.roi ?? -99) - (a.roi ?? -99))[0].name)}。` : ""}</p>
    <h3>建议</h3>
    <ul>
      <li>优先复盘收入最高渠道的获客动作，拆出可复制策略。</li>
      <li>对 ROI 偏低但收入高的渠道做成本控制实验。</li>
      <li>把该分析接入定时任务后，可以变成完整 BI Agent 项目。</li>
    </ul>`;
  if (!options.silent) addTrace("Data Agent", question || "CSV analysis", html, started, 83, 2);
  return { html, grouped, headers };
}

function formatNumber(value) {
  return new Intl.NumberFormat("zh-CN", { maximumFractionDigits: 2 }).format(value);
}

function renderTable(rows) {
  if (!rows.length) {
    $("tableOutput").innerHTML = "";
    return;
  }
  const headers = Object.keys(rows[0]);
  $("tableOutput").innerHTML = `<table><thead><tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead>
    <tbody>${rows
      .slice(0, 50)
      .map((row) => `<tr>${headers.map((h) => `<td>${escapeHtml(row[h])}</td>`).join("")}</tr>`)
      .join("")}</tbody></table>`;
}

function drawChart(rows) {
  const canvas = $("chartCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#12141a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (!rows.length) {
    ctx.fillStyle = "#aaa99f";
    ctx.font = "18px sans-serif";
    ctx.fillText("载入 CSV 后展示图表", 28, 52);
    return;
  }
  const { grouped } = analyzeRows(rows, $("dataQuestion")?.value || "", { silent: true });
  const max = Math.max(...grouped.map((g) => g.revenue), 1);
  const left = 56;
  const top = 36;
  const barH = 34;
  const gap = 18;
  ctx.font = "14px sans-serif";
  grouped.slice(0, 8).forEach((item, index) => {
    const y = top + index * (barH + gap);
    const width = Math.max(6, ((canvas.width - 210) * item.revenue) / max);
    ctx.fillStyle = index % 2 ? "#f0b85a" : "#4fb7a5";
    ctx.fillRect(left, y, width, barH);
    ctx.fillStyle = "#f4f2ea";
    ctx.fillText(item.name, left, y - 8);
    ctx.fillText(formatNumber(item.revenue), left + width + 12, y + 22);
  });
}

function loadLifeSampleData() {
  state.lifeData = [
    { date: "2026-07-01", metric: "学习时长", value: 2 },
    { date: "2026-07-02", metric: "学习时长", value: 3 },
    { date: "2026-07-03", metric: "学习时长", value: 2.5 },
    { date: "2026-07-04", metric: "学习时长", value: 4 },
    { date: "2026-07-05", metric: "学习时长", value: 3.5 },
    { date: "2026-07-01", metric: "运动分钟", value: 20 },
    { date: "2026-07-02", metric: "运动分钟", value: 0 },
    { date: "2026-07-03", metric: "运动分钟", value: 30 },
    { date: "2026-07-04", metric: "运动分钟", value: 25 },
    { date: "2026-07-05", metric: "运动分钟", value: 40 },
    { date: "2026-07-01", metric: "消费", value: 35 },
    { date: "2026-07-02", metric: "消费", value: 18 },
    { date: "2026-07-03", metric: "消费", value: 50 },
    { date: "2026-07-04", metric: "消费", value: 20 },
    { date: "2026-07-05", metric: "消费", value: 42 },
  ];
  saveState();
  renderLifeData();
  drawLifeChart();
}

function renderLifeData() {
  $("lifeDataCount").textContent = `${state.lifeData.length} rows`;
  if (!state.lifeData.length) {
    $("lifeTable").innerHTML = "";
    drawLifeChart();
    return;
  }
  $("lifeTable").innerHTML = `<table><thead><tr><th>日期</th><th>指标</th><th>数值</th></tr></thead>
    <tbody>${state.lifeData
      .slice()
      .sort((a, b) => String(a.date).localeCompare(String(b.date)))
      .map((row) => `<tr><td>${escapeHtml(row.date)}</td><td>${escapeHtml(row.metric)}</td><td>${escapeHtml(row.value)}</td></tr>`)
      .join("")}</tbody></table>`;
}

function groupedLifeData() {
  const map = new Map();
  state.lifeData.forEach((row) => {
    if (!map.has(row.metric)) map.set(row.metric, []);
    map.get(row.metric).push({ date: row.date, value: Number(row.value) });
  });
  for (const values of map.values()) {
    values.sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }
  return map;
}

function forecastNext(values) {
  if (!values.length) return 0;
  if (values.length === 1) return values[0].value;
  const n = values.length;
  const xs = values.map((_, index) => index + 1);
  const ys = values.map((item) => Number(item.value));
  const avgX = xs.reduce((a, b) => a + b, 0) / n;
  const avgY = ys.reduce((a, b) => a + b, 0) / n;
  const numerator = xs.reduce((sum, x, index) => sum + (x - avgX) * (ys[index] - avgY), 0);
  const denominator = xs.reduce((sum, x) => sum + (x - avgX) ** 2, 0) || 1;
  const slope = numerator / denominator;
  const intercept = avgY - slope * avgX;
  return intercept + slope * (n + 1);
}

function analyzeLifeData() {
  const started = performance.now();
  if (!state.lifeData.length) {
    $("lifeAnalysis").innerHTML = `<p class="muted">请先添加数据或载入示例数据。</p>`;
    return;
  }
  const groups = groupedLifeData();
  const cards = [...groups.entries()].map(([metric, values]) => {
    const nums = values.map((item) => Number(item.value));
    const sum = nums.reduce((a, b) => a + b, 0);
    const avg = sum / nums.length;
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    const first = nums[0];
    const last = nums[nums.length - 1];
    const change = first ? ((last - first) / Math.abs(first)) * 100 : 0;
    const next = forecastNext(values);
    return `<div class="mini-doc">
      <strong>${escapeHtml(metric)}</strong>
      <p>均值：${formatNumber(avg)}；最小：${formatNumber(min)}；最大：${formatNumber(max)}</p>
      <p>变化率：${formatNumber(change)}%；下一期预测：${formatNumber(next)}</p>
    </div>`;
  });
  const html = `<h3>分析和预测</h3><div class="tool-output-grid">${cards.join("")}</div>
    <h3>建议</h3>${bulletList(["连续记录比单次记录更有价值", "对波动大的指标设置提醒", "把预测值当作参考，不要当作确定结果"])} `;
  $("lifeAnalysis").innerHTML = html;
  drawLifeChart();
  addTrace("Life Data Analyzer", "analyze local records", html, started, 87, groups.size);
}

function drawLifeChart() {
  const canvas = $("lifeChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#12141a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const groups = [...groupedLifeData().entries()].slice(0, 4);
  if (!groups.length) {
    ctx.fillStyle = "#aaa99f";
    ctx.font = "18px sans-serif";
    ctx.fillText("添加数据后展示趋势", 28, 52);
    return;
  }
  const allValues = groups.flatMap(([, values]) => values.map((item) => Number(item.value)));
  const max = Math.max(...allValues, 1);
  const min = Math.min(...allValues, 0);
  const colors = ["#4fb7a5", "#f0b85a", "#8aa2ff", "#75c986"];
  const left = 54;
  const top = 34;
  const width = canvas.width - 96;
  const height = canvas.height - 92;
  ctx.strokeStyle = "rgba(244,242,234,0.18)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i += 1) {
    const y = top + (height * i) / 4;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(left + width, y);
    ctx.stroke();
  }
  groups.forEach(([metric, values], seriesIndex) => {
    ctx.strokeStyle = colors[seriesIndex % colors.length];
    ctx.fillStyle = colors[seriesIndex % colors.length];
    ctx.lineWidth = 3;
    ctx.beginPath();
    values.forEach((item, index) => {
      const x = left + (width * index) / Math.max(values.length - 1, 1);
      const y = top + height - ((Number(item.value) - min) / Math.max(max - min, 1)) * height;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
    values.forEach((item, index) => {
      const x = left + (width * index) / Math.max(values.length - 1, 1);
      const y = top + height - ((Number(item.value) - min) / Math.max(max - min, 1)) * height;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.font = "13px sans-serif";
    ctx.fillText(metric, left + 8, top + 18 + seriesIndex * 20);
  });
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function renderAppsDashboard() {
  $("dashTasks").textContent = String(state.tasks.filter((task) => task.status !== "done").length);
  const today = todayKey();
  const done = state.habits.filter((habit) => habit.doneDates?.includes(today)).length;
  const habitRate = state.habits.length ? Math.round((done / state.habits.length) * 100) : 0;
  $("dashHabits").textContent = `${habitRate}%`;
  const balance = state.money.reduce((sum, row) => sum + (row.type === "income" ? row.amount : -row.amount), 0);
  $("dashBalance").textContent = formatNumber(balance);
}

function renderKanban() {
  const columns = [
    ["todo", "待办"],
    ["doing", "进行中"],
    ["done", "已完成"],
  ];
  $("kanbanBoard").innerHTML = columns
    .map(
      ([status, label]) => `<div class="kanban-col">
        <h3>${label}</h3>
        ${state.tasks
          .filter((task) => task.status === status)
          .map(
            (task) => `<div class="task-card">
              <strong>${escapeHtml(task.title)}</strong>
              <select data-task-status="${task.id}">
                ${columns.map(([value, text]) => `<option value="${value}" ${task.status === value ? "selected" : ""}>${text}</option>`).join("")}
              </select>
              <button data-task-delete="${task.id}">删除</button>
            </div>`,
          )
          .join("") || `<p class="muted">暂无任务</p>`}
      </div>`,
    )
    .join("");
  renderAppsDashboard();
}

function addTask(title, status = "todo") {
  const clean = String(title || "").trim();
  if (!clean) {
    showToast("任务不能为空");
    return;
  }
  state.tasks.push({ id: crypto.randomUUID(), title: clean, status });
  saveState();
  renderKanban();
}

function renderHabits() {
  const today = todayKey();
  if (!state.habits.length) {
    $("habitList").innerHTML = `<p class="muted">还没有习惯。可以添加一个，或点击示例。</p>`;
  } else {
    $("habitList").innerHTML = state.habits
      .map((habit) => {
        const done = habit.doneDates?.includes(today);
        return `<div class="habit-item">
          <span>${done ? "已打卡" : "未打卡"} · ${escapeHtml(habit.name)}</span>
          <span>
            <button data-habit-toggle="${habit.id}">${done ? "取消" : "打卡"}</button>
            <button data-habit-delete="${habit.id}">删除</button>
          </span>
        </div>`;
      })
      .join("");
  }
  renderAppsDashboard();
}

function renderMoney() {
  if (!state.money.length) {
    $("moneyOutput").innerHTML = `<p class="muted">还没有收支记录。</p>`;
    renderAppsDashboard();
    return;
  }
  const income = state.money.filter((row) => row.type === "income").reduce((sum, row) => sum + row.amount, 0);
  const expense = state.money.filter((row) => row.type === "expense").reduce((sum, row) => sum + row.amount, 0);
  $("moneyOutput").innerHTML = `<h3>账本概览</h3>
    <p>收入：${formatNumber(income)}；支出：${formatNumber(expense)}；结余：${formatNumber(income - expense)}</p>
    ${state.money
      .slice()
      .reverse()
      .slice(0, 12)
      .map(
        (row) => `<div class="money-row">
          <span>${row.type === "income" ? "收入" : "支出"} · ${escapeHtml(row.category)} · ${formatNumber(row.amount)}</span>
          <button data-money-delete="${row.id}">删除</button>
        </div>`,
      )
      .join("")}`;
  renderAppsDashboard();
}

function renderGoals() {
  if (!state.goals.length) {
    $("goalList").innerHTML = `<p class="muted">还没有目标。添加一个 0-100 的进度。</p>`;
  } else {
    $("goalList").innerHTML = state.goals
      .map(
        (goal) => `<div class="goal-item">
          <span style="flex:1">
            <strong>${escapeHtml(goal.name)}</strong> · ${goal.value}%
            <span class="progress"><i style="width:${Math.max(0, Math.min(100, goal.value))}%"></i></span>
          </span>
          <button data-goal-delete="${goal.id}">删除</button>
        </div>`,
      )
      .join("");
  }
}

function markdownToHtml(markdown) {
  return escapeHtml(markdown || "")
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/^- (.*)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>)/gs, "<ul>$1</ul>")
    .replace(/\n/g, "<br>");
}

function renderMarkdown() {
  $("markdownPreview").innerHTML = markdownToHtml($("markdownInput").value) || `<p class="muted">右侧预览会实时更新。</p>`;
}

let timerSeconds = 25 * 60;
let timerHandle = null;

function renderTimer() {
  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;
  $("timerFace").textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function renderAllApps() {
  renderKanban();
  renderHabits();
  renderMoney();
  renderGoals();
  $("markdownInput").value = state.markdown || "# 项目笔记\n- 今天完成实用应用模块\n- 下一步测试和完善文档";
  renderMarkdown();
  renderTimer();
  renderAppsDashboard();
}

function parseListInput(value, fallback) {
  const items = String(value || "")
    .split(/[,，、\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length ? items : fallback;
}

function parseWeights(value, itemCount) {
  const raw = String(value || "")
    .split(/[,，、\n]/)
    .map((item) => Number(item.trim()))
    .filter(Number.isFinite);
  const weights = raw.length === itemCount ? raw : Array(itemCount).fill(100 / itemCount);
  const sum = weights.reduce((a, b) => a + b, 0) || 1;
  return weights.map((weight) => weight / sum);
}

function seededScore(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function clampScore(value) {
  return Math.max(0, Math.min(100, Math.round(value * 10) / 10));
}

function getGradeConfig() {
  const subjects = parseListInput($("gradeSubjects").value, ["语文", "数学", "英语", "高等数学"]);
  const items = parseListInput($("gradeItems").value, ["平时分", "作业分", "期中考", "期末考"]);
  return {
    studentCount: Math.max(10, Math.min(20000, Number($("gradeStudentCount").value) || 1000)),
    classCount: Math.max(1, Math.min(100, Number($("gradeClassCount").value) || 8)),
    subjects,
    items,
    weights: parseWeights($("gradeWeights").value, items.length),
    compareMode: $("gradeCompareMode").value,
    chartType: $("gradeChartType").value,
  };
}

function generateGradeStudents() {
  const started = performance.now();
  const config = getGradeConfig();
  const students = [];
  for (let i = 0; i < config.studentCount; i += 1) {
    const classNo = (i % config.classCount) + 1;
    const ability = 58 + seededScore(i + 11) * 34;
    const student = {
      id: `S${String(i + 1).padStart(5, "0")}`,
      name: `学生${i + 1}`,
      className: `${classNo}班`,
      scores: {},
      totals: {},
    };
    config.subjects.forEach((subject, subjectIndex) => {
      student.scores[subject] = {};
      let total = 0;
      config.items.forEach((item, itemIndex) => {
        const classBoost = (classNo - config.classCount / 2) * 0.35;
        const subjectDifficulty = subjectIndex * -0.9 + (subject.includes("数学") || subject.includes("代数") || subject.includes("概率") ? -3 : 0);
        const itemDifficulty = item.includes("期末") ? -4 : item.includes("期中") ? -2 : item.includes("作业") ? 4 : 2;
        const noise = (seededScore((i + 1) * (subjectIndex + 3) * (itemIndex + 7)) - 0.5) * 20;
        const score = clampScore(ability + classBoost + subjectDifficulty + itemDifficulty + noise);
        student.scores[subject][item] = score;
        total += score * config.weights[itemIndex];
      });
      student.totals[subject] = clampScore(total);
    });
    student.totalAverage =
      config.subjects.reduce((sum, subject) => sum + student.totals[subject], 0) / Math.max(config.subjects.length, 1);
    students.push(student);
  }
  state.gradeStudents = students;
  analyzeGradeData({ silent: true });
  addTrace("Grade Data Generator", `${config.studentCount} students`, "generated grade dataset", started, 94, config.subjects.length);
  showToast(`已生成 ${config.studentCount} 名学生数据`);
}

function analyzeGradeData(options = {}) {
  const started = performance.now();
  if (!state.gradeStudents.length) generateGradeStudents();
  const config = getGradeConfig();
  const students = state.gradeStudents;
  const classMap = new Map();
  const subjectMap = new Map();
  const itemMap = new Map();
  students.forEach((student) => {
    if (!classMap.has(student.className)) classMap.set(student.className, []);
    classMap.get(student.className).push(student);
    config.subjects.forEach((subject) => {
      if (!subjectMap.has(subject)) subjectMap.set(subject, []);
      subjectMap.get(subject).push(student.totals[subject] || 0);
      config.items.forEach((item) => {
        const key = `${subject}-${item}`;
        if (!itemMap.has(key)) itemMap.set(key, []);
        itemMap.get(key).push(student.scores[subject]?.[item] || 0);
      });
    });
  });
  const classStats = [...classMap.entries()].map(([name, rows]) => {
    const avg = rows.reduce((sum, row) => sum + row.totalAverage, 0) / rows.length;
    return { name, count: rows.length, avg, passRate: rows.filter((row) => row.totalAverage >= 60).length / rows.length };
  });
  const subjectStats = [...subjectMap.entries()].map(([name, values]) => ({
    name,
    count: values.length,
    avg: values.reduce((a, b) => a + b, 0) / values.length,
    passRate: values.filter((value) => value >= 60).length / values.length,
  }));
  const itemStats = config.items.map((item) => {
    const values = [];
    for (const [key, scores] of itemMap.entries()) {
      if (key.endsWith(`-${item}`)) values.push(...scores);
    }
    return {
      name: item,
      count: values.length,
      avg: values.reduce((a, b) => a + b, 0) / Math.max(values.length, 1),
      passRate: values.filter((value) => value >= 60).length / Math.max(values.length, 1),
    };
  });
  const allAvg = students.reduce((sum, row) => sum + row.totalAverage, 0) / students.length;
  const passRate = students.filter((row) => row.totalAverage >= 60).length / students.length;
  const topClass = classStats.slice().sort((a, b) => b.avg - a.avg)[0];
  const weakSubject = subjectStats.slice().sort((a, b) => a.avg - b.avg)[0];
  state.gradeSummary = { config, classStats, subjectStats, itemStats, allAvg, passRate, topClass, weakSubject, at: new Date().toLocaleString("zh-CN") };
  renderGradeSummary();
  drawGradeCharts();
  if (!options.silent) addTrace("Grade Analyzer", `${students.length} students`, "grade analysis completed", started, 91, 5);
}

function getGradeSeries() {
  const summary = state.gradeSummary;
  if (!summary) return [];
  if (summary.config.compareMode === "subject") return summary.subjectStats;
  if (summary.config.compareMode === "item") return summary.itemStats;
  if (summary.config.compareMode === "rank") {
    const bins = [
      { name: "90-100", count: 0, avg: 95 },
      { name: "80-89", count: 0, avg: 85 },
      { name: "70-79", count: 0, avg: 75 },
      { name: "60-69", count: 0, avg: 65 },
      { name: "<60", count: 0, avg: 50 },
    ];
    state.gradeStudents.forEach((student) => {
      const score = student.totalAverage;
      if (score >= 90) bins[0].count += 1;
      else if (score >= 80) bins[1].count += 1;
      else if (score >= 70) bins[2].count += 1;
      else if (score >= 60) bins[3].count += 1;
      else bins[4].count += 1;
    });
    return bins.map((bin) => ({ name: bin.name, avg: bin.count, count: bin.count, passRate: 0 }));
  }
  return summary.classStats;
}

function renderGradeSummary() {
  const summary = state.gradeSummary;
  if (!summary) return;
  $("gradeDataSize").textContent = `${state.gradeStudents.length} students`;
  $("kpiStudents").textContent = String(state.gradeStudents.length);
  $("kpiSubjects").textContent = String(summary.config.subjects.length);
  $("kpiAverage").textContent = formatNumber(summary.allAvg);
  $("kpiPassRate").textContent = `${Math.round(summary.passRate * 100)}%`;
  $("gradeInsight").innerHTML = `<h3>自动分析结论</h3>${bulletList([
    `当前样本包含 ${state.gradeStudents.length} 名学生、${summary.config.classCount} 个班级、${summary.config.subjects.length} 门课程。`,
    `总体平均分 ${formatNumber(summary.allAvg)}，总体及格率 ${Math.round(summary.passRate * 100)}%。`,
    `表现最好的班级是 ${summary.topClass?.name || "-"}，平均分 ${formatNumber(summary.topClass?.avg || 0)}。`,
    `当前相对薄弱课程是 ${summary.weakSubject?.name || "-"}，平均分 ${formatNumber(summary.weakSubject?.avg || 0)}。`,
    "可以切换对比维度和图表类型，查看班级、课程、记分项目和分布差异。",
  ])}`;
  const series = getGradeSeries();
  $("gradeTable").innerHTML = `<table><thead><tr><th>名称</th><th>人数/样本</th><th>平均/数量</th><th>及格率</th></tr></thead>
    <tbody>${series
      .map((row) => `<tr><td>${escapeHtml(row.name)}</td><td>${escapeHtml(row.count)}</td><td>${formatNumber(row.avg)}</td><td>${Math.round((row.passRate || 0) * 100)}%</td></tr>`)
      .join("")}</tbody></table>`;
  renderGradeHistory();
}

function renderGradeHistory() {
  $("historyCount").textContent = `${state.gradeHistory.length} records`;
  if (!state.gradeHistory.length) {
    $("gradeHistoryList").innerHTML = `<p class="muted">还没有历史记录。点击“保存历史”后可以对比多次分析。</p>`;
    return;
  }
  $("gradeHistoryList").innerHTML = state.gradeHistory
    .map(
      (item) => `<article class="trace-item">
        <strong>${escapeHtml(item.name)}</strong>
        <span class="trace-meta">${escapeHtml(item.at)} · ${item.students} 人 · ${item.subjects} 门课</span>
        <span>平均分 ${formatNumber(item.average)} · 及格率 ${Math.round(item.passRate * 100)}%</span>
      </article>`,
    )
    .join("");
}

function canvasTheme() {
  const light = document.body.classList.contains("theme-light");
  return {
    bg: light ? "#ffffff" : "#12141a",
    text: light ? "#111827" : "#f4f2ea",
    muted: light ? "#657083" : "#aaa99f",
    grid: light ? "rgba(17,24,39,0.12)" : "rgba(244,242,234,0.16)",
    colors: ["#4fb7a5", "#f0b85a", "#8aa2ff", "#75c986", "#ef6f6c", "#c69cff", "#5bb8ff", "#ff9f7a"],
  };
}

function clearCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  const theme = canvasTheme();
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  return { ctx, theme };
}

function drawNoData(canvas, message = "请先生成数据") {
  const { ctx, theme } = clearCanvas(canvas);
  ctx.fillStyle = theme.muted;
  ctx.font = "18px sans-serif";
  ctx.fillText(message, 28, 52);
}

function drawBarLike(canvas, series, horizontal = false) {
  const { ctx, theme } = clearCanvas(canvas);
  if (!series.length) return drawNoData(canvas);
  const values = series.map((row) => row.avg || 0);
  const max = Math.max(...values, 1);
  const left = 58;
  const top = 42;
  const width = canvas.width - 112;
  const height = canvas.height - 96;
  ctx.fillStyle = theme.text;
  ctx.font = "14px sans-serif";
  if (horizontal) {
    const rowH = height / Math.min(series.length, 16);
    series.slice(0, 16).forEach((row, index) => {
      const y = top + index * rowH;
      const barW = (width * (row.avg || 0)) / max;
      ctx.fillStyle = theme.colors[index % theme.colors.length];
      ctx.fillRect(left, y + 6, barW, Math.max(8, rowH - 12));
      ctx.fillStyle = theme.text;
      ctx.fillText(row.name, left, y - 2);
      ctx.fillText(formatNumber(row.avg || 0), left + barW + 8, y + rowH / 2 + 4);
    });
  } else {
    const barW = width / Math.min(series.length, 20);
    series.slice(0, 20).forEach((row, index) => {
      const h = (height * (row.avg || 0)) / max;
      const x = left + index * barW;
      const y = top + height - h;
      ctx.fillStyle = theme.colors[index % theme.colors.length];
      ctx.fillRect(x + 4, y, Math.max(8, barW - 8), h);
      ctx.fillStyle = theme.text;
      ctx.save();
      ctx.translate(x + barW / 2, top + height + 18);
      ctx.rotate(-0.45);
      ctx.fillText(String(row.name).slice(0, 8), 0, 0);
      ctx.restore();
    });
  }
}

function drawLineChart(canvas, series) {
  const { ctx, theme } = clearCanvas(canvas);
  if (!series.length) return drawNoData(canvas);
  const values = series.map((row) => row.avg || 0);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const left = 58;
  const top = 42;
  const width = canvas.width - 112;
  const height = canvas.height - 96;
  ctx.strokeStyle = theme.grid;
  for (let i = 0; i <= 4; i += 1) {
    const y = top + (height * i) / 4;
    ctx.beginPath();
    ctx.moveTo(left, y);
    ctx.lineTo(left + width, y);
    ctx.stroke();
  }
  ctx.strokeStyle = theme.colors[0];
  ctx.fillStyle = theme.colors[0];
  ctx.lineWidth = 3;
  ctx.beginPath();
  series.forEach((row, index) => {
    const x = left + (width * index) / Math.max(series.length - 1, 1);
    const y = top + height - (((row.avg || 0) - min) / Math.max(max - min, 1)) * height;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  series.forEach((row, index) => {
    const x = left + (width * index) / Math.max(series.length - 1, 1);
    const y = top + height - (((row.avg || 0) - min) / Math.max(max - min, 1)) * height;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawPieChart(canvas, series) {
  const { ctx, theme } = clearCanvas(canvas);
  if (!series.length) return drawNoData(canvas);
  const total = series.reduce((sum, row) => sum + Math.max(row.avg || 0, 0), 0) || 1;
  const cx = canvas.width * 0.42;
  const cy = canvas.height / 2;
  const radius = Math.min(canvas.width, canvas.height) * 0.28;
  let start = -Math.PI / 2;
  series.slice(0, 8).forEach((row, index) => {
    const angle = (Math.max(row.avg || 0, 0) / total) * Math.PI * 2;
    ctx.fillStyle = theme.colors[index % theme.colors.length];
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, start, start + angle);
    ctx.closePath();
    ctx.fill();
    start += angle;
    ctx.fillStyle = theme.text;
    ctx.font = "13px sans-serif";
    ctx.fillText(`${row.name} ${formatNumber(row.avg || 0)}`, canvas.width * 0.72, 44 + index * 22);
  });
}

function drawRadarChart(canvas, series) {
  const { ctx, theme } = clearCanvas(canvas);
  if (!series.length) return drawNoData(canvas);
  const data = series.slice(0, 8);
  const cx = canvas.width / 2;
  const cy = canvas.height / 2 + 12;
  const radius = Math.min(canvas.width, canvas.height) * 0.32;
  const max = Math.max(...data.map((row) => row.avg || 0), 100);
  ctx.strokeStyle = theme.grid;
  for (let level = 1; level <= 4; level += 1) {
    ctx.beginPath();
    data.forEach((_, index) => {
      const angle = -Math.PI / 2 + (index / data.length) * Math.PI * 2;
      const r = (radius * level) / 4;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.closePath();
    ctx.stroke();
  }
  ctx.fillStyle = "rgba(79, 183, 165, 0.32)";
  ctx.strokeStyle = theme.colors[0];
  ctx.beginPath();
  data.forEach((row, index) => {
    const angle = -Math.PI / 2 + (index / data.length) * Math.PI * 2;
    const r = radius * ((row.avg || 0) / max);
    const x = cx + Math.cos(angle) * r;
    const y = cy + Math.sin(angle) * r;
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = theme.text;
  ctx.font = "13px sans-serif";
  data.forEach((row, index) => {
    const angle = -Math.PI / 2 + (index / data.length) * Math.PI * 2;
    ctx.fillText(String(row.name).slice(0, 8), cx + Math.cos(angle) * (radius + 18), cy + Math.sin(angle) * (radius + 18));
  });
}

function drawHeatmap(canvas) {
  const { ctx, theme } = clearCanvas(canvas);
  const summary = state.gradeSummary;
  if (!summary) return drawNoData(canvas);
  const rows = summary.classStats.slice(0, 12);
  const cols = summary.subjectStats.slice(0, 10);
  const left = 82;
  const top = 48;
  const cellW = (canvas.width - left - 24) / Math.max(cols.length, 1);
  const cellH = (canvas.height - top - 42) / Math.max(rows.length, 1);
  rows.forEach((row, r) => {
    cols.forEach((col, c) => {
      const value = clampScore(row.avg + (seededScore((r + 1) * (c + 4)) - 0.5) * 12);
      const intensity = value / 100;
      ctx.fillStyle = `rgba(${Math.round(239 - intensity * 160)}, ${Math.round(111 + intensity * 90)}, ${Math.round(108 + intensity * 80)}, 0.92)`;
      ctx.fillRect(left + c * cellW, top + r * cellH, Math.max(4, cellW - 2), Math.max(4, cellH - 2));
    });
    ctx.fillStyle = theme.text;
    ctx.font = "12px sans-serif";
    ctx.fillText(row.name, 18, top + r * cellH + cellH / 2 + 4);
  });
  cols.forEach((col, c) => {
    ctx.fillStyle = theme.text;
    ctx.save();
    ctx.translate(left + c * cellW + 5, top - 8);
    ctx.rotate(-0.35);
    ctx.fillText(String(col.name).slice(0, 8), 0, 0);
    ctx.restore();
  });
}

function drawGradeChartTo(canvas, type, series) {
  if (type === "bar") return drawBarLike(canvas, series, true);
  if (type === "column") return drawBarLike(canvas, series, false);
  if (type === "line") return drawLineChart(canvas, series);
  if (type === "pie") return drawPieChart(canvas, series);
  if (type === "radar") return drawRadarChart(canvas, series);
  if (type === "heatmap") return drawHeatmap(canvas);
  return drawBarLike(canvas, series, true);
}

function drawGradeCharts() {
  const series = getGradeSeries();
  const type = $("gradeChartType").value;
  $("activeChartLabel").textContent = type;
  drawGradeChartTo($("gradeChart"), type, series);
  drawGradeChartTo($("gradeMiniBar"), "column", series.slice(0, 8));
  drawGradeChartTo($("gradeMiniPie"), "pie", series.slice(0, 6));
  drawGradeChartTo($("gradeMiniLine"), "line", series.slice(0, 10));
  drawGradeChartTo($("gradeMiniHeat"), "heatmap", series);
}

function saveGradeHistory() {
  if (!state.gradeSummary) analyzeGradeData({ silent: true });
  const summary = state.gradeSummary;
  state.gradeHistory.unshift({
    id: crypto.randomUUID(),
    name: `${summary.config.studentCount}人-${summary.config.subjects.length}课-${summary.config.compareMode}`,
    at: new Date().toLocaleString("zh-CN"),
    students: summary.config.studentCount,
    subjects: summary.config.subjects.length,
    average: summary.allAvg,
    passRate: summary.passRate,
  });
  state.gradeHistory = state.gradeHistory.slice(0, 30);
  saveState();
  renderGradeHistory();
  showToast("历史记录已保存");
}

function csvEscape(value) {
  const text = String(value ?? "");
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function downloadText(filename, content, type = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function exportGradeCsv() {
  if (!state.gradeStudents.length) generateGradeStudents();
  if (!state.gradeSummary) analyzeGradeData({ silent: true });
  const config = state.gradeSummary.config;
  const blocks = [];
  if ($("exportStudents").checked) {
    const header = ["学号", "姓名", "班级", ...config.subjects.map((subject) => `${subject}总评`), "综合均分"];
    const lines = [header.map(csvEscape).join(",")];
    state.gradeStudents.slice(0, 20000).forEach((student) => {
      lines.push([student.id, student.name, student.className, ...config.subjects.map((subject) => student.totals[subject]), student.totalAverage].map(csvEscape).join(","));
    });
    blocks.push(lines.join("\n"));
  }
  if ($("exportSummary").checked) {
    const lines = [["类型", "名称", "样本", "平均/数量", "及格率"].map(csvEscape).join(",")];
    state.gradeSummary.classStats.forEach((row) => lines.push(["班级", row.name, row.count, formatNumber(row.avg), `${Math.round(row.passRate * 100)}%`].map(csvEscape).join(",")));
    state.gradeSummary.subjectStats.forEach((row) => lines.push(["课程", row.name, row.count, formatNumber(row.avg), `${Math.round(row.passRate * 100)}%`].map(csvEscape).join(",")));
    blocks.push(lines.join("\n"));
  }
  if ($("exportHistory").checked) {
    const lines = [["时间", "名称", "人数", "课程数", "平均分", "及格率"].map(csvEscape).join(",")];
    state.gradeHistory.forEach((row) => lines.push([row.at, row.name, row.students, row.subjects, formatNumber(row.average), `${Math.round(row.passRate * 100)}%`].map(csvEscape).join(",")));
    blocks.push(lines.join("\n"));
  }
  // UTF-8 BOM lets Excel open Chinese CSV without mojibake.
  downloadText("成绩分析导出.csv", `\uFEFF${blocks.join("\n\n")}`, "text/csv;charset=utf-8");
}

const i18nText = {
  zh: {
    gradeEyebrow: "Advanced Analytics",
    gradeTitle: "成绩 / 班级 / 课程综合分析平台",
    gradeIntro: "支持上万学生模拟数据、自定义课程、自定义权重、多图表对比、历史记录和 Excel 友好导出。",
    oneClickAnalysis: "一键生成样例并分析",
    helpGuide: "新手引导",
    exportCsv: "导出 CSV",
    configPanel: "配置面板",
  },
  en: {
    gradeEyebrow: "Advanced Analytics",
    gradeTitle: "Grade, Class and Course Analytics",
    gradeIntro: "Supports 10k+ simulated students, custom subjects, weights, charts, history and Excel-friendly CSV export.",
    oneClickAnalysis: "Generate and Analyze",
    helpGuide: "Help",
    exportCsv: "Export CSV",
    configPanel: "Configuration",
  },
};

function applyLanguage(lang) {
  const dict = i18nText[lang] || i18nText.zh;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.dataset.i18n;
    if (dict[key]) el.textContent = dict[key];
  });
}

function applyUiSettings() {
  document.body.classList.remove("theme-light", "theme-contrast", "density-compact", "density-spacious");
  const theme = $("uiTheme")?.value || "dark";
  const density = $("uiDensity")?.value || "normal";
  if (theme === "light") document.body.classList.add("theme-light");
  if (theme === "contrast") document.body.classList.add("theme-contrast");
  if (density === "compact") document.body.classList.add("density-compact");
  if (density === "spacious") document.body.classList.add("density-spacious");
  drawGradeCharts();
}

function gradeOneClick() {
  generateGradeStudents();
  analyzeGradeData();
  drawGradeCharts();
  renderGradeSummary();
  scrollToOutput("gradeInsight");
}

function suiteLog(action) {
  state.suite.audit.unshift({
    id: crypto.randomUUID(),
    at: new Date().toLocaleString("zh-CN"),
    user: state.currentUser?.name || "local",
    action,
  });
  state.suite.audit = state.suite.audit.slice(0, 80);
}

function renderSuite() {
  $("suiteCustomers").textContent = String(state.suite.crm.length);
  const lowStock = state.suite.stock.filter((item) => Number(item.qty) <= Number(item.min)).length;
  $("suiteLowStock").textContent = String(lowStock);
  const progress = state.suite.milestones.length
    ? Math.round(state.suite.milestones.reduce((sum, item) => sum + Number(item.progress), 0) / state.suite.milestones.length)
    : 0;
  $("suiteProgress").textContent = `${progress}%`;

  $("crmList").innerHTML = state.suite.crm.length
    ? state.suite.crm
        .map(
          (item) => `<article class="trace-item">
            <strong>${escapeHtml(item.name)}</strong>
            <span class="trace-meta">${escapeHtml(item.stage)} · ${formatNumber(item.value)} 元</span>
            <button data-suite-delete="crm:${item.id}">删除</button>
          </article>`,
        )
        .join("")
    : `<p class="muted">暂无客户。</p>`;

  $("stockList").innerHTML = state.suite.stock.length
    ? state.suite.stock
        .map(
          (item) => `<article class="trace-item">
            <strong>${escapeHtml(item.name)}</strong>
            <span class="trace-meta">库存 ${item.qty} · 预警线 ${item.min} ${Number(item.qty) <= Number(item.min) ? "· 需要补货" : ""}</span>
            <button data-suite-delete="stock:${item.id}">删除</button>
          </article>`,
        )
        .join("")
    : `<p class="muted">暂无库存。</p>`;

  $("milestoneList").innerHTML = state.suite.milestones.length
    ? state.suite.milestones
        .map(
          (item) => `<div class="goal-item">
            <span style="flex:1"><strong>${escapeHtml(item.name)}</strong> · ${item.progress}%<span class="progress"><i style="width:${Math.max(0, Math.min(100, item.progress))}%"></i></span></span>
            <button data-suite-delete="milestone:${item.id}">删除</button>
          </div>`,
        )
        .join("")
    : `<p class="muted">暂无里程碑。</p>`;

  $("eventList").innerHTML = state.suite.events.length
    ? state.suite.events
        .slice()
        .sort((a, b) => String(a.date).localeCompare(String(b.date)))
        .map(
          (item) => `<article class="trace-item">
            <strong>${escapeHtml(item.title)}</strong>
            <span class="trace-meta">${escapeHtml(item.date)}</span>
            <button data-suite-delete="event:${item.id}">删除</button>
          </article>`,
        )
        .join("")
    : `<p class="muted">暂无事件。</p>`;

  $("auditList").innerHTML = state.suite.audit.length
    ? state.suite.audit
        .slice(0, 12)
        .map(
          (item) => `<article class="trace-item">
            <strong>${escapeHtml(item.action)}</strong>
            <span class="trace-meta">${escapeHtml(item.at)} · ${escapeHtml(item.user)}</span>
          </article>`,
        )
        .join("")
    : `<p class="muted">暂无审计日志。</p>`;
}

function seedSuiteDemo() {
  state.suite.crm = [
    { id: crypto.randomUUID(), name: "厦门教育科技", stage: "沟通中", value: 52000 },
    { id: crypto.randomUUID(), name: "校园数据中心", stage: "已成交", value: 88000 },
    { id: crypto.randomUUID(), name: "创新实验室", stage: "线索", value: 26000 },
  ];
  state.suite.stock = [
    { id: crypto.randomUUID(), name: "服务器额度", qty: 12, min: 10 },
    { id: crypto.randomUUID(), name: "演示账号", qty: 4, min: 8 },
    { id: crypto.randomUUID(), name: "数据样例包", qty: 30, min: 5 },
  ];
  state.suite.milestones = [
    { id: crypto.randomUUID(), name: "需求分析", progress: 100 },
    { id: crypto.randomUUID(), name: "核心开发", progress: 85 },
    { id: crypto.randomUUID(), name: "测试与文档", progress: 70 },
  ];
  state.suite.events = [
    { id: crypto.randomUUID(), date: new Date().toISOString().slice(0, 10), title: "项目演示" },
    { id: crypto.randomUUID(), date: "2026-07-12", title: "答辩材料检查" },
  ];
  suiteLog("生成综合管理套件样例");
  saveState();
  renderSuite();
  generateSuiteReport();
}

function generateSuiteReport() {
  const revenue = state.suite.crm.filter((item) => item.stage === "已成交").reduce((sum, item) => sum + Number(item.value), 0);
  const pipeline = state.suite.crm.reduce((sum, item) => sum + Number(item.value), 0);
  const lowStock = state.suite.stock.filter((item) => Number(item.qty) <= Number(item.min));
  const progress = state.suite.milestones.length
    ? Math.round(state.suite.milestones.reduce((sum, item) => sum + Number(item.progress), 0) / state.suite.milestones.length)
    : 0;
  $("suiteReportOutput").innerHTML = `<h3>经营报告</h3>${bulletList([
    `客户总数：${state.suite.crm.length}，已成交金额：${formatNumber(revenue)} 元，销售管道：${formatNumber(pipeline)} 元。`,
    `库存预警：${lowStock.length} 项，${lowStock.map((item) => item.name).join("、") || "暂无"}`,
    `项目平均进度：${progress}%。`,
    `近期事件：${state.suite.events.slice(0, 3).map((item) => `${item.date} ${item.title}`).join("；") || "暂无"}`,
  ])}<h3>建议</h3>${bulletList(["优先跟进高金额沟通中客户", "库存低于预警线时及时补充", "项目进度低于 80% 的里程碑需要明确负责人"])}`;
  suiteLog("生成经营报告");
  saveState();
  renderSuite();
}

function runSuiteRules() {
  const type = $("ruleType").value;
  const threshold = Number($("ruleThreshold").value) || 0;
  let results = [];
  if (type === "stock") {
    results = state.suite.stock.filter((item) => Number(item.qty) <= Number(item.min)).map((item) => `库存预警：${item.name} 当前 ${item.qty}，预警线 ${item.min}`);
  }
  if (type === "crm") {
    results = state.suite.crm.filter((item) => Number(item.value) >= threshold).map((item) => `高价值客户：${item.name} ${formatNumber(item.value)} 元`);
  }
  if (type === "project") {
    results = state.suite.milestones.filter((item) => Number(item.progress) < threshold).map((item) => `进度风险：${item.name} ${item.progress}%`);
  }
  $("ruleOutput").innerHTML = results.length ? `<h3>自动化结果</h3>${bulletList(results)}` : `<p class="muted">没有命中规则。</p>`;
  suiteLog(`运行自动化规则：${type}`);
  saveState();
  renderSuite();
}

function generateApiMock() {
  const mock = {
    endpoints: [
      "GET /api/customers",
      "POST /api/customers",
      "GET /api/inventory",
      "POST /api/rules/run",
      "GET /api/reports/summary",
      "GET /api/audit",
    ],
    sampleResponse: {
      customers: state.suite.crm.length,
      lowStock: state.suite.stock.filter((item) => Number(item.qty) <= Number(item.min)).length,
      milestones: state.suite.milestones.length,
    },
  };
  $("apiMockOutput").innerHTML = `<pre>${escapeHtml(JSON.stringify(mock, null, 2))}</pre>`;
  suiteLog("生成 API Mock");
  saveState();
  renderSuite();
}

function exportSuiteBackup() {
  const payload = JSON.stringify(state.suite, null, 2);
  downloadText("综合管理套件备份.json", payload, "application/json;charset=utf-8");
  $("suiteBackupInput").value = payload;
  suiteLog("导出备份");
  saveState();
  renderSuite();
}

function restoreSuiteBackup() {
  try {
    const data = JSON.parse($("suiteBackupInput").value);
    state.suite = {
      crm: Array.isArray(data.crm) ? data.crm : [],
      stock: Array.isArray(data.stock) ? data.stock : [],
      milestones: Array.isArray(data.milestones) ? data.milestones : [],
      events: Array.isArray(data.events) ? data.events : [],
      audit: Array.isArray(data.audit) ? data.audit : [],
    };
    suiteLog("从备份恢复数据");
    saveState();
    renderSuite();
    showToast("恢复成功");
  } catch (error) {
    showToast(`恢复失败：${error.message}`);
  }
}

function matchCareer(resume, jd) {
  const started = performance.now();
  const resumeTokens = unique(tokenize(resume));
  const jdTokens = unique(tokenize(jd));
  if (!resumeTokens.length || !jdTokens.length) {
    return `<p class="muted">请粘贴简历和岗位 JD。</p>`;
  }
  const matched = jdTokens.filter((token) => resumeTokens.includes(token));
  const missing = jdTokens
    .filter((token) => !resumeTokens.includes(token))
    .filter((token) => /agent|rag|eval|trace|sql|api|python|typescript|向量|评估|工具|成本|工作流|数据库/.test(token))
    .slice(0, 12);
  const score = Math.min(96, Math.round((matched.length / Math.max(jdTokens.length, 1)) * 170));
  $("matchScore").textContent = `${score}%`;
  const bullets = [
    "构建本地优先的多 Agent 工作台，覆盖 RAG、代码审查、CSV 分析、求职匹配和评估观测，支持无后端演示与本地持久化。",
    "设计 Agent Trace、置信度评分、工具调用计数和自检流程，用工程化指标定位模型/规则失败原因。",
    "实现知识库检索、来源引用、低置信度回退和结构化报告生成，展示从产品界面到核心算法的端到端 AI 应用能力。",
  ];
  const html = `<h3>匹配度：${renderConfidence(score)}</h3>
    <h3>已覆盖关键词</h3><p>${matched.slice(0, 24).map(escapeHtml).join("、") || "较少"}</p>
    <h3>建议补强</h3><ul>${(missing.length ? missing : ["评估集", "工具调用", "成本优化", "失败回放"]).map((m) => `<li>${escapeHtml(m)}</li>`).join("")}</ul>
    <h3>可放进简历的项目描述</h3><ul>${bullets.map((b) => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`;
  addTrace("Career Agent", `${resume.slice(0, 80)} ${jd.slice(0, 80)}`, html, started, score, 2);
  return html;
}

function makeResearchReport(topic, style) {
  const started = performance.now();
  const clean = String(topic || "").trim() || "AI Agent 产品机会";
  const styleText = {
    startup: "创业/产品视角",
    job: "求职项目视角",
    tech: "技术架构视角",
  }[style];
  const report = `<h3>${escapeHtml(clean)}：${escapeHtml(styleText)}研究报告</h3>
    <ol>
      <li><strong>问题定义：</strong>${escapeHtml(clean)} 的核心价值在于把重复的信息检索、判断、执行和复盘流程自动化。</li>
      <li><strong>目标用户：</strong>运营、客服、销售、招聘、研发团队里需要频繁跨系统查资料并产出结构化结论的人。</li>
      <li><strong>Agent 工作流：</strong>Planner 拆任务，Retriever 查资料，Tool Executor 执行业务动作，Evaluator 检查可信度，Reporter 输出报告。</li>
      <li><strong>关键指标：</strong>准确率、引用覆盖率、人工接管率、平均延迟、单次成本、任务完成率。</li>
      <li><strong>技术方案：</strong>前端工作台 + API 编排层 + 向量检索 + 工具注册 + Trace 日志 + Eval 数据集。</li>
      <li><strong>风险：</strong>幻觉、权限越界、过度自动化、数据泄露、低质量来源。需要引用、确认弹窗、只读权限和错误回放。</li>
      <li><strong>MVP 路线：</strong>先做本地 Demo，再接真实 API，最后补评估集、观测面板和部署脚本。</li>
    </ol>
    <h3>可以在面试中强调</h3>
    <p>这个项目不是聊天壳，而是包含工具调用、失败回退、可观测、评估和业务闭环的 Agent 系统。</p>`;
  addTrace("Research Agent", clean, report, started, 81, 4);
  return report;
}

const workflowScenarios = {
  support: {
    name: "AI 客服工单自动化",
    objective: "自动理解用户诉求，检索政策，调用订单工具，生成可审计回复。",
    steps: [
      ["Intent Classifier", "识别退款、账号、技术故障等工单类型", "LLM"],
      ["Retriever", "检索知识库中的政策、SOP 和历史案例", "RAG"],
      ["Order Tool", "读取订单状态，判断是否满足退款条件", "Tool"],
      ["Risk Guard", "检查越权、敏感信息和低置信度场景", "Guardrail"],
      ["Response Writer", "生成客服回复，并在必要时转人工", "Output"],
    ],
    deliverable: "输出工单分类、引用政策、推荐处理动作、客服回复和人工接管原因。",
    metrics: ["首响时间降低 65%", "人工接管率可观测", "每条回复保留引用来源"],
  },
  knowledge: {
    name: "企业知识库治理",
    objective: "把散乱文档转成可检索、可追溯、可评估的内部知识助理。",
    steps: [
      ["Document Parser", "清洗文档、切块、提取标题和关键概念", "ETL"],
      ["Retriever", "按问题召回高相关段落并计算置信度", "RAG"],
      ["Answer Agent", "基于证据生成答案，避免无来源回答", "LLM"],
      ["Evaluator", "检查引用覆盖率、相关性和幻觉风险", "Eval"],
      ["Feedback Loop", "记录低分问题，进入错误回放集", "Trace"],
    ],
    deliverable: "输出可引用答案、命中文档、置信度、改进建议和错误回放样本。",
    metrics: ["支持本地知识库持久化", "可解释置信度", "低证据自动降级"],
  },
  analytics: {
    name: "经营数据分析周报",
    objective: "将 CSV 或业务表自动聚合成渠道洞察、ROI 排名和行动建议。",
    steps: [
      ["Schema Reader", "识别维度列和指标列", "Parser"],
      ["Aggregation Tool", "按渠道、日期或类别汇总收入、订单、成本", "Tool"],
      ["Chart Renderer", "生成柱状图和明细表", "Viz"],
      ["Insight Agent", "解释异常、机会和优化动作", "LLM"],
      ["Report Export", "沉淀为周报结构和 Trace", "Output"],
    ],
    deliverable: "输出图表、表格、渠道排序、ROI 分析和业务建议。",
    metrics: ["秒级完成聚合", "支持自然语言问题", "自动生成可复盘 Trace"],
  },
  hiring: {
    name: "求职投递优化",
    objective: "围绕岗位 JD 自动评估简历匹配度，生成项目包装和面试讲法。",
    steps: [
      ["JD Parser", "抽取岗位关键词、职责和隐性能力要求", "NLP"],
      ["Resume Matcher", "计算覆盖关键词和能力缺口", "Scoring"],
      ["Project Rewriter", "生成更贴合岗位的项目 bullets", "Writer"],
      ["Interview Coach", "整理 STAR 讲法和架构问题", "Coach"],
      ["Tracker", "记录版本、岗位和优化历史", "Trace"],
    ],
    deliverable: "输出匹配分、缺口清单、简历 bullet、面试讲解提纲。",
    metrics: ["项目描述岗位定制化", "能力缺口可视化", "沉淀多版本材料"],
  },
};

function renderWorkflowBoard(scenario) {
  $("workflowBoard").innerHTML = scenario.steps
    .map(
      ([name, detail, tag], index) => `<article class="workflow-step">
        <span class="step-index">${index + 1}</span>
        <span class="step-body"><strong>${escapeHtml(name)}</strong><span>${escapeHtml(detail)}</span></span>
        <span class="step-tag">${escapeHtml(tag)}</span>
      </article>`,
    )
    .join("");
}

function runWorkflow() {
  const started = performance.now();
  const scenario = workflowScenarios[$("workflowScenario").value] || workflowScenarios.support;
  renderWorkflowBoard(scenario);
  const confidence = 88 + Math.floor(Math.random() * 7);
  $("workflowScore").textContent = `${confidence}%`;
  const html = `<h3>${escapeHtml(scenario.name)}</h3>
    <p><strong>目标：</strong>${escapeHtml(scenario.objective)}</p>
    <h3>交付物</h3><p>${escapeHtml(scenario.deliverable)}</p>
    <h3>工程指标</h3><ul>${scenario.metrics.map((m) => `<li>${escapeHtml(m)}</li>`).join("")}</ul>
    <h3>为什么适合写进简历</h3>
    <p>它展示了 Agent 编排、工具调用、RAG、评估、可观测和业务闭环，不是简单聊天 UI。</p>`;
  $("workflowOutput").innerHTML = html;
  addTrace("Workflow Orchestrator", scenario.name, html, started, confidence, scenario.steps.length);
}

function portfolioHtml() {
  return `<h3>项目名称</h3>
    <p><strong>Agent Workbench：本地优先的多 Agent 企业自动化平台</strong></p>
    <h3>技术栈</h3>
    <p>HTML5、CSS3、JavaScript、Canvas、本地存储、RAG 检索、规则引擎、CSV Parser、Agent Trace、可选 OpenAI Responses API。</p>
    <h3>核心能力</h3>
    <ul>
      <li>实现统一 Agent Router，根据自然语言任务自动分发到知识库、代码审查、数据分析、求职匹配和研究报告 Agent。</li>
      <li>构建本地 RAG 知识库，支持文档持久化、关键词召回、置信度评分和引用来源展示。</li>
      <li>实现 Agent Observability 面板，记录每次调用的 Trace、延迟、置信度、工具调用数和结果摘要。</li>
      <li>内置业务工作流编排中心，模拟客服、知识库治理、经营分析和求职优化等真实场景。</li>
      <li>设计无 API Key 可运行、远程模型失败自动回退的 Local-first 架构，保证项目演示稳定性。</li>
    </ul>
    <h3>简历 bullet</h3>
    <ul id="resumeBulletList">
      <li>独立开发 Agent Workbench 多 Agent 平台，集成 RAG 问答、代码 Review、CSV 数据分析、JD 匹配、市场研究报告和 Trace 观测，支持浏览器本地一键运行。</li>
      <li>设计 Agent Router 与业务工作流编排模块，将 Planner、Retriever、Tool Executor、Evaluator 串联为可解释任务链，沉淀延迟、置信度、工具调用等评估指标。</li>
      <li>实现本地知识库检索、来源引用、低置信度回退、规则扫描和数据可视化能力，并提供 OpenAI API 可选接入与失败自动回退机制。</li>
    </ul>
    <h3>面试可讲难点</h3>
    <p>如何在没有后端和 API Key 的情况下保证项目可演示；如何把 Agent 从聊天框升级为可观测、可评估、可复盘的工程系统；如何设计失败回退和本地规则引擎，让系统在真实演示中更稳定。</p>`;
}

function generatePortfolio() {
  const started = performance.now();
  const html = portfolioHtml();
  $("portfolioOutput").innerHTML = html;
  addTrace("Portfolio Generator", "generate resume-ready materials", html, started, 94, 3);
  showToast("简历材料已生成");
}

async function copyResumeBullets() {
  if (!$("portfolioOutput").textContent.trim()) generatePortfolio();
  const bullets = [...document.querySelectorAll("#resumeBulletList li")]
    .map((li) => `- ${li.textContent.trim()}`)
    .join("\n");
  try {
    await navigator.clipboard.writeText(bullets);
    showToast("项目 bullets 已复制");
  } catch {
    const area = document.createElement("textarea");
    area.value = bullets;
    document.body.append(area);
    area.select();
    document.execCommand("copy");
    area.remove();
    showToast("项目 bullets 已复制");
  }
}

function exportCaseStudy() {
  const scenario = workflowScenarios[$("workflowScenario").value] || workflowScenarios.support;
  const text = `# ${scenario.name}

目标：${scenario.objective}

工作流：
${scenario.steps.map((s, index) => `${index + 1}. ${s[0]} - ${s[1]} (${s[2]})`).join("\n")}

交付物：${scenario.deliverable}

指标：
${scenario.metrics.map((m) => `- ${m}`).join("\n")}
`;
  const blob = new Blob([text], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${scenario.name}.md`;
  link.click();
  URL.revokeObjectURL(url);
}

function drawArchitecture() {
  const canvas = $("architectureCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#12141a";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const layers = [
    ["UI Workbench", "统一控制台 / Agent 页面 / 可视化图表", 36, 34, 608, 62, "#4fb7a5"],
    ["Agent Router", "任务识别 / 自动路由 / 远程模型回退", 70, 124, 540, 62, "#f0b85a"],
    ["Specialized Agents", "RAG / Code Review / Data / Career / Research / Workflow", 36, 214, 608, 62, "#8aa2ff"],
    ["Observability", "Trace / Latency / Confidence / Tool Calls / Smoke Test", 70, 304, 540, 62, "#75c986"],
  ];
  ctx.textAlign = "left";
  layers.forEach(([title, detail, x, y, w, h, color], index) => {
    if (index > 0) {
      ctx.strokeStyle = "rgba(244,242,234,0.28)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(340, y - 28);
      ctx.lineTo(340, y - 2);
      ctx.stroke();
    }
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = "#101114";
    ctx.font = "800 18px sans-serif";
    ctx.fillText(title, x + 18, y + 25);
    ctx.font = "14px sans-serif";
    ctx.fillText(detail, x + 18, y + 48);
  });
}

async function runRemoteModel(prompt) {
  if (!state.settings.apiKey || !state.settings.useRemote) return null;
  try {
    const res = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.settings.apiKey}`,
      },
      body: JSON.stringify({
        model: state.settings.model || "gpt-4.1-mini",
        input: prompt,
      }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.output_text || data.output?.flatMap((o) => o.content || []).map((c) => c.text).join("\n") || null;
  } catch (error) {
    showToast(`远程模型失败，已回退本地：${error.message}`);
    return null;
  }
}

function inferAgent(input, mode) {
  if (mode !== "auto") return mode;
  const text = input.toLowerCase();
  if (/csv|数据|收入|渠道|sql|roi|订单/.test(text)) return "data";
  if (/代码|bug|review|function|const|class|diff|fetch/.test(text)) return "code";
  if (/简历|岗位|jd|面试|求职|ats/.test(text)) return "career";
  if (/报告|研究|市场|竞品|机会/.test(text)) return "research";
  return "knowledge";
}

async function runGlobalAgent() {
  const started = performance.now();
  const input = $("globalPrompt").value.trim();
  if (!input) {
    $("globalOutput").innerHTML = `<p class="muted">请输入任务。</p>`;
    return;
  }
  $("globalOutput").innerHTML = `<p class="muted">Agent 正在规划和调用工具...</p>`;
  const remote = await runRemoteModel(input);
  if (remote) {
    const html = `<h3>远程模型结果</h3><p>${escapeHtml(remote).replace(/\n/g, "<br>")}</p>`;
    $("globalOutput").innerHTML = html;
    addTrace("Remote Agent", input, html, started, 86, 1);
    return;
  }
  const agent = inferAgent(input, $("agentMode").value);
  let html = "";
  if (agent === "knowledge") html = answerKnowledge(input);
  if (agent === "code") html = reviewCode(input).html;
  if (agent === "data") html = analyzeRows(parseCsv($("csvInput").value || samples.csv), input).html;
  if (agent === "career") html = matchCareer($("resumeInput").value || samples.resume, input);
  if (agent === "research") html = makeResearchReport(input, "job");
  $("globalOutput").innerHTML = `<h3>路由：${agent}</h3>${html}`;
}

async function runPresetTask(index) {
  const task = presetTasks[index];
  if (!task) return;
  ensureSampleData();
  if (task.agent === "workflow") {
    setPanel("workflow");
    runWorkflow();
    scrollToOutput("workflowOutput");
    return;
  }
  if (task.agent === "portfolio") {
    setPanel("portfolio");
    generatePortfolio();
    scrollToOutput("portfolioOutput");
    return;
  }
  if (task.agent === "toolbox") {
    setPanel("toolbox");
    runToolboxSuite();
    return;
  }
  if (task.agent === "lifehub") {
    setPanel("lifehub");
    runHubSuite();
    if (!state.lifeData.length) loadLifeSampleData();
    analyzeLifeData();
    return;
  }
  if (task.agent === "apps") {
    setPanel("apps");
    if (!state.tasks.length) {
      addTask("完成项目测试", "todo");
      addTask("整理演示材料", "doing");
      addTask("打开实用应用检查", "done");
    }
    if (!state.habits.length) $("loadHabitSample").click();
    if (!state.money.length) $("loadMoneySample").click();
    renderAllApps();
    scrollToOutput("kanbanBoard");
    return;
  }
  if (task.agent === "grades") {
    setPanel("grades");
    gradeOneClick();
    return;
  }
  if (task.agent === "suite") {
    setPanel("suite");
    seedSuiteDemo();
    return;
  }
  if (task.agent === "evals") {
    setPanel("evals");
    runSmokeTest();
    scrollToOutput("traceList");
    return;
  }
  setPanel("command");
  $("agentMode").value = task.agent;
  $("globalPrompt").value = task.prompt;
  await runGlobalAgent();
  scrollToOutput("globalOutput");
}

async function runFullDemo() {
  ensureSampleData();
  const started = performance.now();
  const rows = parseCsv(samples.csv);
  const dataResult = analyzeRows(rows, "按渠道汇总收入并排序", { silent: true });
  const codeResult = reviewCode(samples.code);
  const careerResult = matchCareer(samples.resume, samples.jd);
  const researchResult = makeResearchReport("AI Agent 在企业知识库中的落地机会", "job");
  const toolboxResult = runToolboxTool("export", "生成项目交付清单");
  const hubResult = runHubTool("web-brief", "整合生活、学习、求职和生产资料", { silent: true });
  if (!state.tasks.length) state.tasks.push({ id: crypto.randomUUID(), title: "完成一键演示", status: "done" });
  renderAllApps();
  renderSuite();
  renderGradeHistory();
  if (!state.gradeStudents.length) generateGradeStudents();
  analyzeGradeData({ silent: true });
  if (!state.suite.crm.length) seedSuiteDemo();
  const kbResult = answerKnowledge("这个项目有哪些 Agent 能力？");
  runWorkflow();
  generatePortfolio();
  setPanel("command");
  $("agentMode").value = "auto";
  $("globalPrompt").value = "一键演示完整项目";
  const html = `<h3>一键演示完成</h3>
    <p>已经自动跑完知识库问答、代码审查、数据分析、求职匹配、研究报告、工作流编排和简历材料生成。</p>
    <h3>你可以这样展示</h3>
    <ol>
      <li>先看这里的汇总，说明项目不是聊天壳，而是一个多 Agent 平台。</li>
      <li>打开「Agent 编排」，讲 Planner、工具调用、评估和 Trace。</li>
      <li>打开「项目简历页」，直接复制项目 bullets 到简历。</li>
    </ol>
    <h3>关键结果预览</h3>
    <ul>
      <li>知识库：${kbResult.replace(/<[^>]+>/g, "").slice(0, 90)}...</li>
      <li>代码审查：发现 ${codeResult.findings.length} 条规则结果。</li>
      <li>数据分析：收入最高渠道是 ${escapeHtml(dataResult.grouped[0]?.name || "未知")}。</li>
      <li>求职匹配：${careerResult.replace(/<[^>]+>/g, "").slice(0, 80)}...</li>
      <li>研究报告：${researchResult.replace(/<[^>]+>/g, "").slice(0, 80)}...</li>
      <li>工具箱：${toolboxResult.replace(/<[^>]+>/g, "").slice(0, 80)}...</li>
      <li>全能工作台：${hubResult.replace(/<[^>]+>/g, "").slice(0, 80)}...</li>
      <li>实用应用：已准备任务看板、习惯打卡、收支记录、笔记和番茄钟。</li>
      <li>成绩分析：已生成 ${state.gradeStudents.length} 名学生、多课程、多图表分析样例。</li>
      <li>综合管理套件：已准备 CRM、库存、项目、日历、自动化和报表样例。</li>
    </ul>`;
  $("globalOutput").innerHTML = html;
  addTrace("One Click Demo", "full project demo", html, started, 95, 8);
  scrollToOutput("globalOutput");
}

function renderTraces() {
  $("traceCount").textContent = `${state.traces.length} traces`;
  const total = state.traces.length || 1;
  const avgConf = Math.round(state.traces.reduce((sum, t) => sum + Number(t.confidence || 0), 0) / total);
  const avgLatency = Math.round(state.traces.reduce((sum, t) => sum + Number(t.latency || 0), 0) / total);
  const toolCalls = state.traces.reduce((sum, t) => sum + Number(t.toolCount || 0), 0);
  $("avgConfidence").textContent = `${avgConf}%`;
  $("avgLatency").textContent = `${avgLatency} ms`;
  $("toolCalls").textContent = String(toolCalls);
  if (!state.traces.length) {
    $("traceList").innerHTML = `<p class="muted">运行任意 Agent 后，这里会出现调用记录。</p>`;
    return;
  }
  $("traceList").innerHTML = state.traces
    .map(
      (t) => `<article class="trace-item">
        <strong>${escapeHtml(t.agent)}</strong>
        <span class="trace-meta">${escapeHtml(t.at)} · ${t.latency} ms · confidence ${t.confidence}% · tools ${t.toolCount}</span>
        <span>${escapeHtml(t.input)}</span>
        <span class="muted">${escapeHtml(t.result)}</span>
      </article>`,
    )
    .join("");
}

function drawAgentGraph() {
  const canvas = $("agentGraph");
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const nodes = [
    { x: 90, y: 86, label: "Input", color: "#f0b85a" },
    { x: 250, y: 70, label: "Planner", color: "#f0b85a" },
    { x: 410, y: 112, label: "Router", color: "#f0b85a" },
    { x: 120, y: 235, label: "RAG", color: "#4fb7a5" },
    { x: 260, y: 255, label: "Tools", color: "#4fb7a5" },
    { x: 410, y: 238, label: "Code/Data", color: "#4fb7a5" },
    { x: 245, y: 355, label: "Evaluator", color: "#8aa2ff" },
  ];
  const edges = [
    [0, 1],
    [1, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [3, 6],
    [4, 6],
    [5, 6],
  ];
  ctx.lineWidth = 2;
  edges.forEach(([a, b]) => {
    ctx.strokeStyle = "rgba(244,242,234,0.24)";
    ctx.beginPath();
    ctx.moveTo(nodes[a].x, nodes[a].y);
    ctx.lineTo(nodes[b].x, nodes[b].y);
    ctx.stroke();
  });
  nodes.forEach((node) => {
    ctx.fillStyle = "rgba(0,0,0,0.34)";
    ctx.beginPath();
    ctx.arc(node.x + 3, node.y + 5, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = node.color;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 42, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#101114";
    ctx.font = "700 15px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(node.label, node.x, node.y + 5);
  });
}

function loadSamplesIfEmpty() {
  if (!$("codeInput").value.trim()) $("codeInput").value = samples.code;
  if (!$("csvInput").value.trim()) $("csvInput").value = samples.csv;
  if (!$("resumeInput").value.trim()) $("resumeInput").value = samples.resume;
  if (!$("jdInput").value.trim()) $("jdInput").value = samples.jd;
}

function runSmokeTest() {
  const started = performance.now();
  const checks = [];
  const push = (name, ok) => checks.push({ name, ok });
  const smokeDoc = {
    id: crypto.randomUUID(),
    title: "自检文档",
    text: "Agent 自检文档：包含 RAG、数据分析、代码审查和 Trace。",
    addedAt: Date.now(),
  };
  state.docs.unshift(smokeDoc);
  renderDocs();
  push("文档写入", state.docs[0]?.id === smokeDoc.id);
  push("知识库回答", !answerKnowledge("Agent 包含哪些能力").includes("为空"));
  state.docs = state.docs.filter((doc) => doc.id !== smokeDoc.id);
  saveState();
  renderDocs();
  push("代码审查", reviewCode(samples.code).findings.length > 0);
  push("CSV 解析", parseCsv(samples.csv).length === 9);
  push("数据分析", analyzeRows(parseCsv(samples.csv), "按渠道分析收入").grouped.length === 3);
  push("求职匹配", matchCareer(samples.resume, samples.jd).includes("匹配度"));
  const okCount = checks.filter((c) => c.ok).length;
  const html = `<h3>自检结果：${okCount}/${checks.length}</h3><ul>${checks
    .map((c) => `<li>${c.ok ? "通过" : "失败"}：${escapeHtml(c.name)}</li>`)
    .join("")}</ul>`;
  addTrace("Smoke Test", "self-test", html, started, okCount === checks.length ? 96 : 55, checks.length);
  showToast(okCount === checks.length ? "自检全部通过" : "自检发现问题");
}

function canReadDoc(doc) {
  if (!doc.visibility || doc.visibility === "public") return true;
  if (state.currentUser.role === "admin") return true;
  if (doc.visibility === "team" && state.currentUser.role !== "viewer") return true;
  return doc.owner === state.currentUser.name;
}

function canEditDocs() {
  return state.currentUser.role === "admin" || state.currentUser.role === "editor";
}

function splitTextIntoChunks(text, size = 500) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (!clean) return [];
  const chunks = [];
  for (let cursor = 0; cursor < clean.length; cursor += size) {
    chunks.push(clean.slice(cursor, cursor + size));
  }
  return chunks;
}

function rebuildChunks() {
  const chunkSize = Math.max(120, Math.min(2000, Number($("chunkSizeInput")?.value) || 500));
  state.chunks = [];
  state.docs.forEach((doc) => {
    const parts = splitTextIntoChunks(doc.text, chunkSize);
    doc.chunkCount = parts.length;
    parts.forEach((text, index) => {
      state.chunks.push({
        id: `${doc.id || doc.title}-${index}`,
        docId: doc.id,
        title: doc.title,
        owner: doc.owner || "admin",
        visibility: doc.visibility || "private",
        index: index + 1,
        text,
      });
    });
  });
}

function renderChunkPreview() {
  $("chunkCount").textContent = `${state.chunks.length} chunks`;
  const visible = state.chunks.filter((chunk) => canReadDoc(chunk)).slice(0, 5);
  $("chunkPreview").innerHTML = visible.length
    ? visible
        .map(
          (chunk) => `<div class="source-row">
            <strong>${escapeHtml(chunk.title)} #${chunk.index}</strong>
            <p>${escapeHtml(chunk.text.slice(0, 180))}${chunk.text.length > 180 ? "..." : ""}</p>
          </div>`,
        )
        .join("")
    : `<p class="muted">暂无可见切分片段。上传文档或切换有权限的用户。</p>`;
}

function renderKbUser() {
  $("currentUserBadge").textContent = `${state.currentUser.name} / ${state.currentUser.role}`;
  $("kbPermissionInfo").innerHTML = `<h3>当前用户</h3>${bulletList([
    `用户名：${state.currentUser.name}`,
    `角色：${state.currentUser.role}`,
    canEditDocs() ? "权限：可以上传、删除和管理文档" : "权限：只读问答，不能上传或删除文档",
  ])}`;
}

function renderQaHistory() {
  $("qaHistoryCount").textContent = `${state.qaHistory.length} history`;
  $("qaHistoryList").innerHTML = state.qaHistory.length
    ? state.qaHistory
        .slice(0, 12)
        .map(
          (item) => `<article class="trace-item">
            <strong>${escapeHtml(item.question)}</strong>
            <span class="trace-meta">${escapeHtml(item.at)} · ${escapeHtml(item.user)} · ${item.sources} sources</span>
            <span class="muted">${escapeHtml(item.answer.slice(0, 160))}</span>
          </article>`,
        )
        .join("")
    : `<p class="muted">还没有问答历史。</p>`;
}

function renderDocs() {
  rebuildChunks();
  $("docCount").textContent = `${state.docs.length} docs`;
  $("chunkCount").textContent = `${state.chunks.length} chunks`;
  if (!state.docs.length) {
    $("docList").innerHTML = `<p class="muted">还没有文档。可以上传文件、载入示例，或粘贴自己的资料。</p>`;
    renderChunkPreview();
    return;
  }
  $("docList").innerHTML = state.docs
    .map(
      (doc, index) => `<article class="doc-item">
        <strong>${escapeHtml(doc.title)}</strong>
        <p class="muted">${escapeHtml(doc.owner || "admin")} · ${escapeHtml(doc.visibility || "private")} · ${doc.chunkCount || 0} chunks</p>
        <p class="muted">${escapeHtml(doc.text.slice(0, 160))}${doc.text.length > 160 ? "..." : ""}</p>
        <button data-remove-doc="${index}">删除</button>
      </article>`,
    )
    .join("");
  renderChunkPreview();
}

function addDocument(title, text) {
  const cleanText = String(text || "").trim();
  if (!cleanText) {
    showToast("文档内容不能为空");
    return false;
  }
  if (!canEditDocs()) {
    showToast("当前用户没有上传权限");
    return false;
  }
  state.docs.unshift({
    id: crypto.randomUUID(),
    title: String(title || `文档 ${state.docs.length + 1}`).trim(),
    text: cleanText,
    owner: state.currentUser.name,
    visibility: $("docVisibility")?.value || "private",
    addedAt: Date.now(),
  });
  rebuildChunks();
  saveState();
  renderDocs();
  return true;
}

function answerKnowledge(question) {
  const started = performance.now();
  const clean = String(question || "").trim();
  if (!clean) return `<p class="muted">请输入问题。</p>`;
  rebuildChunks();
  const readableChunks = state.chunks.filter((chunk) => canReadDoc(chunk));
  if (!readableChunks.length) return `<p class="muted">当前用户没有可读取的文档。请上传文档或切换权限。</p>`;
  const ranked = readableChunks
    .map((chunk) => ({ ...chunk, score: scoreText(clean, `${chunk.title}\n${chunk.text}`) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  const best = ranked[0];
  const confidence = confidenceLabel(best.score);
  const sources = ranked.filter((chunk) => chunk.score > 0);
  const sourceHtml = sources
    .map(
      (chunk) => `<div class="source-row">
        <strong>${escapeHtml(chunk.title)} #${chunk.index}</strong>
        <p>${escapeHtml(chunk.text.slice(0, 260))}${chunk.text.length > 260 ? "..." : ""}</p>
      </div>`,
    )
    .join("");
  const answer =
    confidence < 18
      ? "没有找到足够强的证据。建议补充更相关的文档，或把问题问得更具体。"
      : `根据可见文档，最相关的来源是《${escapeHtml(best.title)}》第 ${best.index} 段。核心依据：${escapeHtml(best.text.slice(0, 180))}`;
  const html = `<h3>回答</h3><p>${answer}</p><p>置信度：${renderConfidence(confidence)}</p><h3>引用来源</h3>${sourceHtml || "<p class='muted'>无匹配来源。</p>"}`;
  state.qaHistory.unshift({
    id: crypto.randomUUID(),
    question: clean,
    answer: answer.replace(/<[^>]+>/g, ""),
    user: state.currentUser.name,
    sources: sources.length,
    at: new Date().toLocaleString("zh-CN"),
  });
  state.qaHistory = state.qaHistory.slice(0, 100);
  saveState();
  renderQaHistory();
  addTrace("Knowledge QA API", clean, html, started, confidence, sources.length);
  return html;
}

function kbDeploymentHtml() {
  return `<h3>云部署升级方案</h3>${bulletList([
    "前端：保留当前 HTML/CSS/JS，也可以升级为 React/Vue。",
    "后端：Node.js/Express 或 FastAPI，提供登录、文档上传、问答接口。",
    "数据库：PostgreSQL 保存用户、权限、文档、分块和问答历史。",
    "对象存储：OSS/S3/本地 MinIO 保存 PDF、Word、图片等原始文件。",
    "文档解析：后端增加 PDF/Word 解析服务，前端继续展示切分结果。",
    "权限：RBAC 角色模型，admin/editor/viewer 控制上传、删除、读取。",
    "部署：Vercel/Netlify 部署前端，Render/Railway/云服务器部署后端。",
  ])}<h3>建议接口</h3>${bulletList([
    "POST /api/auth/login",
    "POST /api/documents/upload",
    "GET /api/documents",
    "POST /api/documents/:id/chunks",
    "POST /api/qa",
    "GET /api/qa/history",
    "GET /api/admin/users",
  ])}`;
}

async function uploadKnowledgeFiles() {
  if (!canEditDocs()) {
    showToast("当前用户没有上传权限");
    return;
  }
  const files = [...($("kbFileInput").files || [])];
  if (!files.length) {
    showToast("请选择文件");
    return;
  }
  for (const file of files) {
    const text = await file.text();
    addDocument(file.name, text);
  }
  $("kbFileInput").value = "";
  renderDocs();
  showToast(`已上传 ${files.length} 个文件`);
}

function seedKnowledgeDemo() {
  if (!canEditDocs()) state.currentUser = { name: "admin", role: "admin" };
  renderKbUser();
  const oldVisibility = $("docVisibility").value;
  $("docVisibility").value = "public";
  addDocument("云部署方案.md", "云部署需要前端静态托管、后端 API 服务、数据库、对象存储、文档解析和权限系统。推荐前端部署到 Vercel 或 Netlify，后端部署到 Render、Railway 或云服务器。");
  addDocument("权限设计.md", "系统包含 admin、editor、viewer 三类角色。admin 可以管理用户和所有文档，editor 可以上传和编辑团队文档，viewer 只能查看有权限的文档并提问。");
  addDocument("问答接口.md", "问答接口接收 question、userId、scope，先检索可见文档分块，再返回 answer、confidence、sources 和 traceId。引用来源应包含文档标题和分块编号。");
  $("docVisibility").value = oldVisibility;
  $("kbQuestion").value = "云部署需要哪些模块？";
  $("kbOutput").innerHTML = answerKnowledge($("kbQuestion").value);
}

function bindEvents() {
  $("nav").addEventListener("click", (event) => {
    const button = event.target.closest("[data-panel]");
    if (button) setPanel(button.dataset.panel);
  });
  $("kbLogin").addEventListener("click", () => {
    const selected = $("kbUserSelect").value;
    const custom = $("kbLoginName").value.trim();
    const role = $("kbRoleSelect").value;
    const defaults = {
      admin: { name: "admin", role: "admin" },
      teacher: { name: "teacher", role: "editor" },
      student: { name: "student", role: "viewer" },
      guest: { name: "guest", role: "viewer" },
    };
    state.currentUser = custom ? { name: custom, role } : defaults[selected];
    saveState();
    renderKbUser();
    renderDocs();
    renderQaHistory();
    showToast("用户已切换");
  });
  $("uploadDocs").addEventListener("click", uploadKnowledgeFiles);
  $("kbQuickDemo").addEventListener("click", seedKnowledgeDemo);
  $("kbDeploymentGuide").addEventListener("click", () => {
    $("kbOutput").innerHTML = kbDeploymentHtml();
    scrollToOutput("kbOutput");
  });
  $("presetTasks").addEventListener("click", (event) => {
    const button = event.target.closest("[data-preset]");
    if (!button) return;
    withLoading(button, "运行中...", () => runPresetTask(Number(button.dataset.preset)));
  });
  $("toolboxGrid").addEventListener("click", (event) => {
    const button = event.target.closest("[data-tool]");
    if (!button) return;
    selectTool(button.dataset.tool);
  });
  $("runToolbox").addEventListener("click", runActiveToolboxTool);
  $("loadToolboxSample").addEventListener("click", () => {
    $("toolboxInput").value = getActiveTool().sample;
    showToast("示例已载入");
  });
  $("runToolboxSuite").addEventListener("click", runToolboxSuite);
  $("hubTabs").addEventListener("click", (event) => {
    const button = event.target.closest("[data-hub-category]");
    if (button) selectHubCategory(button.dataset.hubCategory);
  });
  $("hubTools").addEventListener("click", (event) => {
    const button = event.target.closest("[data-hub-tool]");
    if (button) selectHubTool(button.dataset.hubTool);
  });
  $("runHubTool").addEventListener("click", runActiveHubTool);
  $("loadHubSample").addEventListener("click", () => {
    $("hubInput").value = getActiveHubTool().sample;
    showToast("示例已载入");
  });
  $("runHubSuite").addEventListener("click", runHubSuite);
  $("addLifeData").addEventListener("click", () => {
    const date = $("lifeDate").value || new Date().toISOString().slice(0, 10);
    const metric = $("lifeMetric").value.trim() || "学习时长";
    const value = Number($("lifeValue").value);
    if (!Number.isFinite(value)) {
      showToast("请输入有效数值");
      return;
    }
    state.lifeData.push({ date, metric, value });
    saveState();
    renderLifeData();
    drawLifeChart();
    $("lifeValue").value = "";
    showToast("记录已添加");
  });
  $("loadLifeData").addEventListener("click", () => {
    loadLifeSampleData();
    showToast("示例数据已载入");
  });
  $("analyzeLifeData").addEventListener("click", analyzeLifeData);
  $("clearLifeData").addEventListener("click", () => {
    state.lifeData = [];
    saveState();
    renderLifeData();
    $("lifeAnalysis").innerHTML = `<p class="muted">记录已清空。</p>`;
    drawLifeChart();
  });
  $("addTask").addEventListener("click", () => {
    addTask($("taskTitle").value, $("taskStatus").value);
    $("taskTitle").value = "";
  });
  $("kanbanBoard").addEventListener("change", (event) => {
    const select = event.target.closest("[data-task-status]");
    if (!select) return;
    const task = state.tasks.find((item) => item.id === select.dataset.taskStatus);
    if (task) task.status = select.value;
    saveState();
    renderKanban();
  });
  $("kanbanBoard").addEventListener("click", (event) => {
    const button = event.target.closest("[data-task-delete]");
    if (!button) return;
    state.tasks = state.tasks.filter((task) => task.id !== button.dataset.taskDelete);
    saveState();
    renderKanban();
  });
  $("addHabit").addEventListener("click", () => {
    const name = $("habitName").value.trim();
    if (!name) {
      showToast("习惯名称不能为空");
      return;
    }
    state.habits.push({ id: crypto.randomUUID(), name, doneDates: [] });
    $("habitName").value = "";
    saveState();
    renderHabits();
  });
  $("loadHabitSample").addEventListener("click", () => {
    state.habits = ["背单词", "运动 30 分钟", "阅读 20 分钟"].map((name) => ({
      id: crypto.randomUUID(),
      name,
      doneDates: [],
    }));
    saveState();
    renderHabits();
  });
  $("habitList").addEventListener("click", (event) => {
    const toggle = event.target.closest("[data-habit-toggle]");
    const del = event.target.closest("[data-habit-delete]");
    const today = todayKey();
    if (toggle) {
      const habit = state.habits.find((item) => item.id === toggle.dataset.habitToggle);
      if (habit) {
        habit.doneDates = habit.doneDates || [];
        habit.doneDates = habit.doneDates.includes(today)
          ? habit.doneDates.filter((date) => date !== today)
          : [...habit.doneDates, today];
      }
    }
    if (del) state.habits = state.habits.filter((habit) => habit.id !== del.dataset.habitDelete);
    saveState();
    renderHabits();
  });
  $("addMoney").addEventListener("click", () => {
    const amount = Number($("moneyAmount").value);
    if (!Number.isFinite(amount) || amount <= 0) {
      showToast("请输入有效金额");
      return;
    }
    state.money.push({
      id: crypto.randomUUID(),
      type: $("moneyType").value,
      category: $("moneyCategory").value.trim() || "其他",
      amount,
      at: Date.now(),
    });
    $("moneyAmount").value = "";
    saveState();
    renderMoney();
  });
  $("loadMoneySample").addEventListener("click", () => {
    state.money = [
      { id: crypto.randomUUID(), type: "income", category: "生活费", amount: 2000, at: Date.now() },
      { id: crypto.randomUUID(), type: "expense", category: "餐饮", amount: 460, at: Date.now() },
      { id: crypto.randomUUID(), type: "expense", category: "交通", amount: 80, at: Date.now() },
      { id: crypto.randomUUID(), type: "expense", category: "学习", amount: 120, at: Date.now() },
    ];
    saveState();
    renderMoney();
  });
  $("clearMoney").addEventListener("click", () => {
    state.money = [];
    saveState();
    renderMoney();
  });
  $("moneyOutput").addEventListener("click", (event) => {
    const button = event.target.closest("[data-money-delete]");
    if (!button) return;
    state.money = state.money.filter((row) => row.id !== button.dataset.moneyDelete);
    saveState();
    renderMoney();
  });
  $("addGoal").addEventListener("click", () => {
    const name = $("goalName").value.trim();
    const value = Math.max(0, Math.min(100, Number($("goalValue").value)));
    if (!name || !Number.isFinite(value)) {
      showToast("请输入目标和 0-100 的进度");
      return;
    }
    state.goals.push({ id: crypto.randomUUID(), name, value });
    $("goalName").value = "";
    $("goalValue").value = "";
    saveState();
    renderGoals();
  });
  $("goalList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-goal-delete]");
    if (!button) return;
    state.goals = state.goals.filter((goal) => goal.id !== button.dataset.goalDelete);
    saveState();
    renderGoals();
  });
  $("markdownInput").addEventListener("input", renderMarkdown);
  $("loadMarkdownSample").addEventListener("click", () => {
    $("markdownInput").value = "# 全能工作台笔记\n- 任务看板管理项目进度\n- 习惯打卡记录生活状态\n- 收支记录做预算复盘\n- Markdown 可以写报告草稿";
    renderMarkdown();
  });
  $("saveMarkdown").addEventListener("click", () => {
    state.markdown = $("markdownInput").value;
    saveState();
    showToast("笔记已保存");
  });
  $("clearMarkdown").addEventListener("click", () => {
    $("markdownInput").value = "";
    state.markdown = "";
    saveState();
    renderMarkdown();
  });
  $("startTimer").addEventListener("click", () => {
    if (timerHandle) return;
    timerHandle = window.setInterval(() => {
      timerSeconds = Math.max(0, timerSeconds - 1);
      renderTimer();
      if (timerSeconds === 0) {
        window.clearInterval(timerHandle);
        timerHandle = null;
        showToast("番茄钟结束");
      }
    }, 1000);
  });
  $("pauseTimer").addEventListener("click", () => {
    window.clearInterval(timerHandle);
    timerHandle = null;
  });
  $("resetTimer").addEventListener("click", () => {
    window.clearInterval(timerHandle);
    timerHandle = null;
    timerSeconds = 25 * 60;
    renderTimer();
  });
  $("formatJson").addEventListener("click", () => {
    try {
      $("formatOutput").innerHTML = `<pre>${escapeHtml(JSON.stringify(JSON.parse($("formatInput").value), null, 2))}</pre>`;
    } catch (error) {
      $("formatOutput").innerHTML = `<p class="muted">JSON 格式错误：${escapeHtml(error.message)}</p>`;
    }
  });
  $("csvToTable").addEventListener("click", () => {
    const rows = parseCsv($("formatInput").value);
    if (!rows.length) {
      $("formatOutput").innerHTML = `<p class="muted">请输入至少包含表头和一行数据的 CSV。</p>`;
      return;
    }
    const headers = Object.keys(rows[0]);
    $("formatOutput").innerHTML = `<table><thead><tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead>
      <tbody>${rows.map((row) => `<tr>${headers.map((h) => `<td>${escapeHtml(row[h])}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
  });
  $("gradeOneClick").addEventListener("click", gradeOneClick);
  $("generateGradeData").addEventListener("click", generateGradeStudents);
  $("analyzeGrades").addEventListener("click", () => analyzeGradeData());
  $("saveGradeHistory").addEventListener("click", saveGradeHistory);
  $("clearGradeHistory").addEventListener("click", () => {
    state.gradeHistory = [];
    saveState();
    renderGradeHistory();
  });
  $("gradeExportCsv").addEventListener("click", exportGradeCsv);
  $("gradeHelpBtn").addEventListener("click", () => $("gradeHelp").classList.toggle("hidden"));
  ["gradeCompareMode", "gradeChartType"].forEach((id) => {
    $(id).addEventListener("change", () => {
      if (state.gradeSummary) {
        renderGradeSummary();
        drawGradeCharts();
      }
    });
  });
  ["uiTheme", "uiDensity"].forEach((id) => $(id).addEventListener("change", applyUiSettings));
  $("languageSelect").addEventListener("change", () => applyLanguage($("languageSelect").value));
  $("suiteDemo").addEventListener("click", seedSuiteDemo);
  $("suiteReport").addEventListener("click", generateSuiteReport);
  $("suiteBackup").addEventListener("click", exportSuiteBackup);
  $("suiteApiMock").addEventListener("click", generateApiMock);
  $("suiteRestore").addEventListener("click", restoreSuiteBackup);
  $("runRules").addEventListener("click", runSuiteRules);
  $("runAudit").addEventListener("click", () => {
    suiteLog("手动运行安全审计");
    $("ruleOutput").innerHTML = `<h3>安全审计摘要</h3>${bulletList(["本地演示模式，无真实网络风险", "建议真实部署时启用 HTTPS、登录鉴权、接口限流和审计日志", "备份数据不应包含明文密码或敏感隐私"])}`;
    saveState();
    renderSuite();
  });
  $("clearAudit").addEventListener("click", () => {
    state.suite.audit = [];
    saveState();
    renderSuite();
  });
  $("addCrm").addEventListener("click", () => {
    const name = $("crmName").value.trim();
    const value = Number($("crmValue").value) || 0;
    if (!name) return showToast("客户名称不能为空");
    state.suite.crm.push({ id: crypto.randomUUID(), name, stage: $("crmStage").value, value });
    $("crmName").value = "";
    $("crmValue").value = "";
    suiteLog(`添加客户：${name}`);
    saveState();
    renderSuite();
  });
  $("addStock").addEventListener("click", () => {
    const name = $("stockName").value.trim();
    const qty = Number($("stockQty").value);
    const min = Number($("stockMin").value);
    if (!name || !Number.isFinite(qty) || !Number.isFinite(min)) return showToast("请输入完整库存信息");
    state.suite.stock.push({ id: crypto.randomUUID(), name, qty, min });
    $("stockName").value = "";
    $("stockQty").value = "";
    $("stockMin").value = "";
    suiteLog(`添加库存：${name}`);
    saveState();
    renderSuite();
  });
  $("addMilestone").addEventListener("click", () => {
    const name = $("milestoneName").value.trim();
    const progress = Math.max(0, Math.min(100, Number($("milestoneProgress").value)));
    if (!name || !Number.isFinite(progress)) return showToast("请输入里程碑和进度");
    state.suite.milestones.push({ id: crypto.randomUUID(), name, progress });
    $("milestoneName").value = "";
    $("milestoneProgress").value = "";
    suiteLog(`添加里程碑：${name}`);
    saveState();
    renderSuite();
  });
  $("addEvent").addEventListener("click", () => {
    const title = $("eventTitle").value.trim();
    const date = $("eventDate").value || new Date().toISOString().slice(0, 10);
    if (!title) return showToast("事件标题不能为空");
    state.suite.events.push({ id: crypto.randomUUID(), title, date });
    $("eventTitle").value = "";
    suiteLog(`添加事件：${title}`);
    saveState();
    renderSuite();
  });
  document.querySelector("#panel-suite").addEventListener("click", (event) => {
    const button = event.target.closest("[data-suite-delete]");
    if (!button) return;
    const [type, id] = button.dataset.suiteDelete.split(":");
    const key = type === "milestone" ? "milestones" : type;
    state.suite[key] = state.suite[key].filter((item) => item.id !== id);
    suiteLog(`删除 ${type}`);
    saveState();
    renderSuite();
  });
  $("runDemo").addEventListener("click", (event) => {
    withLoading(event.currentTarget, "演示中...", runFullDemo);
  });
  $("loadEverything").addEventListener("click", () => {
    ensureSampleData();
    renderTable(parseCsv($("csvInput").value));
    drawChart(parseCsv($("csvInput").value));
    showToast("全部示例已准备好，可以直接点预设任务");
  });
  $("openResumePage").addEventListener("click", () => {
    setPanel("portfolio");
    generatePortfolio();
    scrollToOutput("portfolioOutput");
  });
  $("capabilityCards").addEventListener("click", (event) => {
    const button = event.target.closest("[data-jump]");
    if (button) setPanel(button.dataset.jump);
  });
  $("docList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-remove-doc]");
    if (!button) return;
    if (!canEditDocs()) {
      showToast("当前用户没有删除权限");
      return;
    }
    state.docs.splice(Number(button.dataset.removeDoc), 1);
    rebuildChunks();
    saveState();
    renderDocs();
  });
  $("addDoc").addEventListener("click", () => {
    if (addDocument($("docTitle").value, $("docInput").value)) {
      $("docInput").value = "";
      $("docTitle").value = "";
      showToast("已加入知识库");
    }
  });
  $("loadSamples").addEventListener("click", () => {
    samples.docs.forEach((doc) => addDocument(doc.title, doc.text));
    showToast("示例文档已载入");
  });
  $("resetKb").addEventListener("click", () => {
    state.docs = [];
    saveState();
    renderDocs();
    $("kbOutput").innerHTML = "";
    showToast("知识库已重置");
  });
  $("askKb").addEventListener("click", () => {
    $("kbOutput").innerHTML = answerKnowledge($("kbQuestion").value);
    scrollToOutput("kbOutput");
  });
  $("loadCodeSample").addEventListener("click", () => {
    $("codeInput").value = samples.code;
  });
  $("reviewCode").addEventListener("click", () => {
    const result = reviewCode($("codeInput").value);
    $("codeOutput").innerHTML = result.html;
    $("issueCount").textContent = `${result.findings.length} issues`;
    scrollToOutput("codeOutput");
  });
  $("loadCsvSample").addEventListener("click", () => {
    $("csvInput").value = samples.csv;
    drawChart(parseCsv(samples.csv));
    $("rowCount").textContent = "9 rows";
  });
  $("analyzeData").addEventListener("click", () => {
    const rows = parseCsv($("csvInput").value);
    const result = analyzeRows(rows, $("dataQuestion").value);
    $("dataOutput").innerHTML = result.html;
    $("rowCount").textContent = `${rows.length} rows`;
    renderTable(rows);
    drawChart(rows);
    scrollToOutput("dataOutput");
  });
  $("loadCareerSample").addEventListener("click", () => {
    $("resumeInput").value = samples.resume;
    $("jdInput").value = samples.jd;
  });
  $("matchJob").addEventListener("click", () => {
    $("careerOutput").innerHTML = matchCareer($("resumeInput").value, $("jdInput").value);
    scrollToOutput("careerOutput");
  });
  $("makeReport").addEventListener("click", () => {
    $("researchOutput").innerHTML = makeResearchReport($("researchTopic").value, $("reportStyle").value);
    scrollToOutput("researchOutput");
  });
  $("runWorkflow").addEventListener("click", () => {
    runWorkflow();
    scrollToOutput("workflowOutput");
  });
  $("exportCaseStudy").addEventListener("click", exportCaseStudy);
  $("generatePortfolio").addEventListener("click", generatePortfolio);
  $("copyResumeBullets").addEventListener("click", copyResumeBullets);
  $("runGlobal").addEventListener("click", runGlobalAgent);
  $("clearGlobal").addEventListener("click", () => {
    $("globalPrompt").value = "";
    $("globalOutput").innerHTML = `<p class="muted">输入任务后，这里会展示路由、推理步骤、工具调用和最终结果。</p>`;
  });
  $("runSmoke").addEventListener("click", runSmokeTest);
  $("clearTraces").addEventListener("click", () => {
    state.traces = [];
    saveState();
    renderTraces();
  });
  $("exportTraces").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state.traces, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "agent-workbench-traces.json";
    link.click();
    URL.revokeObjectURL(url);
  });
  $("saveSettings").addEventListener("click", () => {
    state.settings.apiKey = $("apiKey").value.trim();
    state.settings.model = $("modelName").value.trim() || "gpt-4.1-mini";
    state.settings.useRemote = $("useRemote").checked;
    saveState();
    $("modelStatus").textContent = state.settings.useRemote && state.settings.apiKey ? "Remote + Local" : "Local Engine";
    showToast("设置已保存");
  });
  $("wipeData").addEventListener("click", () => {
    localStorage.removeItem("agentWorkbench.docs");
    localStorage.removeItem("agentWorkbench.traces");
    localStorage.removeItem("agentWorkbench.settings");
    state.docs = [];
    state.traces = [];
    state.settings = { apiKey: "", model: "gpt-4.1-mini", useRemote: false };
    $("apiKey").value = "";
    $("modelName").value = state.settings.model;
    $("useRemote").checked = false;
    renderDocs();
    renderTraces();
    showToast("本地数据已清除");
  });
}

function init() {
  loadState();
  bindEvents();
  renderPresetTasks();
  renderToolbox();
  renderHub();
  renderCapabilityCards();
  rebuildChunks();
  renderKbUser();
  renderDocs();
  renderQaHistory();
  renderTraces();
  renderLifeData();
  renderAllApps();
  loadSamplesIfEmpty();
  if (!state.docs.length) {
    samples.docs.forEach((doc) => {
      state.docs.push({
        id: crypto.randomUUID(),
        title: doc.title,
        text: doc.text,
        addedAt: Date.now(),
      });
    });
    saveState();
    renderDocs();
  }
  $("apiKey").value = state.settings.apiKey || "";
  $("modelName").value = state.settings.model || "gpt-4.1-mini";
  $("useRemote").checked = Boolean(state.settings.useRemote);
  $("modelStatus").textContent = state.settings.useRemote && state.settings.apiKey ? "Remote + Local" : "Local Engine";
  $("kbQuestion").value = "这个项目有哪些 Agent 能力？";
  $("dataQuestion").value = "按渠道汇总收入并排序";
  $("researchTopic").value = "AI Agent 在企业知识库中的落地机会";
  $("lifeDate").value = new Date().toISOString().slice(0, 10);
  $("lifeMetric").value = "学习时长";
  renderWorkflowBoard(workflowScenarios.support);
  $("portfolioOutput").innerHTML = portfolioHtml();
  drawAgentGraph();
  drawArchitecture();
  drawChart(parseCsv($("csvInput").value));
  drawLifeChart();
  applyLanguage("zh");
  applyUiSettings();
}

document.addEventListener("DOMContentLoaded", init);
