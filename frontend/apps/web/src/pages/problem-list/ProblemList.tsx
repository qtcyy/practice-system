import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spin, Empty, Card, Tag } from '@douyinfe/semi-ui-19';
import type { TagColor } from '@douyinfe/semi-ui-19/lib/es/tag/interface';
import { IconEdit, IconPlus } from '@douyinfe/semi-icons';
import { useProblem } from '../../hooks/problem/useProblem';

const ProblemList = () => {
  const { setId } = useParams<{ setId: string }>();
  const navigate = useNavigate();
  const { problems, initLoading, loadProblems } = useProblem();

  useEffect(() => {
    if (setId) {
      loadProblems(setId);
    }
  }, [setId]);

  const handleEdit = (problemId: string) => {
    navigate(`/app/edit-problem/${setId}?problemId=${problemId}`);
  };

  const handleAddProblem = () => {
    navigate(`/app/edit-problem/${setId}`);
  };

  const getProblemTypeLabel = (type: number): { text: string; color: TagColor } => {
    switch (type) {
      case 0:
        return { text: '单选题', color: 'blue' as TagColor };
      case 1:
        return { text: '多选题', color: 'purple' as TagColor };
      case 2:
        return { text: '判断题', color: 'green' as TagColor };
      case 3:
        return { text: '论述题', color: 'orange' as TagColor };
      default:
        return { text: '未知', color: 'grey' as TagColor };
    }
  };

  return (
    <div className="space-y-6">
      {/* 页面头部 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">题目列表</h1>
        <Button
          type="primary"
          icon={<IconPlus />}
          size="large"
          onClick={handleAddProblem}
        >
          添加题目
        </Button>
      </div>

      {/* 加载状态 */}
      {initLoading && (
        <div className="flex justify-center items-center py-20">
          <Spin size="large" tip="加载中..." />
        </div>
      )}

      {/* 空状态 */}
      {!initLoading && problems.length === 0 && (
        <Empty
          title="暂无题目"
          description="点击上方按钮添加第一道题目"
        />
      )}

      {/* 题目列表 */}
      {!initLoading && problems.length > 0 && (
        <div className="space-y-4">
          {problems.map((problem, index) => {
            const typeInfo = getProblemTypeLabel(problem.type);
            return (
              <Card
                key={problem.id}
                className="hover:shadow-lg transition-shadow"
                bodyStyle={{ padding: '20px' }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* 题目标题 */}
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-lg font-semibold text-gray-700">
                        题目 {index + 1}
                      </span>
                      <Tag color={typeInfo.color}>{typeInfo.text}</Tag>
                    </div>

                    {/* 题目内容 */}
                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap break-words">
                      {problem.content}
                    </p>

                    {/* 元数据 */}
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                      <span>创建时间: {new Date(problem.createAt).toLocaleDateString()}</span>
                      <span>顺序: {problem.order}</span>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex-shrink-0">
                    <Button
                      icon={<IconEdit />}
                      type="tertiary"
                      onClick={() => handleEdit(problem.id)}
                    >
                      编辑
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProblemList;
