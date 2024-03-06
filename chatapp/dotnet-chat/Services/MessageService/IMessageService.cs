using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using dotnet_chat.Models;

namespace dotnet_chat.Services.MessageService
{
    public interface IMessageService
    {
        Task<List<GetMessageDto>> GetAllMessages();
        Task<GetMessageDto> GetMessageById(int id);
        Task<List<GetMessageDto>> AddMessage(AddMessageDto newMessage);
        Task<GetMessageDto> UpdateMessage(UpdateMessageDto updatedMessage);
        Task<List<GetMessageDto>> DeleteMessage(int id);
    }
}