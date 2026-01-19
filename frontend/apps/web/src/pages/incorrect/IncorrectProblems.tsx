import { useParams } from 'react-router-dom';

const IncorrectProblems = () => {
  const { setId } = useParams<{ setId: string }>();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">错题本</h1>
      <p className="text-gray-600">Incorrect Problems Page - 待实现</p>
      <p className="text-sm text-gray-500 mt-2">
        题集 ID: {setId}
      </p>
      <p className="text-sm text-gray-500">
        此页面将展示错题列表，调用 GET /api/problem/get-incorrect/{setId}
      </p>
    </div>
  );
};

export default IncorrectProblems;
