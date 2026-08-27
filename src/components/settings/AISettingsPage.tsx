import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  loadAISettings,
  saveAISettings,
  fetchModels,
  isAIConfigured,
  type AISettings,
  type ModelInfo,
} from "../../services/ai-settings";

// ============================================================
// Preset API endpoints
// ============================================================

const PRESETS: { label: string; baseUrl: string; hint: string }[] = [
  { label: "OpenAI", baseUrl: "https://api.openai.com/v1", hint: "GPT-4o / GPT-3.5-turbo" },
  { label: "DeepSeek", baseUrl: "https://api.deepseek.com/v1", hint: "deepseek-chat / deepseek-coder" },
  { label: "Claude (via OpenAI compat)", baseUrl: "https://api.anthropic.com/v1", hint: "claude-3-haiku" },
  { label: "通义千问", baseUrl: "https://dashscope.aliyuncs.com/compatible-mode/v1", hint: "qwen-turbo" },
  { label: "本地模型", baseUrl: "http://localhost:11434/v1", hint: "Ollama / LM Studio" },
  { label: "自定义", baseUrl: "", hint: "输入自定义地址" },
];

export default function AISettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<AISettings>(loadAISettings());
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState("");
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testing, setTesting] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [customUrl, setCustomUrl] = useState("");
  const [manualModel, setManualModel] = useState("");

  // Load saved settings
  useEffect(() => {
    const saved = loadAISettings();
    setSettings(saved);
    if (saved.baseUrl) {
      const match = PRESETS.find((p) => p.baseUrl === saved.baseUrl);
      if (match) setSelectedPreset(match.label);
      else {
        setSelectedPreset("自定义");
        setCustomUrl(saved.baseUrl);
      }
    }
  }, []);

  // Handle preset selection
  const handlePresetChange = useCallback((label: string) => {
    setSelectedPreset(label);
    const preset = PRESETS.find((p) => p.label === label);
    if (preset && preset.baseUrl) {
      setSettings((s) => ({ ...s, baseUrl: preset.baseUrl }));
    }
  }, []);

  // Fetch models
  const handleFetchModels = useCallback(async () => {
    setFetching(true);
    setFetchError("");
    setTestResult(null);

    try {
      const models = await fetchModels(settings.baseUrl, settings.apiKey);
      if (models.length === 0) {
        setFetchError("未获取到模型列表。请检查 API 地址和密钥。");
      } else {
        setSettings((s) => ({
          ...s,
          availableModels: models,
          model: s.model || models[0].id,
          enabled: true,
          provider: "openai",
        }));
      }
    } catch (e) {
      setFetchError(`获取失败: ${e instanceof Error ? e.message : "网络错误"}`);
    } finally {
      setFetching(false);
    }
  }, [settings.baseUrl, settings.apiKey]);

  // Test chat
  const handleTest = useCallback(async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const { chatWithAI } = await import("../../services/ai-settings");
      const reply = await chatWithAI(
        [
          { role: "system", content: "You are a friendly English teacher for Chinese beginners. Reply in English with Chinese explanations." },
          { role: "user", content: "Hello! Can you teach me a simple English sentence?" },
        ],
        settings
      );
      setTestResult(reply);
    } catch (e) {
      setTestResult(`❌ 测试失败: ${e instanceof Error ? e.message : "未知错误"}`);
    } finally {
      setTesting(false);
    }
  }, [settings]);

  // Save
  const handleSave = useCallback(() => {
    saveAISettings(settings);
    navigate("/");
  }, [settings, navigate]);

  // Disable AI (use local mock)
  const handleDisable = useCallback(() => {
    const disabled: AISettings = {
      ...settings,
      enabled: false,
      provider: "local",
      apiKey: "",
      model: "",
      availableModels: [],
    };
    setSettings(disabled);
    saveAISettings(disabled);
  }, [settings]);

  const configured = isAIConfigured();

  return (
    <div className="min-h-dvh bg-gradient-to-b from-blue-50 to-indigo-50 px-4 py-6">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="text-2xl">
            ←
          </button>
          <h1 className="text-lg font-bold text-gray-900">🤖 AI 设置</h1>
          <div className="w-8" />
        </div>

        {/* Status */}
        <div
          className={`mb-6 rounded-xl p-4 ${
            configured ? "bg-green-50 text-green-800" : "bg-gray-100 text-gray-600"
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">{configured ? "✅" : "⚠️"}</span>
            <div>
              <div className="font-semibold">
                {configured ? "AI 已配置" : "使用本地模式"}
              </div>
              <div className="text-sm opacity-70">
                {configured
                  ? `${settings.model} @ ${new URL(settings.baseUrl).hostname}`
                  : "未配置 AI，问答使用本地规则引擎"}
              </div>
            </div>
          </div>
        </div>

        {/* Step 1: Choose Provider */}
        <div className="mb-5 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-bold text-gray-700">
            第一步：选择服务商
          </h2>
          <div className="space-y-2">
            {PRESETS.map((p) => (
              <label
                key={p.label}
                className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition-colors ${
                  selectedPreset === p.label
                    ? "border-primary-500 bg-primary-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="preset"
                  checked={selectedPreset === p.label}
                  onChange={() => handlePresetChange(p.label)}
                  className="accent-primary-500"
                />
                <div>
                  <div className="font-medium text-gray-800">{p.label}</div>
                  <div className="text-xs text-gray-500">{p.hint}</div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Step 2: API Key */}
        <div className="mb-5 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-bold text-gray-700">
            第二步：填写 API Key
          </h2>
          <input
            type="password"
            placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
            value={settings.apiKey}
            onChange={(e) =>
              setSettings((s) => ({ ...s, apiKey: e.target.value }))
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
          />
          <p className="mt-2 text-xs text-gray-400">
            🔒 密钥仅保存在你的浏览器本地，不会上传到任何服务器
          </p>
        </div>

        {/* Step 2.5: Base URL */}
        <div className="mb-5 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-bold text-gray-700">
            API 地址
          </h2>
          {selectedPreset === "自定义" ? (
            <input
              type="url"
              placeholder="https://your-api.com/v1"
              value={customUrl}
              onChange={(e) => {
                setCustomUrl(e.target.value);
                setSettings((s) => ({ ...s, baseUrl: e.target.value }));
              }}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          ) : (
            <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
              {settings.baseUrl}
            </div>
          )}
          <p className="mt-2 text-xs text-gray-400">
            支持所有 OpenAI 兼容 API（OpenAI / DeepSeek / 通义千问 / Ollama / LM Studio 等）
          </p>
        </div>

        {/* Step 3: Fetch Models */}
        <div className="mb-5 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-bold text-gray-700">
            第三步：获取并选择模型
          </h2>
          <button
            onClick={handleFetchModels}
            disabled={!settings.apiKey || fetching}
            className="mb-3 w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
          >
            {fetching ? "⏳ 正在获取模型列表..." : "🔍 获取可用模型"}
          </button>

          {/* Manual model input */}
          <div className="mt-3 flex gap-2">
            <input
              type="text"
              placeholder="手动输入模型名称，如 gpt-4o-mini"
              value={manualModel}
              onChange={(e) => setManualModel(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && manualModel.trim()) {
                  e.preventDefault();
                  const modelId = manualModel.trim();
                  const exists = settings.availableModels.some(m => m.id === modelId);
                  if (!exists) {
                    setSettings(s => ({
                      ...s,
                      availableModels: [...s.availableModels, { id: modelId, name: modelId }],
                      model: modelId,
                      enabled: true,
                    }));
                  } else {
                    setSettings(s => ({ ...s, model: modelId }));
                  }
                  setManualModel("");
                }
              }}
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
            <button
              onClick={() => {
                if (!manualModel.trim()) return;
                const modelId = manualModel.trim();
                const exists = settings.availableModels.some(m => m.id === modelId);
                if (!exists) {
                  setSettings(s => ({
                    ...s,
                    availableModels: [...s.availableModels, { id: modelId, name: modelId }],
                    model: modelId,
                    enabled: true,
                  }));
                } else {
                  setSettings(s => ({ ...s, model: modelId }));
                }
                setManualModel("");
              }}
              disabled={!manualModel.trim()}
              className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              ➕ 添加
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-400">
            如果 API 获取不到模型列表，可以手动输入模型名称后点击添加
          </p>

          {fetchError && (
            <div className="mb-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
              {fetchError}
            </div>
          )}

          {settings.availableModels.length > 0 && (
            <div className="space-y-1">
              <label className="mb-1 block text-xs text-gray-500">
                共 {settings.availableModels.length} 个模型可选：
              </label>
              <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200">
                {settings.availableModels.map((m: ModelInfo) => (
                  <label
                    key={m.id}
                    className={`flex cursor-pointer items-center gap-2 border-b border-gray-100 px-3 py-2 text-sm last:border-0 hover:bg-gray-50 ${
                      settings.model === m.id ? "bg-primary-50 font-medium text-primary-700" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="model"
                      checked={settings.model === m.id}
                      onChange={() =>
                        setSettings((s) => ({ ...s, model: m.id }))
                      }
                      className="accent-primary-500"
                    />
                    <span className="truncate">{m.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {!settings.apiKey && (
            <p className="mt-2 text-xs text-gray-400">
              请先填写 API Key 再获取模型列表
            </p>
          )}
        </div>

        {/* Step 4: Test */}
        {settings.model && (
          <div className="mb-5 rounded-xl bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-bold text-gray-700">
              第四步：测试对话
            </h2>
            <button
              onClick={handleTest}
              disabled={testing}
              className="mb-3 w-full rounded-lg bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
            >
              {testing ? "⏳ 测试中..." : "🧪 发送测试消息"}
            </button>
            {testResult && (
              <div className="rounded-lg bg-green-50 p-4 text-sm text-green-800 whitespace-pre-wrap">
                {testResult}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleSave}
            className="w-full rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white shadow hover:bg-primary-700"
          >
            {configured ? "✅ 保存并返回" : "📝 保存设置（继续使用本地模式）"}
          </button>
          {configured && (
            <button
              onClick={handleDisable}
              className="w-full rounded-xl bg-red-50 px-6 py-3 font-semibold text-red-600 hover:bg-red-100"
            >
              🚫 关闭 AI（恢复本地模式）
            </button>
          )}
        </div>

        {/* Info */}
        <div className="mt-6 rounded-xl bg-blue-50 p-4 text-xs text-blue-700">
          <div className="mb-1 font-semibold">💡 使用说明</div>
          <ul className="list-inside list-disc space-y-1">
            <li>不配置 AI → 所有问答、对话使用本地规则引擎，完全离线可用</li>
            <li>配置 AI → 问答和对话由真实大模型回答，更智能更灵活</li>
            <li>推荐：DeepSeek（便宜好用）或 OpenAI GPT-4o（最强）</li>
            <li>本地用户：可装 Ollama 后用 localhost 地址</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
