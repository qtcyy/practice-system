using System.ComponentModel.DataAnnotations;

namespace practice_system.Models.Users
{
    public class UserRole
    {
        [Required]
        public Guid UserId { get; set; }
        [Required]
        public string RoleId { get; set; }
    }
}
