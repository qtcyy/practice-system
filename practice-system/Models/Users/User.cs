using System.ComponentModel.DataAnnotations;

namespace practice_system.Models.Users
{
    public class User : BaseModel
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string PasswordHash { get; set; }
    }
}
