using Microsoft.EntityFrameworkCore;
using practice_system.Data;
using practice_system.Dtos;
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

        public async Task<List<ProblemSetDto>> GetProblemSet(Guid userId, CancellationToken ct)
        {
            var problemSets = await _db.ProblemSets
                .OrderByDescending(ps => ps.UpdateAt)
                .ToListAsync(ct);

            // 获取每个题目集的题目数量
            var problemCounts = await _db.Problems
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
    }
}
