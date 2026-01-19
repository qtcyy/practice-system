using System.ComponentModel.DataAnnotations;

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
        [Required]
        public ProblemType Type { get; set; }
        [Required]
        public Guid SetId { get; set; }
        public long Order { get; set; }
    }
}
