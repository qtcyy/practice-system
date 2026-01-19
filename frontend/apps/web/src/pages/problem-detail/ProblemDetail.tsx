import { useEffect, useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  Tag,
  Toast,
  RadioGroup,
  Radio,
  Checkbox,
  TextArea,
  Spin,
} from '@douyinfe/semi-ui-19';
import type { TagColor } from '@douyinfe/semi-ui-19/lib/es/tag/interface';
import { useProblem } from '../../hooks/problem/useProblem';
import ProblemGridSelector, {
  ProblemStatus,
} from '../../components/ProblemGridSelector';

type UserAnswerState = {
  singleChoiceAnswer: string | null;
  multipleChoiceAnswers: string[];
  trueFalseAnswer: string | null;
  essayAnswer: string;
};

const ProblemDetail = () => {
  const { setId } = useParams<{ setId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const problemId = searchParams.get('problemId');
  const navigate = useNavigate();

  // 使用 useProblem hook
  const {
    problems,
    problemDetail,
    initLoading,
    detailLoading,
    submitLoading,
    loadProblems,
    loadProblemDetail,
    submitAnswer,
  } = useProblem();

  // 状态管理
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(
    problemId,
  );
  const [userAnswer, setUserAnswer] = useState<UserAnswerState>({
    singleChoiceAnswer: null,
    multipleChoiceAnswers: [],
    trueFalseAnswer: null,
    essayAnswer: '',
  });
  const [gradingResult, setGradingResult] = useState<ProblemStatus | null>(
    null,
  );
  const [showAnswer, setShowAnswer] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 初始化加载题目列表
  useEffect(() => {
    if (setId) {
      loadProblems(setId);
    }
  }, [setId]);

  // 加载题目详情
  useEffect(() => {
    if (selectedProblemId) {
      loadProblemDetail(selectedProblemId, (detail) => {
        // 填充用户答案（如果已作答）
        if (detail.userAnswer) {
          populateUserAnswer(detail);
          // 单选题和判断题可以随时更改，不设置 isSubmitted
          // 多选题和论述题需要用户手动提交，设置为已提交状态
          if (detail.type === 1 || detail.type === 3) {
            setIsSubmitted(true);
          } else {
            setIsSubmitted(false);
          }
          // 如果已提交，重新计算判分结果
          const result = gradeProblem(detail.type, detail.results, {
            singleChoiceAnswer:
              detail.selectedResultId && detail.selectedResultId.length > 0
                ? detail.selectedResultId[0]
                : null,
            multipleChoiceAnswers: detail.selectedResultId || [],
            trueFalseAnswer:
              detail.selectedResultId && detail.selectedResultId.length > 0
                ? detail.selectedResultId[0]
                : null,
            essayAnswer: detail.userAnswer?.textAnswer || '',
          });
          setGradingResult(result);
          setShowAnswer(
            result === ProblemStatus.Incorrect ||
              result === ProblemStatus.PartiallyCorrect,
          );
        } else {
          resetUserAnswer();
          setIsSubmitted(false);
          setGradingResult(null);
          setShowAnswer(false);
        }
      });
    }
  }, [selectedProblemId]);

  // 填充用户答案
  const populateUserAnswer = (detail: any) => {
    if (detail.type === 0 || detail.type === 2) {
      // 单选题或判断题
      const answerId =
        detail.selectedResultId && detail.selectedResultId.length > 0
          ? detail.selectedResultId[0]
          : null;
      setUserAnswer({
        singleChoiceAnswer: detail.type === 0 ? answerId : null,
        multipleChoiceAnswers: [],
        trueFalseAnswer: detail.type === 2 ? answerId : null,
        essayAnswer: '',
      });
    } else if (detail.type === 1) {
      // 多选题
      setUserAnswer({
        singleChoiceAnswer: null,
        multipleChoiceAnswers: detail.selectedResultId || [],
        trueFalseAnswer: null,
        essayAnswer: '',
      });
    } else if (detail.type === 3) {
      // 论述题
      setUserAnswer({
        singleChoiceAnswer: null,
        multipleChoiceAnswers: [],
        trueFalseAnswer: null,
        essayAnswer: detail.userAnswer?.textAnswer || '',
      });
    }
  };

  // 重置用户答案
  const resetUserAnswer = () => {
    setUserAnswer({
      singleChoiceAnswer: null,
      multipleChoiceAnswers: [],
      trueFalseAnswer: null,
      essayAnswer: '',
    });
  };

  // 前端判分逻辑
  const gradeProblem = (
    problemType: number,
    results: any[],
    answer: UserAnswerState,
  ): ProblemStatus => {
    switch (problemType) {
      case 0: // 单选题
        return gradeSingleChoice(results, answer.singleChoiceAnswer);
      case 1: // 多选题
        return gradeMultipleChoice(results, answer.multipleChoiceAnswers);
      case 2: // 判断题
        return gradeTrueFalse(results, answer.trueFalseAnswer);
      case 3: // 论述题
        return gradeEssay(answer.essayAnswer);
      default:
        return ProblemStatus.Unattempted;
    }
  };

  // 单选题判分
  const gradeSingleChoice = (
    results: any[],
    answer: string | null,
  ): ProblemStatus => {
    if (!answer) return ProblemStatus.Unattempted;

    const correctResult = results.find((r) => r.isAnswer);
    return answer === correctResult?.id
      ? ProblemStatus.Correct
      : ProblemStatus.Incorrect;
  };

  // 多选题判分
  const gradeMultipleChoice = (
    results: any[],
    answers: string[],
  ): ProblemStatus => {
    if (answers.length === 0) return ProblemStatus.Unattempted;

    const correctIds = results.filter((r) => r.isAnswer).map((r) => r.id);
    const selectedIds = answers;

    // 完全匹配
    if (
      correctIds.length === selectedIds.length &&
      correctIds.every((id) => selectedIds.includes(id))
    ) {
      return ProblemStatus.Correct;
    }

    // 部分匹配
    const hasCorrect = selectedIds.some((id) => correctIds.includes(id));

    if (hasCorrect) {
      return ProblemStatus.PartiallyCorrect;
    }

    return ProblemStatus.Incorrect;
  };

  // 判断题判分
  const gradeTrueFalse = (
    results: any[],
    answer: string | null,
  ): ProblemStatus => {
    return gradeSingleChoice(results, answer);
  };

  // 论述题判分
  const gradeEssay = (answer: string): ProblemStatus => {
    if (!answer || answer.trim() === '') return ProblemStatus.Unattempted;

    // 只要写了就算部分正确（需要人工评分）
    return ProblemStatus.PartiallyCorrect;
  };

  // 处理答案变化（即时判分）
  const handleAnswerChange = (
    newAnswer: Partial<UserAnswerState>,
    autoSubmit = false,
  ) => {
    const updatedAnswer = { ...userAnswer, ...newAnswer };
    setUserAnswer(updatedAnswer);

    if (problemDetail) {
      // 实时判分
      const result = gradeProblem(
        problemDetail.type,
        problemDetail.results,
        updatedAnswer,
      );
      setGradingResult(result);

      // 如果错误，展示正确答案
      if (
        result === ProblemStatus.Incorrect ||
        result === ProblemStatus.PartiallyCorrect
      ) {
        setShowAnswer(true);
      } else {
        setShowAnswer(false);
      }

      // 单选题和判断题自动提交
      if (autoSubmit && selectedProblemId) {
        // 构建提交数据
        let selectedResultIds: string[] | undefined = undefined;
        let textAnswer: string | undefined = undefined;

        if (problemDetail.type === 0) {
          // 单选题
          selectedResultIds = updatedAnswer.singleChoiceAnswer
            ? [updatedAnswer.singleChoiceAnswer]
            : undefined;
        } else if (problemDetail.type === 2) {
          // 判断题
          selectedResultIds = updatedAnswer.trueFalseAnswer
            ? [updatedAnswer.trueFalseAnswer]
            : undefined;
        }

        // 异步提交，不阻塞用户操作
        if (selectedResultIds) {
          submitAnswer({
            problemId: selectedProblemId,
            problemSetId: setId,
            selectedResultIds,
            textAnswer,
            status: result,
            onSuccess: () => {
              // 单选题和判断题不设置 isSubmitted，因为可以随时更改
              // 静默刷新题目列表（更新网格状态）
              if (setId) {
                loadProblems(setId);
              }
            },
          });
        }
      }
    }
  };

  // 提交答案
  const handleSubmit = () => {
    if (!problemDetail || !selectedProblemId) return;

    // 检查是否已选择答案
    const hasAnswer =
      userAnswer.singleChoiceAnswer ||
      userAnswer.multipleChoiceAnswers.length > 0 ||
      userAnswer.trueFalseAnswer ||
      userAnswer.essayAnswer.trim() !== '';

    if (!hasAnswer) {
      Toast.warning('请先选择或输入答案');
      return;
    }

    // 构建提交数据
    let selectedResultIds: string[] | undefined = undefined;
    let textAnswer: string | undefined = undefined;

    if (problemDetail.type === 0) {
      // 单选题
      selectedResultIds = userAnswer.singleChoiceAnswer
        ? [userAnswer.singleChoiceAnswer]
        : undefined;
    } else if (problemDetail.type === 1) {
      // 多选题
      selectedResultIds =
        userAnswer.multipleChoiceAnswers.length > 0
          ? userAnswer.multipleChoiceAnswers
          : undefined;
    } else if (problemDetail.type === 2) {
      // 判断题
      selectedResultIds = userAnswer.trueFalseAnswer
        ? [userAnswer.trueFalseAnswer]
        : undefined;
    } else if (problemDetail.type === 3) {
      // 论述题
      textAnswer = userAnswer.essayAnswer;
    }

    // 调用 submitAnswer
    submitAnswer({
      problemId: selectedProblemId,
      problemSetId: setId,
      selectedResultIds,
      textAnswer,
      status: gradingResult || ProblemStatus.Unattempted,
      onSuccess: () => {
        setIsSubmitted(true);
        Toast.success('答案提交成功');
        // 刷新题目列表以更新状态
        if (setId) {
          loadProblems(setId);
        }
      },
    });
  };

  // 重新作答（仅用于多选题和论述题）
  const handleRetry = () => {
    if (problemDetail) {
      if (problemDetail.type === 1) {
        // 多选题：清空选择
        setUserAnswer((prev) => ({
          ...prev,
          multipleChoiceAnswers: [],
        }));
      } else if (problemDetail.type === 3) {
        // 论述题：清空文本
        setUserAnswer((prev) => ({
          ...prev,
          essayAnswer: '',
        }));
      }
    }
    setIsSubmitted(false);
    setGradingResult(null);
    setShowAnswer(false);
  };

  // 切换题目
  const handleProblemSelect = (problemId: string | null) => {
    if (problemId) {
      setSelectedProblemId(problemId);
      setSearchParams({ problemId });
    }
  };

  // 返回列表
  const handleBack = () => {
    navigate(`/app/problem-set/${setId}`);
  };

  // 获取题目类型标签
  const getProblemTypeLabel = (
    type: number,
  ): { text: string; color: TagColor } => {
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

  // 获取判分结果标签
  const getGradingResultTag = () => {
    if (!gradingResult) return null;

    switch (gradingResult) {
      case ProblemStatus.Correct:
        return <Tag color="green">正确 ✓</Tag>;
      case ProblemStatus.Incorrect:
        return <Tag color="red">错误 ✗</Tag>;
      case ProblemStatus.PartiallyCorrect:
        return <Tag color="yellow">部分正确</Tag>;
      case ProblemStatus.Unattempted:
        return <Tag color="grey">未作答</Tag>;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* 左侧答题区 */}
      <div className="flex-1 p-6 max-w-[calc(100%-320px)]">
        {detailLoading ? (
          <div className="flex justify-center items-center py-20">
            <Spin size="large" tip="加载中..." />
          </div>
        ) : problemDetail ? (
          <Card className="min-h-[700px]">
            {/* 题目头部 */}
            <div className="mb-6 pb-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold">
                    题目{' '}
                    {problems.findIndex((p) => p.id === selectedProblemId) + 1}
                  </h2>
                  <Tag color={getProblemTypeLabel(problemDetail.type).color}>
                    {getProblemTypeLabel(problemDetail.type).text}
                  </Tag>
                  {getGradingResultTag()}
                </div>
                <Button onClick={handleBack}>返回列表</Button>
              </div>
              <p className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap">
                {problemDetail.content}
              </p>
            </div>

            {/* 答题区域 */}
            <div className="mb-6">
              {/* 单选题 */}
              {problemDetail.type === 0 && (
                <div className="space-y-3">
                  <RadioGroup
                    value={userAnswer.singleChoiceAnswer ?? undefined}
                    onChange={(e) =>
                      handleAnswerChange(
                        {
                          singleChoiceAnswer: e.target.value as string,
                        },
                        true,
                      )
                    }
                  >
                    {problemDetail.results.map((result: any, index: number) => (
                      <div
                        key={result.id}
                        className={`p-4 border rounded-lg transition-colors ${
                          showAnswer && result.isAnswer
                            ? 'border-green-500 bg-green-50'
                            : showAnswer &&
                                userAnswer.singleChoiceAnswer === result.id &&
                                !result.isAnswer
                              ? 'border-red-500 bg-red-50'
                              : ''
                        }`}
                      >
                        <Radio value={result.id}>
                          <span className="text-base">
                            {String.fromCharCode(65 + index)}. {result.content}
                          </span>
                          {showAnswer && result.isAnswer && (
                            <Tag color="green" className="ml-2">
                              正确答案
                            </Tag>
                          )}
                        </Radio>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* 多选题 */}
              {problemDetail.type === 1 && (
                <div className="space-y-3">
                  {problemDetail.results.map((result: any, index: number) => (
                    <div
                      key={result.id}
                      className={`p-4 border rounded-lg transition-colors ${
                        showAnswer && result.isAnswer
                          ? 'border-green-500 bg-green-50'
                          : showAnswer &&
                              userAnswer.multipleChoiceAnswers.includes(
                                result.id,
                              ) &&
                              !result.isAnswer
                            ? 'border-red-500 bg-red-50'
                            : ''
                      }`}
                    >
                      <Checkbox
                        value={result.id}
                        checked={userAnswer.multipleChoiceAnswers.includes(
                          result.id,
                        )}
                        onChange={(e) => {
                          const isChecked = e?.target?.checked ?? false;
                          handleAnswerChange({
                            multipleChoiceAnswers: isChecked
                              ? [
                                  ...userAnswer.multipleChoiceAnswers,
                                  result.id,
                                ]
                              : userAnswer.multipleChoiceAnswers.filter(
                                  (id) => id !== result.id,
                                ),
                          });
                        }}
                      >
                        <span className="text-base">
                          {String.fromCharCode(65 + index)}. {result.content}
                        </span>
                        {showAnswer && result.isAnswer && (
                          <Tag color="green" className="ml-2">
                            正确答案
                          </Tag>
                        )}
                      </Checkbox>
                    </div>
                  ))}
                </div>
              )}

              {/* 判断题 */}
              {problemDetail.type === 2 && (
                <div className="space-y-3">
                  <RadioGroup
                    value={userAnswer.trueFalseAnswer ?? undefined}
                    onChange={(e) =>
                      handleAnswerChange(
                        {
                          trueFalseAnswer: e.target.value as string,
                        },
                        true,
                      )
                    }
                    type="button"
                    buttonSize="large"
                  >
                    {problemDetail.results.map((result: any) => (
                      <Radio
                        key={result.id}
                        value={result.id}
                        className={`${
                          showAnswer && result.isAnswer
                            ? 'border-green-500'
                            : showAnswer &&
                                userAnswer.trueFalseAnswer === result.id &&
                                !result.isAnswer
                              ? 'border-red-500'
                              : ''
                        }`}
                      >
                        {result.content}
                        {showAnswer && result.isAnswer && (
                          <Tag color="green" className="ml-2">
                            ✓
                          </Tag>
                        )}
                      </Radio>
                    ))}
                  </RadioGroup>
                </div>
              )}

              {/* 论述题 */}
              {problemDetail.type === 3 && (
                <div className="space-y-3">
                  <TextArea
                    value={userAnswer.essayAnswer}
                    onChange={(value) =>
                      handleAnswerChange({ essayAnswer: value })
                    }
                    placeholder="请输入你的答案..."
                    rows={10}
                    maxLength={2000}
                    showClear
                  />
                  {showAnswer &&
                    problemDetail.results[0]?.content &&
                    isSubmitted && (
                      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="font-semibold mb-2">参考答案：</div>
                        <div className="text-gray-700 whitespace-pre-wrap">
                          {problemDetail.results[0].content}
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>

            {/* 操作按钮 - 只在多选题和论述题显示 */}
            {(problemDetail.type === 1 || problemDetail.type === 3) && (
              <div className="flex gap-3 justify-end pt-6 border-t">
                {!isSubmitted ? (
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleSubmit}
                    loading={submitLoading}
                    disabled={submitLoading}
                  >
                    提交答案
                  </Button>
                ) : (
                  <Button
                    size="large"
                    onClick={handleRetry}
                    disabled={submitLoading}
                  >
                    重新作答
                  </Button>
                )}
              </div>
            )}
          </Card>
        ) : (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-500">请从右侧选择一道题目</p>
          </div>
        )}
      </div>

      {/* 右侧题目选择器面板 */}
      <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white border-l shadow-lg">
        <ProblemGridSelector
          problems={problems}
          selectedProblemId={selectedProblemId}
          onSelect={handleProblemSelect}
          mode="answer"
          loading={initLoading}
        />
      </div>
    </div>
  );
};

export default ProblemDetail;
