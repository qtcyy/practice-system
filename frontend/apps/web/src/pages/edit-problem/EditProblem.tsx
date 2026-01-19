import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  Button,
  Toast,
  SideSheet,
  Input,
  TextArea,
  Select,
  Radio,
  RadioGroup,
  Checkbox,
} from '@douyinfe/semi-ui-19';
import { IconPlus, IconDelete, IconList } from '@douyinfe/semi-icons';
import { useProblem } from '../../hooks/problem/useProblem';
import ProblemGridSelector from '../../components/ProblemGridSelector';

type Option = {
  content: string;
  isAnswer?: boolean;
};

type FormData = {
  type: number;
  content: string;
  options: Option[];
  correctAnswer: number | null;
  referenceAnswer: string;
};

const EditProblem = () => {
  const navigate = useNavigate();
  const { setId } = useParams<{ setId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    problems,
    initLoading,
    detailLoading,
    addLoading,
    loadProblems,
    loadProblemDetail,
    addProblem,
  } = useProblem();

  const [problemType, setProblemType] = useState<number>(0);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(
    null,
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  // 表单数据
  const [formData, setFormData] = useState<FormData>({
    type: 0,
    content: '',
    options: [{ content: '' }, { content: '' }],
    correctAnswer: null,
    referenceAnswer: '',
  });

  // 验证错误
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 页面初始化时加载题目列表
  useEffect(() => {
    if (setId) {
      loadProblems(setId);
    }
  }, [setId]);

  // 从 URL 参数读取 problemId 并自动加载（当题目列表加载完成后）
  useEffect(() => {
    const problemId = searchParams.get('problemId');

    if (problemId && problems.length > 0) {
      // 检查 problemId 是否在题目列表中
      const problemExists = problems.some((p) => p.id === problemId);
      if (problemExists && selectedProblemId !== problemId) {
        setSelectedProblemId(problemId);
        setIsEditMode(true);
        loadProblemDetail(problemId, (detail) => {
          populateFormWithDetail(detail);
        });
      }
    }
  }, [problems, searchParams]);

  // 题号选择处理
  const handleProblemSelect = (problemId: string | null) => {
    if (problemId === null) {
      // 切换到新建模式
      resetForm();
    } else {
      // 切换到编辑模式，更新 URL 参数
      setSearchParams({ problemId });
      setSelectedProblemId(problemId);
      setIsEditMode(true);
      loadProblemDetail(problemId, (detail) => {
        populateFormWithDetail(detail);
      });
    }
  };

  // 重置表单
  const resetForm = () => {
    setSearchParams({});
    setSelectedProblemId(null);
    setIsEditMode(false);
    setProblemType(0);
    setFormData({
      type: 0,
      content: '',
      options: [{ content: '' }, { content: '' }],
      correctAnswer: null,
      referenceAnswer: '',
    });
    setErrors({});
  };

  // 加载题目详情到表单
  const populateFormWithDetail = (detail: any) => {
    const { type, content, results } = detail;

    setProblemType(type);

    if (type === 0) {
      // 单选题
      const options = results.map((r: any) => ({ content: r.content }));
      const correctIndex = results.findIndex((r: any) => r.isAnswer);
      setFormData({
        type,
        content,
        options,
        correctAnswer: correctIndex,
        referenceAnswer: '',
      });
    } else if (type === 1) {
      // 多选题
      const options = results.map((r: any) => ({
        content: r.content,
        isAnswer: r.isAnswer,
      }));
      setFormData({
        type,
        content,
        options,
        correctAnswer: null,
        referenceAnswer: '',
      });
    } else if (type === 2) {
      // 判断题
      const correctIndex = results.findIndex((r: any) => r.isAnswer);
      setFormData({
        type,
        content,
        options: [],
        correctAnswer: correctIndex,
        referenceAnswer: '',
      });
    } else if (type === 3) {
      // 论述题
      const referenceAnswer = results[0]?.content || '';
      setFormData({
        type,
        content,
        options: [],
        correctAnswer: null,
        referenceAnswer,
      });
    }
    setErrors({});
  };

  // 题目类型切换处理
  const handleTypeChange = (newType: number) => {
    if (newType === problemType) {
      return;
    }

    setProblemType(newType);

    // 重置选项相关字段
    if (newType === 0) {
      // 单选题
      setFormData((prev) => ({
        ...prev,
        type: newType,
        options: [{ content: '' }, { content: '' }],
        correctAnswer: null,
        referenceAnswer: '',
      }));
    } else if (newType === 1) {
      // 多选题
      setFormData((prev) => ({
        ...prev,
        type: newType,
        options: [
          { content: '', isAnswer: false },
          { content: '', isAnswer: false },
        ],
        correctAnswer: null,
        referenceAnswer: '',
      }));
    } else if (newType === 2) {
      // 判断题
      setFormData((prev) => ({
        ...prev,
        type: newType,
        options: [],
        correctAnswer: null,
        referenceAnswer: '',
      }));
    } else if (newType === 3) {
      // 论述题
      setFormData((prev) => ({
        ...prev,
        type: newType,
        options: [],
        correctAnswer: null,
        referenceAnswer: '',
      }));
    }
    setErrors({});
  };

  // 添加选项
  const handleAddOption = () => {
    const newOption =
      problemType === 1 ? { content: '', isAnswer: false } : { content: '' };
    setFormData((prev) => ({
      ...prev,
      options: [...prev.options, newOption],
    }));
  };

  // 删除选项
  const handleRemoveOption = (index: number) => {
    if (formData.options.length <= 2) {
      Toast.warning('至少保留 2 个选项');
      return;
    }

    // 如果删除的是正确答案（单选题），清除正确答案标记
    if (problemType === 0 && formData.correctAnswer === index) {
      setFormData((prev) => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
        correctAnswer: null,
      }));
      Toast.info('已清除正确答案标记，请重新选择');
    } else if (
      problemType === 0 &&
      formData.correctAnswer !== null &&
      formData.correctAnswer > index
    ) {
      // 调整正确答案索引
      setFormData((prev) => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
        correctAnswer: prev.correctAnswer! - 1,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index),
      }));
    }
  };

  // 更新选项内容
  const handleOptionContentChange = (index: number, content: string) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) =>
        i === index ? { ...opt, content } : opt,
      ),
    }));
  };

  // 更新选项正确答案状态（多选题）
  const handleOptionAnswerChange = (index: number, isAnswer: boolean) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((opt, i) =>
        i === index ? { ...opt, isAnswer } : opt,
      ),
    }));
  };

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 验证题目内容
    if (!formData.content.trim()) {
      newErrors.content = '请输入题目内容';
    } else if (formData.content.length < 5) {
      newErrors.content = '题目内容至少5个字符';
    } else if (formData.content.length > 1000) {
      newErrors.content = '题目内容不能超过1000字符';
    }

    // 根据题目类型验证
    if (problemType === 0 || problemType === 1) {
      // 单选题或多选题：验证选项
      formData.options.forEach((opt, index) => {
        if (!opt.content.trim()) {
          newErrors[`option_${index}`] = '请输入选项内容';
        } else if (opt.content.length > 200) {
          newErrors[`option_${index}`] = '选项内容不能超过200字符';
        }
      });

      if (problemType === 0) {
        // 单选题：必须选择一个正确答案
        if (formData.correctAnswer === null) {
          newErrors.correctAnswer = '请选择正确答案';
        }
      } else {
        // 多选题：至少选择一个正确答案
        const hasCorrectAnswer = formData.options.some((opt) => opt.isAnswer);
        if (!hasCorrectAnswer) {
          newErrors.correctAnswer = '请至少选择一个正确答案';
        }
      }
    } else if (problemType === 2) {
      // 判断题：必须选择正确答案
      if (formData.correctAnswer === null) {
        newErrors.correctAnswer = '请选择正确答案';
      }
    }
    // 论述题没有额外验证

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 表单数据转换
  const transformFormData = () => {
    let results: any[] = [];

    if (problemType === 0) {
      // 单选题
      results = formData.options.map((opt, index) => ({
        resultType: 0,
        content: opt.content,
        order: index,
        isAnswer: index === formData.correctAnswer,
      }));
    } else if (problemType === 1) {
      // 多选题
      results = formData.options.map((opt, index) => ({
        resultType: 0,
        content: opt.content,
        order: index,
        isAnswer: opt.isAnswer || false,
      }));
    } else if (problemType === 2) {
      // 判断题
      results = [
        {
          resultType: 0,
          content: '对',
          order: 0,
          isAnswer: formData.correctAnswer === 0,
        },
        {
          resultType: 0,
          content: '错',
          order: 1,
          isAnswer: formData.correctAnswer === 1,
        },
      ];
    } else if (problemType === 3) {
      // 论述题
      results = [
        {
          resultType: 1,
          content: formData.referenceAnswer || '',
          order: 0,
          isAnswer: true,
        },
      ];
    }

    return {
      problemSetId: setId!,
      problem: {
        content: formData.content,
        type: problemType as 0 | 1 | 2 | 3,
        setId: setId!,
        order: 0, // 后端会自动计算
      },
      results,
    };
  };

  // 表单提交处理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditMode) {
      Toast.warning('编辑功能待后端 API 支持');
      return;
    }

    // 验证表单
    if (!validateForm()) {
      Toast.error('请检查表单填写是否完整');
      return;
    }

    // 提交数据
    const payload = transformFormData();

    addProblem({
      ...payload,
      onSuccess: () => {
        Toast.success('题目添加成功');
        // 重新加载题目列表
        if (setId) {
          loadProblems(setId);
        }
        // 重置表单
        resetForm();
      },
    });
  };

  // 取消操作
  const handleCancel = () => {
    navigate('/app');
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-gray-50">
      {/* 主内容区 */}
      <div className="flex-1 flex items-center justify-center py-6 md:mr-80">
        <div className="w-full max-w-[95%] sm:w-[600px] lg:w-[900px] min-h-[700px] bg-white rounded-2xl shadow-xl px-6 py-8 sm:px-8 sm:py-10">
          {/* 头部 */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
              {isEditMode ? '编辑题目' : '添加题目'}
            </h1>
            <p className="text-sm text-center text-gray-500">
              {isEditMode
                ? `编辑题目 #${problems.findIndex((p) => p.id === selectedProblemId) + 1}`
                : '为题集添加新题目'}
            </p>
          </div>

          {/* 表单 */}
          {detailLoading ? (
            <div className="flex justify-center items-center py-20">
              <span className="text-gray-500">加载题目详情中...</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* 题目类型选择 */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  题目类型 *
                </label>
                <Select
                  value={problemType}
                  onChange={(value) => handleTypeChange(value as number)}
                  placeholder="请选择题目类型"
                  className="w-full"
                >
                  <Select.Option value={0}>⊙ 单选题</Select.Option>
                  <Select.Option value={1}>☑ 多选题</Select.Option>
                  <Select.Option value={2}>✓/✗ 判断题</Select.Option>
                  <Select.Option value={3}>📝 论述题</Select.Option>
                </Select>
              </div>

              {/* 题目内容输入 */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-2">
                  题目内容 *
                </label>
                <TextArea
                  value={formData.content}
                  onChange={(value) =>
                    setFormData((prev) => ({ ...prev, content: value }))
                  }
                  placeholder="请输入题目内容"
                  rows={4}
                  maxLength={1000}
                  showClear
                />
                {errors.content && (
                  <p className="text-red-500 text-xs mt-1">{errors.content}</p>
                )}
              </div>

              {/* 单选题选项 */}
              {problemType === 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">
                    选项列表 *
                  </label>
                  <RadioGroup
                    value={formData.correctAnswer ?? undefined}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        correctAnswer: e.target.value as number,
                      }))
                    }
                  >
                    <div className="space-y-3">
                      {formData.options.map((option, index) => (
                        <div
                          key={index}
                          className="flex gap-2 sm:gap-3 items-start"
                        >
                          <Input
                            value={option.content}
                            onChange={(value) =>
                              handleOptionContentChange(index, value)
                            }
                            placeholder={`选项 ${String.fromCharCode(65 + index)}`}
                            className="flex-1"
                          />
                          <Radio value={index}>
                            <span className="text-sm">正确</span>
                          </Radio>
                          {formData.options.length > 2 && (
                            <Button
                              icon={<IconDelete />}
                              type="danger"
                              theme="borderless"
                              onClick={() => handleRemoveOption(index)}
                            />
                          )}
                        </div>
                      ))}
                      {errors.correctAnswer && (
                        <p className="text-red-500 text-xs">
                          {errors.correctAnswer}
                        </p>
                      )}
                    </div>
                  </RadioGroup>
                  <Button
                    icon={<IconPlus />}
                    onClick={handleAddOption}
                    block
                    theme="light"
                    className="mt-3"
                  >
                    添加选项
                  </Button>
                </div>
              )}

              {/* 多选题选项 */}
              {problemType === 1 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">
                    选项列表 *
                  </label>
                  <div className="space-y-3">
                    {formData.options.map((option, index) => (
                      <div
                        key={index}
                        className="flex gap-2 sm:gap-3 items-start"
                      >
                        <Input
                          value={option.content}
                          onChange={(value) =>
                            handleOptionContentChange(index, value)
                          }
                          placeholder={`选项 ${String.fromCharCode(65 + index)}`}
                          className="flex-1"
                        />
                        <Checkbox
                          checked={!!option.isAnswer}
                          onChange={(e) => {
                            const isChecked = e?.target?.checked ?? false;
                            handleOptionAnswerChange(index, isChecked);
                          }}
                        >
                          <span className="text-sm">正确</span>
                        </Checkbox>
                        {formData.options.length > 2 && (
                          <Button
                            icon={<IconDelete />}
                            type="danger"
                            theme="borderless"
                            onClick={() => handleRemoveOption(index)}
                          />
                        )}
                      </div>
                    ))}
                    {errors.correctAnswer && (
                      <p className="text-red-500 text-xs">
                        {errors.correctAnswer}
                      </p>
                    )}
                  </div>
                  <Button
                    icon={<IconPlus />}
                    onClick={handleAddOption}
                    block
                    theme="light"
                    className="mt-3"
                  >
                    添加选项
                  </Button>
                </div>
              )}

              {/* 判断题 */}
              {problemType === 2 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">
                    请选择正确答案 *
                  </label>
                  <RadioGroup
                    type="button"
                    value={formData.correctAnswer ?? undefined}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        correctAnswer: e.target.value as number,
                      }))
                    }
                  >
                    <Radio value={0}>对</Radio>
                    <Radio value={1}>错</Radio>
                  </RadioGroup>
                  {errors.correctAnswer && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.correctAnswer}
                    </p>
                  )}
                </div>
              )}

              {/* 论述题 */}
              {problemType === 3 && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold mb-2">
                    参考答案（可选）
                  </label>
                  <TextArea
                    value={formData.referenceAnswer}
                    onChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        referenceAnswer: value,
                      }))
                    }
                    placeholder="请输入参考答案，用于学习参考"
                    rows={6}
                    maxLength={2000}
                    showClear
                  />
                </div>
              )}

              {/* 按钮组 */}
              <div className="flex gap-3 sm:gap-4 justify-end mt-6">
                <Button
                  onClick={handleCancel}
                  disabled={addLoading || detailLoading}
                >
                  返回列表
                </Button>
                {isEditMode ? (
                  <Button
                    type="primary"
                    disabled
                    title="编辑功能待后端 API 支持"
                  >
                    更新题目（待后端支持）
                  </Button>
                ) : (
                  <Button type="primary" htmlType="submit" loading={addLoading}>
                    保存并继续
                  </Button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>

      {/* 右侧题目选择器面板（桌面端） */}
      <div className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white border-l shadow-lg hidden md:block">
        <ProblemGridSelector
          problems={problems}
          selectedProblemId={selectedProblemId}
          onSelect={handleProblemSelect}
          mode="edit"
          loading={initLoading}
        />
      </div>

      {/* 移动端：悬浮按钮 */}
      <button
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg md:hidden flex items-center justify-center z-50 hover:bg-blue-700 transition-colors"
        onClick={() => setMobilePanelOpen(true)}
        title="选择题目"
      >
        <IconList size="large" />
      </button>

      {/* 移动端：抽屉面板 */}
      <SideSheet
        visible={mobilePanelOpen}
        onCancel={() => setMobilePanelOpen(false)}
        placement="right"
        width={320}
        className="md:hidden"
        title="题目选择"
      >
        <ProblemGridSelector
          problems={problems}
          selectedProblemId={selectedProblemId}
          onSelect={(id) => {
            handleProblemSelect(id);
            setMobilePanelOpen(false);
          }}
          mode="edit"
          loading={initLoading}
        />
      </SideSheet>
    </div>
  );
};

export default EditProblem;
