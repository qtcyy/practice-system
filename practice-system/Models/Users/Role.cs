using System.ComponentModel.DataAnnotations;

namespace practice_system.Models.Users
{
    public class Role : BaseModel
    {
        [Required]
        public string RoleName { get; set; }
    }
}
