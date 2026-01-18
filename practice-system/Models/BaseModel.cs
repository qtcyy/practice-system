namespace practice_system.Models
{
    public abstract class BaseModel
    {
        public Guid Id { get; set; }
        public DateTimeOffset CreateAt { get; set; }
        public DateTimeOffset UpdateAt { get; set; }
        public Guid? CreateBy { get; set; }
        public Guid? UpdateBy { get; set; }
        public long Version { get; set; }
        public bool IsDeleted { get; set; }
    }
}
