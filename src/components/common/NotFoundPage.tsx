export default function NotFoundPage() {
  return (
    <div className="page-container flex flex-col items-center justify-center text-center">
      <span className="text-6xl">🔍</span>
      <h1 className="mt-4 text-2xl font-bold text-gray-800">页面未找到</h1>
      <p className="mt-2 text-gray-500">请返回首页继续学习</p>
      <a href="/english360-gpt/" className="btn-primary mt-6">
        返回首页
      </a>
    </div>
  );
}
