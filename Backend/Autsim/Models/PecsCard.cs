using System;
using System.ComponentModel.DataAnnotations;

namespace Autsim.Models
{
    public class PecsCard
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        public PecsImage Image { get; set; } // Navigation property for one-to-one relationship

        public DateTime CreationTime { get; set; } = DateTime.UtcNow;
    }
}
