import { Spin } from '@douyinfe/semi-ui-19';
import { IconPlus } from '@douyinfe/semi-icons';

// 题目状态枚举（与后端一致）
export enum ProblemStatus {
  Unattempted = 0,      // 未作答
  Correct = 1,          // 正确
  Incorrect = 2,        // 错误
  PartiallyCorrect = 3, // 部分正确
  NoAnswer = 4,         // 未提交答案
}

type ProblemDto = {
  id: string;
  content: string;
  type: number;
  setId: string;
  order: number;
  status?: ProblemStatus;
  createAt: string;
  updateAt: string;
};

interface ProblemGridSelectorProps {
  problems: ProblemDto[];
  selectedProblemId: string | null;
  onSelect: (problemId: string | null) => void;
  mode: 'edit' | 'answer';
  loading?: boolean;
  className?: string;
}

const ProblemGridSelector = ({
  problems,
  selectedProblemId,
  onSelect,
  mode,
  loading = false,
  className = '',
}: ProblemGridSelectorProps) => {
  // 状态颜色映射
  const statusStyles = {
    edit: {
      default: 'border-blue-300 bg-white text-blue-600',
      selected: 'border-blue-600 bg-blue-600 text-white',
      hover: 'hover:shadow-md hover:border-blue-400',
    },
    answer: {
      [ProblemStatus.Unattempted]: 'border-gray-300 bg-white text-gray-600',
      [ProblemStatus.Correct]: 'border-green-500 bg-green-500 text-white',
      [ProblemStatus.Incorrect]: 'border-red-500 bg-red-500 text-white',
      [ProblemStatus.PartiallyCorrect]:
        'border-yellow-500 bg-yellow-500 text-white',
      [ProblemStatus.NoAnswer]: 'border-orange-400 bg-white text-orange-600',
    },
  };

  return (
    <div className={`problem-grid-selector h-full flex flex-col p-4 ${className}`}>
      {/* 标题栏 */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b">
        <h3 className="text-lg font-semibold">题目选择</h3>
        {loading && <Spin size="small" />}
      </div>

      {/* 网格容器（可滚动） */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-4 gap-3">
          {/* 新建按钮（仅编辑模式） */}
          {mode === 'edit' && (
            <button
              className="w-12 h-12 flex items-center justify-center rounded-lg border-2 border-dashed border-blue-400 hover:border-blue-600 hover:bg-blue-50 transition-colors"
              onClick={() => onSelect(null)}
              title="新建题目"
            >
              <IconPlus className="text-blue-600" />
            </button>
          )}

          {/* 题目格子 */}
          {problems.map((problem, index) => {
            const isSelected = selectedProblemId === problem.id;

            // 根据模式确定样式
            const statusClass =
              mode === 'edit'
                ? isSelected
                  ? statusStyles.edit.selected
                  : statusStyles.edit.default
                : statusStyles.answer[problem.status || ProblemStatus.Unattempted];

            return (
              <button
                key={problem.id}
                className={`w-12 h-12 flex items-center justify-center rounded-lg border-2 font-semibold transition-all ${statusClass} ${statusStyles.edit.hover} ${isSelected ? 'ring-2 ring-blue-400' : ''}`}
                onClick={() => onSelect(problem.id)}
                title={`题目 ${index + 1}`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* 状态图例（答题模式） */}
      {mode === 'answer' && (
        <div className="flex flex-col gap-2 mt-4 pt-4 border-t text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-gray-300 rounded shrink-0" />
            <span>未作答</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded shrink-0" />
            <span>正确</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded shrink-0" />
            <span>错误</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded shrink-0" />
            <span>部分正确</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-orange-400 rounded shrink-0" />
            <span>未提交</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemGridSelector;
