using practice_system.Models.Problems;

namespace practice_system.Services.Problems
{
    public interface IProblemEditService
    {
        Task<ProblemSet> NewProblemSet(string title, Guid userId, CancellationToken ct);

        Task<(Problem, List<ProblemResult>)> AddProblem(
            Guid userId,
            Guid problemSetId,
            Problem problem,
            List<ProblemResult> results,
            CancellationToken ct
        );
    }
}
