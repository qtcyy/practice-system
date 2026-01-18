namespace practice_system.Models.Problems
{
    public class UserAnswerSelection : BaseModel
    {
        public Guid UserAnswerId { get; set; }
        public Guid ProblemResultId { get; set; }
    }
}
