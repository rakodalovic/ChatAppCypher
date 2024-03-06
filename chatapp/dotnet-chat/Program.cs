global using dotnet_chat.Models;
global using dotnet_chat.Services.MessageService;
global using dotnet_chat.Dtos.Message;
global using AutoMapper;
global using Microsoft.EntityFrameworkCore;
using dotnet_chat.Data;
using dotnet_chat.WebSocket;
using dotnet_chat;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<DataContext>(options =>
    {
        options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
        options.UseTriggers(triggerOptions =>
                triggerOptions.AddTrigger<ReceiveMessageTrigger>());
    });
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddAutoMapper(typeof(Program).Assembly);
builder.Services.AddScoped<IMessageService, MessageService>();

builder.Services.AddSignalR();

builder.Services.AddCors(o => o.AddPolicy("AllowAll", b =>
{
    b.AllowAnyHeader();
    b.AllowAnyMethod();
    b.SetIsOriginAllowed(isOriginAllowed: _ => true);
    b.AllowCredentials();
}));


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll")
    .UseHttpsRedirection()
    .UseRouting();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapHub<WebSocketHub>("/chathub");

app.Run();
