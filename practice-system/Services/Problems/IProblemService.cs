using practice_system.Dtos;
using practice_system.Models.Problems;

namespace practice_system.Services.Problems
{
    public interface IProblemService
    {
        Task<List<ProblemSetDto>> GetProblemSet(Guid userId, CancellationToken ct);

        Task<List<ProblemDto>> GetProblems(Guid userId, Guid problemSetId, CancellationToken ct);
    }
}
