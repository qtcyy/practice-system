using System.ComponentModel.DataAnnotations;

namespace practice_system.Models.Problems
{
    public enum ProblemResultType
    {
        Choice,
        Text
    }

    public class ProblemResult : BaseModel
    {
        [Required]
        public Guid ProblemId { get; set; }
        [Required]
        public ProblemResultType ResultType { get; set; }
        public string Content { get; set; } = "";
        public long Order { get; set; }
        public bool IsAnswer { get; set; } = false;
    }
}
