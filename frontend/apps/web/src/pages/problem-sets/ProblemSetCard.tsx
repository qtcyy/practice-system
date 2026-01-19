import { Button } from '@douyinfe/semi-ui-19';
import { useNavigate } from 'react-router-dom';

interface ProblemSetCardProps {
  problemSet: {
    id: string;
    title: string;
    description?: string;
    totalProblems: number;
    attemptedProblems: number;
    createAt: string;
  };
}

const ProblemSetCard = ({ problemSet }: ProblemSetCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/app/problem-set/${problemSet.id}`);
  };

  return (
    <div
      className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
      onClick={handleClick}
    >
      {/* 标题 */}
      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
        {problemSet.title}
      </h3>

      {/* 描述 */}
      {problemSet.description && (
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {problemSet.description}
        </p>
      )}

      {/* 统计信息 */}
      <div className="space-y-2 text-sm text-gray-500 mb-4">
        <div className="flex items-center gap-2">
          <span>📝 共 {problemSet.totalProblems} 题</span>
          <span>✅ 已做 {problemSet.attemptedProblems} 题</span>
        </div>
        <div>
          🕐 创建时间：{new Date(problemSet.createAt).toLocaleDateString()}
        </div>
      </div>

      {/* 底部按钮 */}
      <Button
        block
        theme="light"
        onClick={(e) => {
          e.stopPropagation();
          handleClick();
        }}
      >
        查看详情
      </Button>
    </div>
  );
};

export default ProblemSetCard;
