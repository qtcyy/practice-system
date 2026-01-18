using System.ComponentModel.DataAnnotations;

namespace practice_system.Models.Users
{
    public class UserRole : BaseModel
    {
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public Guid RoleId { get; set; }
    }
}
