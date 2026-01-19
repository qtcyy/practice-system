import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from '@douyinfe/semi-ui-19';
import { useProblemSet } from '../../hooks/problem-set/useProblemSet';

const CreateSet = () => {
  const navigate = useNavigate();
  const { createLoading, createProblemSet } = useProblemSet();
  const formApi = useRef<any>(null);

  const handleSubmit = (values: { title: string }) => {
    createProblemSet({
      title: values.title,
      onSuccess: (problemSet) => {
        // 跳转到添加题目页面
        navigate(`/app/edit-problem/${problemSet?.id}`);
      },
    });
  };

  const handleCancel = () => {
    navigate('/app');
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="w-full max-w-[95%] sm:w-[500px] lg:w-[600px] bg-white rounded-2xl shadow-xl px-6 py-8 sm:px-8 sm:py-10">
        {/* 头部 */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
            创建题集
          </h1>
          <p className="text-sm text-center text-gray-500">
            创建一个新的题目集合开始练习
          </p>
        </div>

        {/* 表单 */}
        <Form
          getFormApi={(api) => (formApi.current = api)}
          onSubmit={handleSubmit}
          labelPosition="top"
        >
          <Form.Input
            field="title"
            label="题集标题"
            placeholder="请输入题集标题"
            rules={[
              { required: true, message: '请输入题集标题' },
              {
                validator: (_rule, value) =>
                  !value || (value.length >= 2 && value.length <= 100),
                message: '题集标题长度应在 2-100 字符之间',
              },
            ]}
            style={{ marginBottom: '24px' }}
          />

          {/* 按钮组 */}
          <div className="flex gap-4 justify-end">
            <Button
              theme="borderless"
              onClick={handleCancel}
              disabled={createLoading}
            >
              取消
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={createLoading}
              disabled={createLoading}
            >
              创建题集
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default CreateSet;
