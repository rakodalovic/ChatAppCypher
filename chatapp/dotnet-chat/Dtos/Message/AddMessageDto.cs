using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dotnet_chat.Dtos.Message
{
    public class AddMessageDto
    {
        public string Text { get; set; } = " ";
        public string Sender { get; set; } = " ";
        public DateTime SendTime {get; set;} = DateTime.UtcNow;
    }
}