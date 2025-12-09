var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UsePathBase("/web2");
app.UseForwardedHeaders();

app.MapDefaultEndpoints();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseAuthorization();

app.MapControllers();

app.MapGet("/api/test-data", () =>
{
    var data = new[]
    {
        new { id = 1, message = "Hello from Web2", time = DateTimeOffset.UtcNow },
        new { id = 2, message = "This is a sample record", time = DateTimeOffset.UtcNow.AddMinutes(1) },
        new { id = 3, message = "Served by Web2 API", time = DateTimeOffset.UtcNow.AddMinutes(2) },
    };

    return Results.Ok(data);
});

app.MapPost("/api/login", (LoginRequest request) =>
{
    var user = string.IsNullOrWhiteSpace(request.Username) ? "guest" : request.Username.Trim();

    return Results.Ok(new
    {
        message = $"Hello, {user}! You are logged in via Web2.",
        time = DateTimeOffset.UtcNow
    });
});

app.MapFallbackToFile("/index.html");

app.Run();

public record LoginRequest(string? Username, string? Password);
