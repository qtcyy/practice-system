using Microsoft.EntityFrameworkCore;
using practice_system.Data;
using practice_system.Exceptions;
using practice_system.Models.Problems;

namespace practice_system.Services.Problems
{
    public class ProblemEditService : IProblemEditService
    {
        private readonly AppDbContext _db;

        public ProblemEditService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<(Problem, List<ProblemResult>)> AddProblem(Guid userId, Guid problemSetId, Problem problem, List<ProblemResult> results, CancellationToken ct)
        {
            var problemSet = await _db.ProblemSets.FirstOrDefaultAsync(ps => ps.Id == problemSetId, ct);
            if (problemSet == null)
            {
                throw new BusinessException("Problem set not found");
            }
            if (problemSet.UserId != userId)
            {
                throw new BusinessException("Unauthorized to add problem to this set");
            }
            var maxOrderProblem = await _db.Problems
                .Where(p => p.SetId == problemSetId)
                .OrderByDescending(p => p.Order)
                .FirstOrDefaultAsync(ct);


            problem.Id = Guid.NewGuid();
            problem.SetId = problemSetId;
            problem.Order = maxOrderProblem != null ? maxOrderProblem.Order + 1 : 0;
            await _db.Problems.AddAsync(problem, ct);

            var orderedResults = results.Select((r, idx) =>
            {
                r.ProblemId = problem.Id;
                r.Order = idx;
                return r;
            }).ToList();
            await _db.ProblemResults.AddRangeAsync(orderedResults, ct);

            await _db.SaveChangesAsync(ct);

            return (problem, orderedResults);
        }

        public async Task<ProblemSet> NewProblemSet(string title, Guid userId, CancellationToken ct)
        {
            var newSet = new ProblemSet
            {
                Title = title,
                UserId = userId
            };

            await _db.ProblemSets.AddAsync(newSet, ct);
            await _db.SaveChangesAsync(ct);

            return newSet;
        }

        public async Task<UserAnswer> SubmitAnswer(
            Guid userId,
            Guid problemId,
            Guid? problemSetId,
            List<Guid>? selectedResultIds,
            string? textAnswer,
            ProblemStatus status,
            CancellationToken ct)
        {
            // 验证题目存在
            var problem = await _db.Problems.FirstOrDefaultAsync(p => p.Id == problemId, ct);
            if (problem == null)
            {
                throw new BusinessException("Problem not found");
            }

            // 查找现有答案
            var existingAnswer = await _db.UserAnswers
                .FirstOrDefaultAsync(ua => ua.UserId == userId && ua.ProblemId == problemId, ct);

            UserAnswer userAnswer;

            if (existingAnswer == null)
            {
                // 创建新答案
                userAnswer = new UserAnswer
                {
                    Id = Guid.NewGuid(),
                    UserId = userId,
                    ProblemId = problemId,
                    ProblemSetId = problemSetId,
                    Status = status,
                    TextAnswer = textAnswer,
                    AnsweredAt = DateTimeOffset.UtcNow
                };
                await _db.UserAnswers.AddAsync(userAnswer, ct);
                await _db.SaveChangesAsync(ct);

                // 保存选择项
                if (selectedResultIds != null && selectedResultIds.Count > 0)
                {
                    var selections = selectedResultIds.Select(resultId => new UserAnswerSelection
                    {
                        Id = Guid.NewGuid(),
                        UserAnswerId = userAnswer.Id,
                        ProblemResultId = resultId
                    }).ToList();
                    await _db.UserAnswerSelections.AddRangeAsync(selections, ct);
                    await _db.SaveChangesAsync(ct);
                }
            }
            else
            {
                // 更新现有答案
                userAnswer = existingAnswer;
                userAnswer.Status = status;
                userAnswer.TextAnswer = textAnswer;
                userAnswer.ProblemSetId = problemSetId;
                userAnswer.AnsweredAt = DateTimeOffset.UtcNow;

                // 删除旧选择项
                var oldSelections = await _db.UserAnswerSelections
                    .Where(uas => uas.UserAnswerId == userAnswer.Id)
                    .ToListAsync(ct);
                _db.UserAnswerSelections.RemoveRange(oldSelections);

                // 添加新选择项
                if (selectedResultIds != null && selectedResultIds.Count > 0)
                {
                    var newSelections = selectedResultIds.Select(resultId => new UserAnswerSelection
                    {
                        Id = Guid.NewGuid(),
                        UserAnswerId = userAnswer.Id,
                        ProblemResultId = resultId
                    }).ToList();
                    await _db.UserAnswerSelections.AddRangeAsync(newSelections, ct);
                }

                await _db.SaveChangesAsync(ct);
            }

            return userAnswer;
        }
    }
}
