namespace practice_system.Models.Problems
{
    public enum ProblemResultType
    {
        Choice,
        Text
    }

    public class ProblemResult : BaseModel
    {
        public Guid ProblemId { get; set; }
        public ProblemResultType ResultType { get; set; }
        public string Content { get; set; } = "";
        public long Order { get; set; }
        public bool IsAnswer { get; set; }
    }
}
