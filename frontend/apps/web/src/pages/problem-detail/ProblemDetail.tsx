import { useParams } from 'react-router-dom';

const ProblemDetail = () => {
  const { problemId } = useParams<{ problemId: string }>();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">答题页面</h1>
      <p className="text-gray-600">Problem Detail Page - 待实现</p>
      <p className="text-sm text-gray-500 mt-2">
        题目 ID: {problemId}
      </p>
      <p className="text-sm text-gray-500">
        此页面将展示题目详情和答题界面，调用 GET /api/problem/get-detail/{problemId}
      </p>
    </div>
  );
};

export default ProblemDetail;
