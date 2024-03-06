using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace dotnet_chat.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessageController : ControllerBase
    {
        private readonly IMessageService _messageService;

        public MessageController(IMessageService messageService)
        {
            _messageService = messageService;
        }

        [HttpGet("GetAll")]
        public async Task<ActionResult<List<GetMessageDto>>> Get()
        {
            return Ok(await _messageService.GetAllMessages());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<GetMessageDto>> GetSingle(int id)
        {
            return Ok(await _messageService.GetMessageById(id));
        }

        [HttpPost]
        public async Task<ActionResult<List<GetMessageDto>>> AddMessage(AddMessageDto newMessage){

            return Ok(await _messageService.AddMessage(newMessage));
        }

        [HttpPut]
        public async Task<ActionResult<List<GetMessageDto>>> UpdateMessage(UpdateMessageDto updatedMessage){
            var response = await _messageService.UpdateMessage(updatedMessage);
            if(response is null)
            {
                return NotFound(response);
            }
            else
            {
                return Ok(response);
            }
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<GetMessageDto>> DeleteMessage(int id)
        {
            var response = await _messageService.DeleteMessage(id);
            if(response is null)
            {
                return NotFound(response);
            }
            else
            {
                return Ok(response);
            }
        }

    }
}