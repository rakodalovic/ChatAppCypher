using Microsoft.AspNetCore.SignalR;

namespace dotnet_chat.WebSocket;

public class WebSocketHub : Hub<IClientFunctions>
{
    
        private readonly IMessageService _messageService;
        private readonly IMapper _mapper;

        public WebSocketHub(IMessageService messageService, IMapper mapper)
        {
            _messageService = messageService;
            _mapper = mapper;
        }
    public override async Task OnConnectedAsync()
    {
        var messages = await _messageService.GetAllMessages();
        await Clients.Client(Context.ConnectionId).RecieveOldMessages(_mapper.Map<List<GetMessageDto>>(messages));
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        return base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(AddMessageDto message)
    {
        await _messageService.AddMessage(message);
    }
}

public interface IClientFunctions
{
    Task RecieveMessage(GetMessageDto message);    
    Task RecieveOldMessages(List<GetMessageDto> message);
}
