# Practice System API 文档

本文档提供前端开发所需的完整 API 接口说明。

## 基础信息

### 服务地址

| 环境 | 地址 |
|------|------|
| HTTPS | `https://localhost:7290` |
| HTTP | `http://localhost:5000` |
| Swagger UI | `https://localhost:7290/swagger` |

### 认证方式

使用 JWT Bearer Token 认证。

**请求头格式：**
```
Authorization: Bearer <JWT_TOKEN>
```

### 响应格式

- 所有响应使用 **camelCase** 命名
- 成功响应的 `message` 字段通常为 `"success"`

**错误响应格式：**
```json
{
  "code": 400,
  "message": "错误描述",
  "details": null
}
```

---

## 枚举类型

### ProblemType - 题目类型

| 值 | 名称 | 说明 |
|----|------|------|
| 0 | SingleChoice | 单选题 |
| 1 | MultipleChoice | 多选题 |
| 2 | TrueFalse | 判断题 |
| 3 | Essay | 简答题 |

### ProblemStatus - 答题状态

| 值 | 名称 | 说明 |
|----|------|------|
| 0 | Unattempted | 未作答 |
| 1 | Correct | 正确 |
| 2 | Incorrect | 错误 |
| 3 | PartiallyCorrect | 部分正确 |
| 4 | NoAnswer | 无答案 |

### ProblemResultType - 选项类型

| 值 | 名称 | 说明 |
|----|------|------|
| 0 | Choice | 选项 |
| 1 | Text | 文本 |

---

## 用户接口

### 用户注册

注册新用户账号。

**请求**

```
POST /api/user/register
```

**请求体**

```json
{
  "username": "string",
  "password": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名，不能为空 |
| password | string | 是 | 密码，最少 6 位 |

**响应**

```json
{
  "message": "success",
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "username": "testuser"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| message | string | 响应消息 |
| userId | Guid | 用户 ID |
| username | string | 用户名 |

**状态码**

| 状态码 | 说明 |
|--------|------|
| 200 | 注册成功 |
| 400 | 参数错误（用户名为空或密码少于6位） |

---

### 用户登录

用户登录获取 JWT Token。

**请求**

```
POST /api/user/login
```

**请求体**

```json
{
  "username": "string",
  "password": "string"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**响应**

```json
{
  "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| userId | string | 用户 ID |
| token | string | JWT Token，用于后续接口认证 |

**状态码**

| 状态码 | 说明 |
|--------|------|
| 200 | 登录成功 |
| 400 | 用户名或密码为空 |

---

### 健康检查 (管理员)

测试接口，需要 ADMIN 角色。

**请求**

```
GET /api/user/ping
```

**请求头**

```
Authorization: Bearer <JWT_TOKEN>
```

**响应**

```
Pong
```

**状态码**

| 状态码 | 说明 |
|--------|------|
| 200 | 认证成功 |
| 401 | 未授权或角色不足 |

---

## 题目集接口

> 以下接口均需要 JWT 认证

### 获取题目集列表

获取当前用户的所有题目集。

**请求**

```
GET /api/problem/get-set
```

**请求头**

```
Authorization: Bearer <JWT_TOKEN>
```

**响应**

```json
{
  "message": "success",
  "problemSets": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "title": "数学练习题",
      "description": "初中数学基础题目",
      "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "totalProblems": 50,
      "attemptedProblems": 25,
      "createAt": "2024-01-15T10:30:00+08:00",
      "updateAt": "2024-01-15T10:30:00+08:00",
      "createBy": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "updateBy": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "version": 1,
      "isDeleted": false
    }
  ]
}
```

**problemSets 字段说明**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Guid | 题目集 ID |
| title | string | 标题 |
| description | string? | 描述 |
| userId | Guid? | 所属用户 ID |
| totalProblems | long | 题目总数 |
| attemptedProblems | long | 已作答题目数 |
| createAt | DateTimeOffset | 创建时间 |
| updateAt | DateTimeOffset | 更新时间 |
| createBy | Guid? | 创建人 |
| updateBy | Guid? | 更新人 |
| version | long | 版本号 |
| isDeleted | boolean | 是否删除 |

---

### 创建题目集

创建新的题目集。

**请求**

```
POST /api/problem/new-problem-set
```

**请求头**

```
Authorization: Bearer <JWT_TOKEN>
```

**请求体**

```json
{
  "title": "新题目集"
}
```

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| title | string | 是 | 题目集标题 |

**响应**

```json
{
  "message": "success",
  "problemSet": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "title": "新题目集",
    "description": null,
    "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "createAt": "2024-01-15T10:30:00+08:00",
    "updateAt": "2024-01-15T10:30:00+08:00",
    "createBy": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "updateBy": null,
    "version": 1,
    "isDeleted": false
  }
}
```

---

## 题目接口

> 以下接口均需要 JWT 认证

### 获取题目列表

获取指定题目集下的所有题目。

**请求**

```
GET /api/problem/get-problems/{problemSetId}
```

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| problemSetId | Guid | 是 | 题目集 ID |

**请求头**

```
Authorization: Bearer <JWT_TOKEN>
```

**响应**

```json
{
  "message": "success",
  "problems": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "content": "1 + 1 = ?",
      "type": 0,
      "setId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "order": 1,
      "status": 0,
      "createAt": "2024-01-15T10:30:00+08:00",
      "updateAt": "2024-01-15T10:30:00+08:00",
      "createBy": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "updateBy": null,
      "version": 1,
      "isDeleted": false
    }
  ]
}
```

**problems 字段说明**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Guid | 题目 ID |
| content | string | 题目内容 |
| type | ProblemType | 题目类型 (0-3) |
| setId | Guid | 所属题目集 ID |
| order | long | 题目顺序 |
| status | ProblemStatus? | 答题状态 (0-4)，null 表示未作答 |
| createAt | DateTimeOffset | 创建时间 |
| updateAt | DateTimeOffset | 更新时间 |
| createBy | Guid? | 创建人 |
| updateBy | Guid? | 更新人 |
| version | long | 版本号 |
| isDeleted | boolean | 是否删除 |

---

### 获取题目详情

获取单个题目的完整信息，包括选项和用户答案。

**请求**

```
GET /api/problem/get-detail/{problemId}
```

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| problemId | Guid | 是 | 题目 ID |

**请求头**

```
Authorization: Bearer <JWT_TOKEN>
```

**响应**

```json
{
  "message": "success",
  "problemDetail": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "content": "1 + 1 = ?",
    "type": 0,
    "setId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "order": 1,
    "results": [
      {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "problemId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "resultType": 0,
        "content": "2",
        "order": 1,
        "isAnswer": true,
        "createAt": "2024-01-15T10:30:00+08:00",
        "updateAt": "2024-01-15T10:30:00+08:00",
        "createBy": null,
        "updateBy": null,
        "version": 1,
        "isDeleted": false
      },
      {
        "id": "4fa85f64-5717-4562-b3fc-2c963f66afa7",
        "problemId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "resultType": 0,
        "content": "3",
        "order": 2,
        "isAnswer": false,
        "createAt": "2024-01-15T10:30:00+08:00",
        "updateAt": "2024-01-15T10:30:00+08:00",
        "createBy": null,
        "updateBy": null,
        "version": 1,
        "isDeleted": false
      }
    ],
    "userAnswer": {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "problemId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "problemSetId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "status": 1,
      "textAnswer": null,
      "answeredAt": "2024-01-15T11:00:00+08:00",
      "createAt": "2024-01-15T11:00:00+08:00",
      "updateAt": "2024-01-15T11:00:00+08:00",
      "createBy": null,
      "updateBy": null,
      "version": 1,
      "isDeleted": false
    },
    "selectedResultId": [
      "3fa85f64-5717-4562-b3fc-2c963f66afa6"
    ],
    "createAt": "2024-01-15T10:30:00+08:00",
    "updateAt": "2024-01-15T10:30:00+08:00",
    "createBy": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "updateBy": null,
    "version": 1,
    "isDeleted": false
  }
}
```

**results 字段说明 (选项列表)**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Guid | 选项 ID |
| problemId | Guid | 所属题目 ID |
| resultType | ProblemResultType | 选项类型 (0=选项, 1=文本) |
| content | string | 选项内容 |
| order | long | 选项顺序 |
| isAnswer | boolean | 是否为正确答案 |

**userAnswer 字段说明 (用户答案)**

| 字段 | 类型 | 说明 |
|------|------|------|
| id | Guid | 答案记录 ID |
| userId | Guid | 用户 ID |
| problemId | Guid | 题目 ID |
| problemSetId | Guid? | 题目集 ID |
| status | ProblemStatus | 答题状态 |
| textAnswer | string? | 文本答案（简答题） |
| answeredAt | DateTimeOffset | 作答时间 |

**selectedResultId 字段说明**

用户选择的选项 ID 列表（仅选择题有效）。

---

### 获取错题列表

获取指定题目集下的所有错题。

**请求**

```
GET /api/problem/get-incorrect/{problemSetId}
```

**路径参数**

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| problemSetId | Guid | 是 | 题目集 ID |

**请求头**

```
Authorization: Bearer <JWT_TOKEN>
```

**响应**

```json
{
  "message": "success",
  "problems": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "content": "2 + 2 = ?",
      "type": 0,
      "setId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "order": 2,
      "status": 2,
      "createAt": "2024-01-15T10:30:00+08:00",
      "updateAt": "2024-01-15T10:30:00+08:00",
      "createBy": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "updateBy": null,
      "version": 1,
      "isDeleted": false
    }
  ]
}
```

响应格式与「获取题目列表」相同，但只返回 `status` 为 `Incorrect` (2) 或 `PartiallyCorrect` (3) 的题目。

---

### 添加题目

向题目集添加新题目。

**请求**

```
POST /api/problem/add-problem
```

**请求头**

```
Authorization: Bearer <JWT_TOKEN>
```

**请求体**

```json
{
  "problemSetId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "problem": {
    "content": "1 + 1 = ?",
    "type": 0,
    "setId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "order": 1
  },
  "results": [
    {
      "resultType": 0,
      "content": "2",
      "order": 1,
      "isAnswer": true
    },
    {
      "resultType": 0,
      "content": "3",
      "order": 2,
      "isAnswer": false
    },
    {
      "resultType": 0,
      "content": "4",
      "order": 3,
      "isAnswer": false
    },
    {
      "resultType": 0,
      "content": "5",
      "order": 4,
      "isAnswer": false
    }
  ]
}
```

**请求体字段说明**

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| problemSetId | Guid | 是 | 题目集 ID |
| problem | object | 是 | 题目信息 |
| problem.content | string | 是 | 题目内容 |
| problem.type | ProblemType | 是 | 题目类型 |
| problem.setId | Guid | 是 | 题目集 ID |
| problem.order | long | 是 | 题目顺序 |
| results | array | 是 | 选项列表 |
| results[].resultType | ProblemResultType | 是 | 选项类型 |
| results[].content | string | 是 | 选项内容 |
| results[].order | long | 是 | 选项顺序 |
| results[].isAnswer | boolean | 是 | 是否为正确答案 |

**响应**

```json
{
  "message": "success",
  "problem": {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "content": "1 + 1 = ?",
    "type": 0,
    "setId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "order": 1,
    "createAt": "2024-01-15T10:30:00+08:00",
    "updateAt": "2024-01-15T10:30:00+08:00",
    "createBy": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "updateBy": null,
    "version": 1,
    "isDeleted": false
  },
  "results": [
    {
      "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "problemId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "resultType": 0,
      "content": "2",
      "order": 1,
      "isAnswer": true,
      "createAt": "2024-01-15T10:30:00+08:00",
      "updateAt": "2024-01-15T10:30:00+08:00",
      "createBy": null,
      "updateBy": null,
      "version": 1,
      "isDeleted": false
    }
  ]
}
```

---

## 通用状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 400 | 请求参数错误 |
| 401 | 未授权（Token 无效或过期） |
| 403 | 禁止访问（权限不足） |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 使用示例

### 完整流程示例

**1. 注册用户**

```bash
curl -X POST https://localhost:7290/api/user/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "123456"}'
```

**2. 登录获取 Token**

```bash
curl -X POST https://localhost:7290/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "123456"}'
```

**3. 获取题目集列表**

```bash
curl -X GET https://localhost:7290/api/problem/get-set \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**4. 获取题目列表**

```bash
curl -X GET https://localhost:7290/api/problem/get-problems/3fa85f64-5717-4562-b3fc-2c963f66afa6 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

**5. 获取题目详情**

```bash
curl -X GET https://localhost:7290/api/problem/get-detail/3fa85f64-5717-4562-b3fc-2c963f66afa6 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..."
```

---

## TypeScript 类型定义

前端可参考以下类型定义：

```typescript
// 枚举类型
enum ProblemType {
  SingleChoice = 0,
  MultipleChoice = 1,
  TrueFalse = 2,
  Essay = 3,
}

enum ProblemStatus {
  Unattempted = 0,
  Correct = 1,
  Incorrect = 2,
  PartiallyCorrect = 3,
  NoAnswer = 4,
}

enum ProblemResultType {
  Choice = 0,
  Text = 1,
}

// 基础模型
interface BaseModel {
  id: string;
  createAt: string;
  updateAt: string;
  createBy: string | null;
  updateBy: string | null;
  version: number;
  isDeleted: boolean;
}

// 用户相关
interface RegisterReq {
  username: string;
  password: string;
}

interface RegisterResp {
  message: string;
  userId: string;
  username: string;
}

interface LoginReq {
  username: string;
  password: string;
}

interface LoginResp {
  userId: string;
  token: string;
}

// 题目集相关
interface ProblemSetDto extends BaseModel {
  title: string;
  description: string | null;
  userId: string | null;
  totalProblems: number;
  attemptedProblems: number;
}

interface GetProblemSetResp {
  message: string;
  problemSets: ProblemSetDto[];
}

interface NewProblemSetReq {
  title: string;
}

interface NewProblemSetResp {
  message: string;
  problemSet: ProblemSetDto;
}

// 题目相关
interface ProblemDto extends BaseModel {
  content: string;
  type: ProblemType;
  setId: string;
  order: number;
  status: ProblemStatus | null;
}

interface GetProblemsResp {
  message: string;
  problems: ProblemDto[];
}

interface GetIncorrectProblemsResp {
  message: string;
  problems: ProblemDto[];
}

// 选项
interface ProblemResult extends BaseModel {
  problemId: string;
  resultType: ProblemResultType;
  content: string;
  order: number;
  isAnswer: boolean;
}

// 用户答案
interface UserAnswer extends BaseModel {
  userId: string;
  problemId: string;
  problemSetId: string | null;
  status: ProblemStatus;
  textAnswer: string | null;
  answeredAt: string;
}

// 题目详情
interface ProblemDetailDto extends BaseModel {
  content: string;
  type: ProblemType;
  setId: string;
  order: number;
  results: ProblemResult[];
  userAnswer: UserAnswer | null;
  selectedResultId: string[] | null;
}

interface GetProblemDetailResp {
  message: string;
  problemDetail: ProblemDetailDto;
}

// 添加题目
interface AddProblemReq {
  problemSetId: string;
  problem: {
    content: string;
    type: ProblemType;
    setId: string;
    order: number;
  };
  results: {
    resultType: ProblemResultType;
    content: string;
    order: number;
    isAnswer: boolean;
  }[];
}

interface AddProblemResp {
  message: string;
  problem: ProblemDto;
  results: ProblemResult[];
}

// 错误响应
interface ErrorResponse {
  code: number;
  message: string;
  details: unknown | null;
}
```
