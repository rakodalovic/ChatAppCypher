using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Reflection.PortableExecutable;
using System.Threading.Tasks;
using dotnet_chat.Data;
using dotnet_chat.Dtos.Message;
using dotnet_chat.Models;

namespace dotnet_chat.Services.MessageService
{
    public class MessageService : IMessageService
    {
        private readonly IMapper _mapper;
        private readonly DataContext _context;

        public MessageService(IMapper mapper, DataContext context)
        {
            _mapper = mapper;
            _context = context;
        }
        public async Task<List<GetMessageDto>> AddMessage(AddMessageDto newMessage)
        {
            //var messagesDb =await _context.Messages.ToListAsync();
            var message = _mapper.Map<Message>(newMessage);
            //message.Id=messages.Max(m=>m.Id)+1;
            _context.Messages.Add(message);
            await _context.SaveChangesAsync();
            return _context.Messages.Select(m => _mapper.Map<GetMessageDto>(m)).ToList();
        }

        public async Task<List<GetMessageDto>> DeleteMessage(int id)
        {
            try{
            //GetMessageDto messageDto=new GetMessageDto();
            var messageTemp=await _context.Messages.FindAsync(id);
            if(messageTemp is null){
                throw new Exception($"Poruka sa ID-jem '{id}' nije prondadjena");
            }
            _context.Messages.Remove(messageTemp);
            await _context.SaveChangesAsync();
            }
            catch(Exception ex){
                throw new Exception(ex.Message);
            }

            return _context.Messages.Select(c => _mapper.Map<GetMessageDto>(c)).ToList();
        }

        public async Task<List<GetMessageDto>> GetAllMessages()
        {
            var dbMessages = await _context.Messages.ToListAsync();
            return dbMessages.Select(c => _mapper.Map<GetMessageDto>(c)).ToList();
        }

        public async Task<GetMessageDto> GetMessageById(int id)
        {
            var dbMessage= await _context.Messages.FirstOrDefaultAsync(c=>c.Id==id);//moze i sa .FindAsync(id)
            //var message= messages.FirstOrDefault(c=>c.Id == id);
            if(dbMessage is not null){
                return _mapper.Map<GetMessageDto>(dbMessage);
            }
            else
            {
                throw new Exception("Message doesnt exist");
            }
            
        }

        public async Task<GetMessageDto> UpdateMessage(UpdateMessageDto updatedMessage)
        {
            var message = new Message();
            try{
            //GetMessageDto messageDto=new GetMessageDto();
            var messageTemp=await _context.Messages.FirstOrDefaultAsync(m=> m.Id == updatedMessage.Id);
            if(messageTemp is null){
                throw new Exception($"Poruka sa ID-jem '{updatedMessage.Id}' nije prondadjena");
            }

            messageTemp.Text=updatedMessage.Text;
            messageTemp.Sender=updatedMessage.Sender;
            messageTemp.SendTime=updatedMessage.SendTime;
            message=messageTemp;
            }
            catch(Exception ex){
                throw new Exception(ex.Message);
            }
            await _context.SaveChangesAsync();
            return _mapper.Map<GetMessageDto>(message);
                    
        }
    }
}