import { useAuth } from 'src/context/AuthContext';
import { Button, Form } from '@douyinfe/semi-ui-19';
import { useNavigate, Link } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

const Login = () => {
  // Hooks
  const { login } = useAuth();
  const navigate = useNavigate();
  const formApi = useRef<any>(null);
  const [loading, setLoading] = useState(false);

  // 初始化: 恢复记住的用户名
  useEffect(() => {
    const rememberedUsername = localStorage.getItem('remembered_username');
    if (rememberedUsername && formApi.current) {
      formApi.current.setValue('username', rememberedUsername);
      formApi.current.setValue('remember', true);
    }
  }, []);

  // 表单提交处理
  const handleSubmit = (values: {
    username: string;
    password: string;
    remember?: boolean;
  }) => {
    setLoading(true);

    // 处理"记住我"
    if (values.remember) {
      localStorage.setItem('remembered_username', values.username);
    } else {
      localStorage.removeItem('remembered_username');
    }

    // 调用登录 API
    login(values.username, values.password, () => {
      setLoading(false);
      navigate('/app');
    });

    // 兜底：3秒后重置 loading（处理错误情况）
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-[95%] sm:w-[400px] lg:w-[420px] lg:max-w-md bg-white rounded-2xl shadow-xl px-6 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
        {/* 头部 */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
            欢迎回来
          </h1>
          <p className="text-sm text-center text-gray-500">
            登录到你的账户继续练习
          </p>
        </div>

        {/* 表单 */}
        <Form
          getFormApi={(api) => (formApi.current = api)}
          onSubmit={handleSubmit}
          labelPosition="top"
        >
          {/* 用户名输入框 */}
          <Form.Input
            field="username"
            label="用户名"
            placeholder="请输入用户名"
            autoFocus
            showClear
            rules={[
              { required: true, message: '请输入用户名' },
              {
                validator: (_rule, value) => !value || value.length >= 3,
                message: '用户名至少需要3个字符',
              },
            ]}
            style={{ marginBottom: '20px' }}
          />

          {/* 密码输入框 */}
          <Form.Input
            field="password"
            label="密码"
            type="password"
            mode="password"
            placeholder="请输入密码"
            rules={[
              { required: true, message: '请输入密码' },
              {
                validator: (_rule, value) => !value || value.length >= 6,
                message: '密码至少需要6个字符',
              },
            ]}
            style={{ marginBottom: '20px' }}
          />

          {/* 记住我复选框 */}
          <Form.Checkbox
            field="remember"
            noLabel
            style={{ marginBottom: '24px' }}
          >
            记住我
          </Form.Checkbox>

          {/* 提交按钮 */}
          <Button
            htmlType="submit"
            type="primary"
            theme="solid"
            block
            size="large"
            loading={loading}
            disabled={loading}
            className="h-12 sm:h-11 lg:h-10 text-base font-medium"
          >
            {loading ? '登录中...' : '登录'}
          </Button>
        </Form>

        {/* 底部链接 */}
        <div className="mt-6 text-center text-sm text-gray-600">
          还没有账户?{' '}
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            立即注册
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
