using System.ComponentModel.DataAnnotations;

namespace practice_system.Models.Problems
{
    public class ProblemSet : BaseModel
    {
        public string Title { get; set; } = "";
        public string? Description { get; set; }

        public Guid? UserId { get; set; }
    }
}
