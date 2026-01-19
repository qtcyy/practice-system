import { useEffect } from 'react';
import { Button, Spin, Empty } from '@douyinfe/semi-ui-19';
import { IconPlus } from '@douyinfe/semi-icons';
import { useProblemSet } from '../../hooks/problem-set/useProblemSet';
import ProblemSetCard from './ProblemSetCard';
import { useNavigate } from 'react-router-dom';

const ProblemSets = () => {
  const { loadProblemSets, initLoading, problemSets } = useProblemSet();
  const route = useNavigate();

  useEffect(() => {
    loadProblemSets();
  }, []);

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">题集列表</h1>
        <Button
          type="primary"
          icon={<IconPlus />}
          size="large"
          onClick={() => route('/app/create-set')}
        >
          创建题集
        </Button>
      </div>

      {/* 加载状态 */}
      {initLoading && (
        <div className="flex justify-center items-center py-20 text-nowrap">
          <Spin size="large" tip="加载中..." />
        </div>
      )}

      {/* 空状态 */}
      {!initLoading && problemSets.length === 0 && (
        <Empty title="暂无题集" description="创建你的第一个题集开始练习吧" />
      )}

      {/* 卡片网格 */}
      {!initLoading && problemSets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {problemSets.map((set) => (
            <ProblemSetCard key={set.id} problemSet={set} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProblemSets;
