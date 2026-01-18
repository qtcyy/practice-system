using Microsoft.EntityFrameworkCore;
using practice_system.Data;
using practice_system.Dtos;
using practice_system.Exceptions;
using practice_system.Models.Problems;

namespace practice_system.Services.Problems
{
    public class ProblemService : IProblemService
    {
        private readonly AppDbContext _db;

        public ProblemService(AppDbContext db)
        {
            _db = db;
        }

        // 获取题目集列表及每个题目集的题目数量和已作答题目数量
        public async Task<List<ProblemSetDto>> GetProblemSet(Guid userId, CancellationToken ct)
        {
            var problemSets = await _db.ProblemSets
                .Where(ps => ps.UserId == userId)
                .OrderByDescending(ps => ps.UpdateAt)
                .ToListAsync(ct);

            var setIds = problemSets.Select(ps => ps.Id).ToHashSet();

            // 获取每个题目集的题目数量
            var problemCounts = await _db.Problems
                .Where(p => setIds.Contains(p.SetId))
                .GroupBy(p => p.SetId)
                .Select(g => new { SetId = g.Key, Count = g.LongCount() })
                .ToDictionaryAsync(x => x.SetId, x => x.Count, ct);

            // 获取用户已作答的题目数量（按题目集分组）
            var attemptedCounts = await _db.UserAnswers
                .Where(ua => ua.UserId == userId && ua.ProblemSetId != null)
                .GroupBy(ua => ua.ProblemSetId!.Value)
                .Select(g => new { SetId = g.Key, Count = g.LongCount() })
                .ToDictionaryAsync(x => x.SetId, x => x.Count, ct);

            var result = problemSets.Select(ps => new ProblemSetDto
            {
                Id = ps.Id,
                Title = ps.Title,
                Description = ps.Description,
                UserId = ps.UserId,
                CreateAt = ps.CreateAt,
                UpdateAt = ps.UpdateAt,
                CreateBy = ps.CreateBy,
                UpdateBy = ps.UpdateBy,
                Version = ps.Version,
                IsDeleted = ps.IsDeleted,
                TotalProblems = problemCounts.GetValueOrDefault(ps.Id, 0),
                AttemptedProblems = attemptedCounts.GetValueOrDefault(ps.Id, 0)
            }).ToList();

            return result;
        }

        // 获取指定题目集下的题目列表及每个题目的作答状态
        public async Task<List<ProblemDto>> GetProblems(Guid userId, Guid problemSetId, CancellationToken ct)
        {
            var problemSet = await _db.ProblemSets
                .FirstOrDefaultAsync(ps => ps.Id == problemSetId, ct)
                ?? throw new BusinessException("Problem set not found", 404);
            if (problemSet.UserId != userId) throw new BusinessException("Unauthorized access to problem set", 400);

            var problems = await _db.Problems
                .Where(p => p.SetId == problemSetId)
                .OrderBy(p => p.Order)
                .ToListAsync(ct);

            var problemIdSet = problems.Select(p => p.Id).ToHashSet();
            var ansStatusDict = await _db.UserAnswers
                .Where(ua => problemIdSet.Contains(ua.ProblemId) && ua.UserId == userId)
                .ToDictionaryAsync(ua => ua.ProblemId, ua => ua.Status, ct);

            var result = problems.Select(p => new ProblemDto
            {
                Id = p.Id,
                Content = p.Content,
                Type = p.Type,
                SetId = p.SetId,
                Order = p.Order,
                CreateAt = p.CreateAt,
                UpdateAt = p.UpdateAt,
                CreateBy = p.CreateBy,
                UpdateBy = p.UpdateBy,
                Version = p.Version,
                IsDeleted = p.IsDeleted,
                Status = ansStatusDict.GetValueOrDefault(p.Id, ProblemStatus.Unattempted)
            }).ToList();

            return result;
        }

        // 获取题目详情，包括题目内容、选项、用户作答等信息
        public async Task<ProblemDelailDto> GetProblemDetail(Guid userId, Guid problemId, CancellationToken ct)
        {
            var obj = await _db.Problems
                .Where(p => p.Id == problemId)
                .Join(
                    _db.ProblemSets,
                    p => p.SetId,
                    ps => ps.Id,
                    (p, ps) => new { ps.UserId, p }
                ).FirstOrDefaultAsync(ct)
                ?? throw new BusinessException("Problem not found", 404);
            if (obj.UserId != userId)
                throw new BusinessException("Unauthorized access to problem", 400);

            var problemResults = await _db.ProblemResults
                .Where(pr => pr.ProblemId == problemId)
                .OrderBy(pr => pr.Order)
                .ToListAsync(ct);

            var userAnswer = await _db.UserAnswers
                .Where(ua => ua.ProblemId == problemId && ua.UserId == userId)
                .FirstOrDefaultAsync(ct);

            var dto = new ProblemDelailDto
            {
                Id = obj.p.Id,
                Content = obj.p.Content,
                Type = obj.p.Type,
                SetId = obj.p.SetId,
                Order = obj.p.Order,
                CreateAt = obj.p.CreateAt,
                UpdateAt = obj.p.UpdateAt,
                CreateBy = obj.p.CreateBy,
                UpdateBy = obj.p.UpdateBy,
                Version = obj.p.Version,
                IsDeleted = obj.p.IsDeleted,
                Results = problemResults,
                UserAnswer = userAnswer
            };

            if (obj.p.Type == ProblemType.Essay)
                return dto;

            if (userAnswer != null)
            {
                var selectedResultIds = await _db.UserAnswerSelections
                    .Where(uas => uas.UserAnswerId == userAnswer.Id)
                    .Select(uas => uas.ProblemResultId)
                    .ToListAsync(ct);
                dto.SelectedResultId = selectedResultIds;
            }
            return dto;
        }
    }
}