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

            problem.Id = Guid.NewGuid();
            problem.SetId = problemSetId;
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
    }
}
