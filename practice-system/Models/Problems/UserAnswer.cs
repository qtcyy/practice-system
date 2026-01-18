namespace practice_system.Models.Problems
{
    public class UserAnswer : BaseModel
    {
        public Guid UserId { get; set; }
        public Guid ProblemId { get; set; }
        public Guid? ProblemSetId { get; set; }
        public ProblemStatus Status { get; set; }
        public string? TextAnswer { get; set; }
        public DateTimeOffset AnsweredAt { get; set; }
    }
}
