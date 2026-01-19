import { useEffect } from 'react';
import { useProblemSet } from 'src/hooks/problem-set/useProblemSet';

const ProblemSets = () => {
  const { loadProblemSets, initLoading, problemSets } = useProblemSet();

  useEffect(() => {
    loadProblemSets((data) => console.log(data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">题集列表</h1>
      <p className="text-gray-600">Problem Sets Page - 待实现</p>
      <p className="text-sm text-gray-500 mt-2">
        此页面将展示所有题集，调用 GET /api/problem/get-set
      </p>
    </div>
  );
};

export default ProblemSets;
