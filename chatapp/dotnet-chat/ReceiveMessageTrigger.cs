using dotnet_chat.WebSocket;
using EntityFrameworkCore.Triggered;
using Microsoft.AspNetCore.SignalR;

namespace dotnet_chat;

public class ReceiveMessageTrigger : IAfterSaveTrigger<Message>
{
        private readonly IHubContext<WebSocketHub, IClientFunctions> _hubContext;
        private readonly IMapper _mapper;
public ReceiveMessageTrigger(IHubContext<WebSocketHub, IClientFunctions> hubContext, IMapper mapper)
{
            _hubContext = hubContext;
    _mapper = mapper;
}

    public async Task AfterSave(ITriggerContext<Message> context, CancellationToken cancellationToken)
    {
        var message = context.Entity;
        await _hubContext.Clients.All.RecieveMessage(_mapper.Map<GetMessageDto>(message));
    }
}