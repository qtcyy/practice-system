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

        public ProblemDto() { }

        public ProblemDto(Problem p, ProblemStatus? status = null)
        {
            Id = p.Id;
            Content = p.Content;
            Type = p.Type;
            SetId = p.SetId;
            Order = p.Order;
            CreateAt = p.CreateAt;
            UpdateAt = p.UpdateAt;
            CreateBy = p.CreateBy;
            UpdateBy = p.UpdateBy;
            Version = p.Version;
            IsDeleted = p.IsDeleted;
            Status = status;
        }
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

    public record GetIncorrectProblemsResp(string Message, List<ProblemDto> Problems);

    public record NewProblemSetReq(string Title);
    public record NewProblemSetResp(string Message, ProblemSet ProblemSet);

    public record AddProblemReq(Guid ProblemSetId, Problem Problem, List<ProblemResult> Results);
    public record AddProblemResp(string Message, Problem Problem, List<ProblemResult> Results);

    public record SubmitAnswerReq(Guid ProblemId, Guid? ProblemSetId, List<Guid>? SelectedResultIds, string? TextAnswer, ProblemStatus Status);
    public record SubmitAnswerResp(string Message, Guid UserAnswerId, ProblemStatus Status, DateTimeOffset AnsweredAt);
}
