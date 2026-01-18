namespace practice_system.Models.Problems
{
    public enum ProblemType
    {
        SingleChoice,
        MultipleChoice,
        TrueFalse,
        Essay,
    }
    public enum ProblemStatus
    {
        Unattempted,
        Correct,
        Incorrect,
        PartiallyCorrect,
        NoAnswer,
    }

    public class Problem : BaseModel
    {
        public string Content { get; set; } = "";
        public ProblemType Type { get; set; }
        public Guid SetId { get; set; }
        public long Order { get; set; }
    }
}
