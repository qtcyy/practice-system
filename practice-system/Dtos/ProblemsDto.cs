using practice_system.Models.Problems;

namespace practice_system.Dtos
{
    public class ProblemSetDto : ProblemSet
    {
        public long TotalProblems { get; set; }
        public long AttemptedProblems { get; set; }
    }
    public class ProblemDto : Problem
    {
        public ProblemStatus? Status { get; set; }
    }
    public class ProblemDelailDto : Problem
    {
        public List<ProblemResult> Results { get; set; }
        public UserAnswer? UserAnswer { get; set; }
        public List<Guid>? SelectedResultId { get; set; }
    }

    public record GetProblemSetResp(string Message, List<ProblemSetDto> ProblemSets);

    public record GetProblemsResp(string Message, List<ProblemDto> Problems);

    public record GetProblemDetailResp(string Message, ProblemDelailDto ProblemDetail);
}
