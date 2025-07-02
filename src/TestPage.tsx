export const TestPage = () => {
	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<h1 className="text-4xl font-bold text-center mb-8">
				🧪 テストページ
			</h1>
			<div className="grid grid-cols-4 gap-4 max-w-4xl mx-auto">
				<div className="bg-blue-500 text-white p-4 rounded-lg text-center">
					<h2 className="text-xl font-bold">お父さん</h2>
					<p className="mt-2">Blue (#4285f4)</p>
				</div>
				<div className="bg-red-500 text-white p-4 rounded-lg text-center">
					<h2 className="text-xl font-bold">お母さん</h2>
					<p className="mt-2">Red (#ea4335)</p>
				</div>
				<div className="bg-green-500 text-white p-4 rounded-lg text-center">
					<h2 className="text-xl font-bold">長男</h2>
					<p className="mt-2">Green (#34a853)</p>
				</div>
				<div className="bg-yellow-500 text-white p-4 rounded-lg text-center">
					<h2 className="text-xl font-bold">次男</h2>
					<p className="mt-2">Yellow (#fbbc04)</p>
				</div>
			</div>
			<div className="text-center mt-8">
				<p className="text-lg text-gray-600">
					Tailwind CSS と基本的なReactが動作しています
				</p>
			</div>
		</div>
	);
};