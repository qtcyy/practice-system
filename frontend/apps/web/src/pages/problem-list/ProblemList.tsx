import { useParams } from 'react-router-dom';

const ProblemList = () => {
  const { setId } = useParams<{ setId: string }>();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">题目列表</h1>
      <p className="text-gray-600">Problem List Page - 待实现</p>
      <p className="text-sm text-gray-500 mt-2">
        题集 ID: {setId}
      </p>
      <p className="text-sm text-gray-500">
        此页面将展示题集中的所有题目，调用 GET /api/problem/get-problems/{setId}
      </p>
    </div>
  );
};

export default ProblemList;
