using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ColYrself.DataProvider.Models.Views
{
    public class MeetingDetails
    {
        public string[] Invited { get; set; } = [];
        public DateOnly Date { get; set; }
        public TimeOnly Time { get; set; }
        public bool IsPrivate { get; set; }
    }
}
