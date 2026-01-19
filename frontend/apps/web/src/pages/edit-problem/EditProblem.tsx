import { useParams } from 'react-router-dom';

const EditProblem = () => {
  const { setId } = useParams<{ setId: string }>();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">添加题目</h1>
      <p className="text-gray-600">Edit Problem Page - 待实现</p>
      <p className="text-sm text-gray-500 mt-2">
        题集 ID: {setId}
      </p>
      <p className="text-sm text-gray-500">
        此页面将提供添加题目的表单，调用 POST /api/problem/add-problem
      </p>
    </div>
  );
};

export default EditProblem;
