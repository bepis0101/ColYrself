using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ColYrself.DataProvider.Models.DTOs
{
    public class MeetingDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public DateOnly Date { get; set; }
        public TimeOnly Time { get; set; }
        public bool IsPrivate { get; set; }
        public Guid OrganizerId { get; set; }
        public List<Guid> InvitedUserIds { get; set; } = new List<Guid>();
    }
}
