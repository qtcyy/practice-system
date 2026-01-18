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

    public record GetProblemSetResp(string Message, List<ProblemSetDto> ProblemSets);

    public record GetProblemsResp(string Message, List<ProblemDto> Problems);
}
